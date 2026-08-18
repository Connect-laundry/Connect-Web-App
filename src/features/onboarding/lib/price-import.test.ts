import { describe, expect, it } from 'vitest'
import {
  draftsToPriceItems,
  normalizeDrafts,
  type OnboardingPriceImportDraftRow,
} from './price-import'

const row = (over: Partial<OnboardingPriceImportDraftRow>): OnboardingPriceImportDraftRow => ({
  id: 'x',
  item_name: 'Shirt',
  suggested_price: '10.00',
  category: 'Shirts',
  confidence: 1,
  is_selected: true,
  unit_price: '10.00',
  ...over,
})

describe('normalizeDrafts', () => {
  it('renders suggested_price as an editable string, coercing numbers and null', () => {
    const rows = normalizeDrafts([
      { id: '1', item_name: 'Shirt', suggested_price: '15.00', category: 'Shirts', confidence: 0.9, is_selected: true },
      { id: '2', item_name: 'Duvet', suggested_price: 50, category: 'Bedding', confidence: 0.8, is_selected: true },
      { id: '3', item_name: 'Odd', suggested_price: null, category: '', confidence: null, is_selected: false },
    ])
    expect(rows.map((r) => r.unit_price)).toEqual(['15.00', '50', ''])
  })

  it('returns an empty array when given no drafts', () => {
    expect(normalizeDrafts()).toEqual([])
  })
})

describe('draftsToPriceItems', () => {
  it('assigns the active SERVICE category, discarding the OCR garment category', () => {
    const items = draftsToPriceItems([row({ category: 'Shirts' })], 'Wash & Iron')
    expect(items).toEqual([
      { item_name: 'Shirt', category: 'Wash & Iron', unit_price: '10.00', is_custom: false },
    ])
  })

  it('marks recognised common items as selectable and unknown names as custom', () => {
    const items = draftsToPriceItems(
      [row({ item_name: 'Shirt' }), row({ id: 'y', item_name: 'Bespoke Gown' })],
      'Wash Only',
    )
    expect(items[0].is_custom).toBe(false)
    expect(items[1].is_custom).toBe(true)
    expect(items[1].item_name).toBe('Bespoke Gown')
  })

  it('trims names and prices', () => {
    const items = draftsToPriceItems([row({ item_name: '  Jeans ', unit_price: ' 20 ' })], 'Wash Only')
    expect(items[0]).toMatchObject({ item_name: 'Jeans', unit_price: '20' })
  })

  it('skips rows that are unselected, unnamed, or have no price', () => {
    const items = draftsToPriceItems(
      [
        row({ is_selected: false }),
        row({ id: 'a', item_name: '   ' }),
        row({ id: 'b', unit_price: '' }),
      ],
      'Wash Only',
    )
    expect(items).toHaveLength(0)
  })
})
