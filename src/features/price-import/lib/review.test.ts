import { describe, expect, it } from 'vitest'
import type { ImportDraftItem } from '../types'
import { normalizeMoney, sameMoney, toPesewas } from './money'
import {
  buildReviewRows,
  detectService,
  matchExisting,
  reviewProblems,
  rowProblem,
  toAppliedPrices,
  toConfirmRows,
  type ReviewContext,
} from './review'

let seq = 0
const draft = (p: Partial<ImportDraftItem>): ImportDraftItem => ({
  id: `d${++seq}`,
  position: seq,
  item_name: 'Shirt',
  raw_name: 'Shirt',
  variant: '',
  category: '',
  pricing_method: 'PER_ITEM',
  suggested_price: '10.00',
  price_per_kg: null,
  surcharge_type: '',
  surcharge_amount: null,
  source_text: 'Shirt .... 10',
  review_state: 'LOOKS_GOOD',
  warnings: [],
  confidence: 0.95,
  match_type: 'NONE',
  matched_item: null,
  is_selected: true,
  ...p,
})
const kg = (price: string, name = 'Wash & Fold') =>
  draft({ item_name: name, raw_name: name, pricing_method: 'PER_KG', suggested_price: null, price_per_kg: price })
const ctx = (p: Partial<ReviewContext> = {}): ReviewContext => ({
  pricingModel: 'HYBRID',
  ironingAvailable: true,
  existingItems: [],
  existingPerKg: null,
  ...p,
})

describe('money is decimal-safe', () => {
  it('never turns 15 into 1500 and keeps 15.50 exact', () => {
    expect(normalizeMoney('15')).toBe('15.00')
    expect(normalizeMoney('15.5')).toBe('15.50')
    expect(normalizeMoney('15.50')).toBe('15.50')
    expect(toPesewas('15.00')).toBe(1500)
    expect(sameMoney('15', '15.00')).toBe(true)
    expect(toPesewas('1,500')).toBeNull()
  })
})

describe('service type detection', () => {
  it.each([
    ['Wash & Fold', 'Wash Only'],
    ['Washing', 'Wash Only'],
    ['Wash & Iron', 'Wash & Iron'],
    ['Wash and Iron', 'Wash & Iron'],
    ['Laundry + Press', 'Wash & Iron'],
    ['Ironing', 'Iron Only'],
    ['Iron Only', 'Iron Only'],
    ['Pressing', 'Iron Only'],
    ['Dry Clean', 'DRY_CLEAN'],
    ['Express', 'EXPRESS'],
    ['King', 'SIZE'],
    ['', null],
  ])('%s → %s', (variant, expected) => {
    expect(detectService(variant)).toBe(expected)
  })
})

describe('PER_ITEM', () => {
  it('keeps each price on its own garment and uses the owner-chosen service for unstated rows', () => {
    const rows = buildReviewRows(
      [draft({ item_name: 'Shirt', suggested_price: '10.00' }), draft({ item_name: 'Trouser', suggested_price: '15.00' }), draft({ item_name: 'Suit', suggested_price: '40.00' })],
      ctx({ pricingModel: 'BY_ITEM' }),
    )
    const applied = toAppliedPrices(rows, 'Wash & Iron')
    expect(applied.items).toEqual([
      { name: 'Shirt', service: 'Wash & Iron', price: '10.00', replaces: false },
      { name: 'Trouser', service: 'Wash & Iron', price: '15.00', replaces: false },
      { name: 'Suit', service: 'Wash & Iron', price: '40.00', replaces: false },
    ])
    expect(applied.perKg).toBeNull()
  })

  it('splits one garment with several services into separate rows by service', () => {
    const rows = buildReviewRows(
      [
        draft({ item_name: 'Shirt – Wash & Fold', variant: 'Wash & Fold', suggested_price: '10' }),
        draft({ item_name: 'Shirt – Wash & Iron', variant: 'Wash & Iron', suggested_price: '15' }),
        draft({ item_name: 'Shirt – Iron Only', variant: 'Iron Only', suggested_price: '8' }),
      ],
      ctx({ pricingModel: 'BY_ITEM' }),
    )
    expect(toAppliedPrices(rows, 'Wash Only').items).toEqual([
      { name: 'Shirt', service: 'Wash Only', price: '10.00', replaces: false },
      { name: 'Shirt', service: 'Wash & Iron', price: '15.00', replaces: false },
      { name: 'Shirt', service: 'Iron Only', price: '8.00', replaces: false },
    ])
  })

  it('an ironing price named in the row never lands in washing (live E2E finding)', () => {
    // Washing-only laundry; OCR fallback returned "Shirt Ironing" under "Also Available".
    const rows = buildReviewRows(
      [draft({ item_name: 'Shirt Ironing', raw_name: 'Shirt Ironing', category: 'Also Available', suggested_price: '8.00' })],
      ctx({ pricingModel: 'BY_ITEM', ironingAvailable: false }),
    )
    expect(rows[0].service).toBe('Iron Only')
    expect(rows[0].name).toBe('Shirt')
    expect(rows[0].include).toBe(false)
    expect(rows[0].notes.join(' ')).toMatch(/doesn't offer ironing/i)
  })

  it('uses the section heading when the row names no service (live E2E finding)', () => {
    const rows = buildReviewRows(
      [
        draft({ item_name: 'Shirt', raw_name: 'Shirt', category: 'IRONING / PRESSING', suggested_price: '6.00' }),
        draft({ item_name: 'Bedsheet (Double)', raw_name: 'Bedsheet (double)', category: 'Washing', suggested_price: '20' }),
        draft({ item_name: 'Duvet – King', raw_name: 'Duvet', variant: 'King', category: 'SPECIAL ITEMS', suggested_price: '60' }),
        draft({ item_name: 'Suit', raw_name: 'Suit', category: 'WASH & IRON', suggested_price: '40' }),
      ],
      ctx(),
    )
    expect(rows.map((r) => [r.name, r.service])).toEqual([
      ['Shirt', 'Iron Only'],
      ['Bedsheet (Double)', 'Wash Only'],
      ['Duvet (King)', 'UNSTATED'],
      ['Suit', 'Wash & Iron'],
    ])
  })

  it("the row's own words beat its heading", () => {
    const rows = buildReviewRows([draft({ item_name: 'Shirt ironing', raw_name: 'Shirt ironing', category: 'WASHING' })], ctx())
    expect(rows[0].service).toBe('Iron Only')
  })

  it('does not rename per-kg rows such as "Wash & Fold"', () => {
    const rows = buildReviewRows(
      [draft({ item_name: 'Wash & Fold', raw_name: 'Wash & Fold', pricing_method: 'PER_KG', suggested_price: null, price_per_kg: '18.00', category: 'BY WEIGHT' })],
      ctx(),
    )
    expect(rows[0].method).toBe('PER_KG')
    expect(rows[0].price).toBe('18.00')
  })

  it('keeps the size when the list gives both a size and a service (live E2E finding)', () => {
    const rows = buildReviewRows([draft({ item_name: 'Duvet – King - Wash only', variant: 'King - Wash only', suggested_price: '60' })], ctx())
    expect(rows[0].name).toBe('Duvet (King)')
    expect(rows[0].service).toBe('Wash Only')
  })

  it('keeps sizes in the name, not as a service', () => {
    const rows = buildReviewRows([draft({ item_name: 'Duvet – King', variant: 'King', suggested_price: '60' })], ctx())
    expect(rows[0].name).toBe('Duvet (King)')
    expect(rows[0].service).toBe('UNSTATED')
  })
})

describe('WASHING ONLY', () => {
  it('never puts an ironing price into a washing field', () => {
    const rows = buildReviewRows(
      [draft({ item_name: 'Shirt – Wash', variant: 'Wash', suggested_price: '10' }), draft({ item_name: 'Shirt – Ironing', variant: 'Ironing', suggested_price: '8' })],
      ctx({ pricingModel: 'BY_ITEM', ironingAvailable: false }),
    )
    const ironing = rows[1]
    expect(ironing.service).toBe('Iron Only')
    expect(ironing.include).toBe(false)
    expect(ironing.notes.join(' ')).toMatch(/doesn't offer ironing/)
    const applied = toAppliedPrices(rows, 'Wash Only')
    expect(applied.items).toEqual([{ name: 'Shirt', service: 'Wash Only', price: '10.00', replaces: false }])
  })
})

describe('IRONING ONLY', () => {
  it('maps ironing rows to Iron Only and leaves dry cleaning for the owner to decide', () => {
    const rows = buildReviewRows(
      [
        draft({ item_name: 'Shirt – Iron', variant: 'Iron', suggested_price: '5' }),
        draft({ item_name: 'Shirt – Dry Clean', variant: 'Dry Clean', suggested_price: '20' }),
      ],
      ctx({ pricingModel: 'BY_ITEM' }),
    )
    expect(rows[0].service).toBe('Iron Only')
    expect(rows[1].service).toBe('')
    expect(rows[1].include).toBe(false)
    // If the owner includes it without choosing a type, it is blocked, not guessed.
    expect(rowProblem({ ...rows[1], include: true }, 'Iron Only')).toBe('Choose a service type.')
    expect(toAppliedPrices(rows, 'Iron Only').items).toEqual([{ name: 'Shirt', service: 'Iron Only', price: '5.00', replaces: false }])
  })
})

describe('PER_KG', () => {
  it('is not dropped: a weight laundry gets the per-kg price and item rows are left out', () => {
    const rows = buildReviewRows([kg('18.00'), draft({ item_name: 'Shirt', suggested_price: '10' })], ctx({ pricingModel: 'BY_WEIGHT' }))
    expect(rows[0].include).toBe(true)
    expect(rows[1].include).toBe(false)
    expect(rows[1].notes.join(' ')).toMatch(/prices by weight/)
    const applied = toAppliedPrices(rows, 'Wash Only')
    expect(applied.perKg).toEqual({ price: '18.00', replaces: false })
    expect(applied.items).toEqual([])
  })

  it('a per-item laundry is told to switch to hybrid instead of silently losing the kg price', () => {
    const rows = buildReviewRows([kg('20')], ctx({ pricingModel: 'BY_ITEM' }))
    expect(rows[0].include).toBe(false)
    expect(rows[0].notes.join(' ')).toMatch(/Hybrid/)
  })

  it('only one per-kg price can be kept', () => {
    const rows = buildReviewRows([kg('18'), kg('25', 'Wash & Iron')], ctx())
    expect(rows.filter((r) => r.include && r.method === 'PER_KG')).toHaveLength(1)
    const both = rows.map((r) => ({ ...r, include: true }))
    expect(reviewProblems(both, 'Wash Only').join(' ')).toMatch(/one per-kg price/)
  })

  it('an existing per-kg price is kept unless the owner chooses the detected one', () => {
    const rows = buildReviewRows([kg('20')], ctx({ existingPerKg: '18.00' }))
    expect(rows[0].existing?.price).toBe('18.00')
    expect(toAppliedPrices(rows, 'Wash Only').perKg).toBeNull()
    expect(toAppliedPrices([{ ...rows[0], choice: 'USE_DETECTED' }], 'Wash Only').perKg).toEqual({ price: '20.00', replaces: true })
  })
})

describe('HYBRID', () => {
  it('keeps item prices AND the per-kg price, never converting one into the other', () => {
    const rows = buildReviewRows(
      [draft({ item_name: 'Shirt', suggested_price: '12' }), draft({ item_name: 'Trouser', suggested_price: '15' }), kg('20', 'Bulk Wash')],
      ctx({ pricingModel: 'HYBRID' }),
    )
    const applied = toAppliedPrices(rows, 'Wash & Iron')
    expect(applied.items.map((i) => [i.name, i.price])).toEqual([['Shirt', '12.00'], ['Trouser', '15.00']])
    expect(applied.perKg).toEqual({ price: '20.00', replaces: false })
  })
})

describe('existing values are protected', () => {
  it('Shirt 15 already in the form vs detected 18: keep existing by default', () => {
    const c = ctx({ existingItems: [{ name: 'Shirt', category: 'Wash Only', price: '15' }] })
    const rows = matchExisting(buildReviewRows([draft({ item_name: 'Shirt', suggested_price: '18' })], c), c, 'Wash Only')
    expect(rows[0].existing).toMatchObject({ name: 'Shirt', price: '15.00' })
    expect(rows[0].choice).toBe('KEEP')
    expect(toAppliedPrices(rows, 'Wash Only').items).toEqual([])
    const use = [{ ...rows[0], choice: 'USE_DETECTED' as const }]
    expect(toAppliedPrices(use, 'Wash Only').items).toEqual([{ name: 'Shirt', service: 'Wash Only', price: '18.00', replaces: true }])
  })

  it('a match under a different service is not treated as the same price', () => {
    const c = ctx({ existingItems: [{ name: 'Shirt', category: 'Iron Only', price: '5' }] })
    const rows = matchExisting(buildReviewRows([draft({ item_name: 'Shirt', suggested_price: '18' })], c), c, 'Wash Only')
    expect(rows[0].existing).toBeNull()
  })

  it('server duplicate suggestions start on keep-existing', () => {
    const rows = buildReviewRows(
      [draft({ item_name: 'Wash Shirt', suggested_price: '18', match_type: 'POSSIBLE', matched_item: { id: 'x1', item_name: 'Shirt Wash', unit_price: '15.00', category: 'Wash Only' } })],
      ctx(),
    )
    expect(rows[0].choice).toBe('KEEP')
    expect(rows[0].existingSource).toBe('server')
  })
})

describe('confirm payload (dashboard)', () => {
  it('maps keep / update / create new / ignore and per-kg correctly', () => {
    const rows = buildReviewRows(
      [
        draft({ item_name: 'Wash Shirt', suggested_price: '18', match_type: 'POSSIBLE', matched_item: { id: 'x1', item_name: 'Shirt Wash', unit_price: '15.00', category: 'Wash Only' } }),
        draft({ item_name: 'Trouser', suggested_price: '15' }),
        draft({ item_name: 'Tie', suggested_price: '5', is_selected: false }),
        kg('20'),
      ],
      ctx(),
    )
    const keep = toConfirmRows(rows, 'Wash Only', false)
    expect(keep.map((r) => r.action)).toEqual(['IGNORE', 'CREATE', 'IGNORE', 'CREATE'])
    expect(keep[3]).toMatchObject({ pricing_method: 'PER_KG', price_per_kg: '20.00' })

    rows[0] = { ...rows[0], choice: 'USE_DETECTED' }
    const upd = toConfirmRows(rows, 'Wash Only', true)
    expect(upd[0]).toMatchObject({ action: 'UPDATE', existing_item_id: 'x1', unit_price: '18.00' })
    expect(upd[3]).toMatchObject({ action: 'UPDATE', pricing_method: 'PER_KG' })

    rows[0] = { ...rows[0], choice: 'CREATE_NEW' }
    expect(toConfirmRows(rows, 'Wash Only', true)[0]).toMatchObject({ action: 'CREATE', item_name: 'Wash Shirt (Wash Only)' })
  })

  it('the same garment under two services gets distinct names', () => {
    const rows = buildReviewRows(
      [draft({ item_name: 'Shirt – Wash & Iron', variant: 'Wash & Iron', suggested_price: '15' }), draft({ item_name: 'Shirt – Iron', variant: 'Iron', suggested_price: '8' })],
      ctx(),
    )
    expect(toConfirmRows(rows, 'Wash Only', false).map((r) => 'item_name' in r && r.item_name)).toEqual(['Shirt (Wash & Iron)', 'Shirt (Iron Only)'])
  })

  it('unreadable or unknown-method rows are never sent as saves', () => {
    const rows = buildReviewRows([draft({ suggested_price: null, review_state: 'UNREADABLE' }), draft({ pricing_method: 'UNKNOWN', item_name: 'Duvet' })], ctx())
    expect(rows.every((r) => !r.include)).toBe(true)
    expect(toConfirmRows(rows, 'Wash Only', false).map((r) => r.action)).toEqual(['IGNORE', 'IGNORE'])
  })
})
