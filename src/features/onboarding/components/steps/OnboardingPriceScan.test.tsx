import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ImportDraftItem, ImportJob } from '@/features/price-import/types'

const api = vi.hoisted(() => ({
  getScanAvailability: vi.fn(),
  scanPriceList: vi.fn(),
  cancelImport: vi.fn(),
}))
vi.mock('@/features/price-import/api', async (orig) => ({
  ...(await orig<typeof import('@/features/price-import/api')>()),
  ...api,
}))

import { PriceListStep } from './PriceListStep'
import { PricingDeliveryStep } from './PricingDeliveryStep'
import type { ExpressByService, PriceItem, WeightTier } from '../../types'

const d = (p: Partial<ImportDraftItem>): ImportDraftItem => ({
  id: Math.random().toString(36).slice(2),
  position: 0,
  item_name: 'Shirt',
  raw_name: 'Shirt',
  variant: '',
  category: '',
  pricing_method: 'PER_ITEM',
  suggested_price: '12.00',
  price_per_kg: null,
  surcharge_type: '',
  surcharge_amount: null,
  source_text: '',
  review_state: 'LOOKS_GOOD',
  warnings: [],
  confidence: 0.9,
  match_type: 'NONE',
  matched_item: null,
  is_selected: true,
  ...p,
})
const kg = (price: string) => d({ item_name: 'Bulk Wash', raw_name: 'Bulk Wash', pricing_method: 'PER_KG', suggested_price: null, price_per_kg: price })
const job = (drafts: ImportDraftItem[]): ImportJob => ({
  id: 'j1', status: 'READY', review_required: true, provider: '', error: '', error_code: '', currency: 'GHS',
  document_warnings: [], summary: { total: 0, looks_good: 0, please_check: 0, could_not_read: 0, possible_matches: 0 },
  served_from_cache: false, draft_items: drafts, created_at: '', completed_at: '', confirmed_at: null,
})

/** Latest wizard state, recorded after each render. */
const state: { items: PriceItem[]; tiers: WeightTier[] } = { items: [], tiers: [] }

function Harness({
  step,
  pricingModel,
  ironing = true,
  initialItems = [],
  initialTiers = [{ weight_kg: '', price: '' }],
}: {
  step: 'pricelist' | 'pricing'
  pricingModel: 'BY_ITEM' | 'BY_WEIGHT' | 'HYBRID'
  ironing?: boolean
  initialItems?: PriceItem[]
  initialTiers?: WeightTier[]
}) {
  const form = useForm({ defaultValues: { pricing_model: pricingModel, ironing_available: ironing, price_range: '$$', estimated_delivery_hours: '24' } })
  const [items, setItems] = useState<PriceItem[]>(initialItems)
  const [tiers, setTiers] = useState<WeightTier[]>(initialTiers)
  const [express, setExpress] = useState<ExpressByService>({})
  useEffect(() => {
    state.items = items
    state.tiers = tiers
  }, [items, tiers])
  return (
    <FormProvider {...form}>
      {step === 'pricelist' ? (
        <PriceListStep items={items} setItems={setItems} express={express} setExpress={setExpress}
          isHybrid={pricingModel === 'HYBRID'} weightTiers={tiers} setWeightTiers={setTiers} />
      ) : (
        <PricingDeliveryStep weightTiers={tiers} setWeightTiers={setTiers} express={express} setExpress={setExpress} />
      )}
    </FormProvider>
  )
}

const photo = () => new File([new Uint8Array([0xff, 0xd8, 0xff])], 'list.jpg', { type: 'image/jpeg' })

async function scanAndApply(drafts: ImportDraftItem[], before?: () => void) {
  api.scanPriceList.mockResolvedValue(job(drafts))
  await screen.findByRole('button', { name: /take a photo/i })
  fireEvent.change(screen.getByTestId('file-input'), { target: { files: [photo()] } })
  fireEvent.click(await screen.findByRole('button', { name: /read price list/i }))
  await screen.findByText(/possible price/i)
  before?.()
  fireEvent.click(screen.getByRole('button', { name: /apply prices/i }))
  await screen.findByText(/to your form/i)
}

beforeEach(() => {
  vi.clearAllMocks()
  api.getScanAvailability.mockResolvedValue({ available: true })
  URL.createObjectURL = vi.fn(() => 'blob:x')
  URL.revokeObjectURL = vi.fn()
})

describe('onboarding: scan fills the existing pricing form (nothing saved)', () => {
  it('HYBRID keeps item prices AND the per-kg price', async () => {
    render(<Harness step="pricelist" pricingModel="HYBRID" />)
    await scanAndApply([d({ item_name: 'Shirt', suggested_price: '12' }), d({ item_name: 'Trouser', suggested_price: '15' }), kg('20')])
    expect(state.items).toEqual([
      { item_name: 'Shirt', category: 'Wash Only', unit_price: '12.00', is_custom: false },
      { item_name: 'Trouser', category: 'Wash Only', unit_price: '15.00', is_custom: true },
    ])
    expect(state.tiers).toEqual([{ weight_kg: '1', price: '20.00' }])
    expect(api.scanPriceList).toHaveBeenCalledTimes(1)
  })

  it('applies unstated rows to the service tab the owner is on', async () => {
    render(<Harness step="pricelist" pricingModel="BY_ITEM" />)
    fireEvent.click(await screen.findByRole('button', { name: /wash \+ ironing/i }))
    await scanAndApply([d({ item_name: 'Shirt', suggested_price: '15' })])
    expect(state.items).toEqual([{ item_name: 'Shirt', category: 'Wash & Iron', unit_price: '15.00', is_custom: false }])
  })

  it('WASHING ONLY: an ironing price never lands in a washing field', async () => {
    render(<Harness step="pricelist" pricingModel="BY_ITEM" ironing={false} />)
    await scanAndApply([
      d({ item_name: 'Shirt – Wash', variant: 'Wash', suggested_price: '10' }),
      d({ item_name: 'Trouser – Wash', variant: 'Wash', suggested_price: '15' }),
      d({ item_name: 'Shirt – Ironing', variant: 'Ironing', suggested_price: '8' }),
    ])
    expect(state.items).toEqual([
      { item_name: 'Shirt', category: 'Wash Only', unit_price: '10.00', is_custom: false },
      { item_name: 'Trouser', category: 'Wash Only', unit_price: '15.00', is_custom: true },
    ])
  })

  it('IRONING ONLY: ironing rows go to Iron Only; dry cleaning is left for the owner', async () => {
    render(<Harness step="pricelist" pricingModel="BY_ITEM" />)
    fireEvent.click(await screen.findByRole('button', { name: /ironing only/i }))
    await scanAndApply([
      d({ item_name: 'Shirt – Iron', variant: 'Iron', suggested_price: '5' }),
      d({ item_name: 'Suit – Dry Clean', variant: 'Dry Clean', suggested_price: '40' }),
    ])
    expect(state.items).toEqual([{ item_name: 'Shirt', category: 'Iron Only', unit_price: '5.00', is_custom: false }])
  })

  it('existing Shirt GH₵15 is kept unless the owner picks the detected GH₵18', async () => {
    const initialItems = [{ item_name: 'Shirt', category: 'Wash Only', unit_price: '15' }]
    const { unmount } = render(<Harness step="pricelist" pricingModel="BY_ITEM" initialItems={initialItems} />)
    api.scanPriceList.mockResolvedValue(job([d({ item_name: 'Shirt', suggested_price: '18' }), d({ item_name: 'Tie', suggested_price: '5' })]))
    await screen.findByRole('button', { name: /take a photo/i })
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [photo()] } })
    fireEvent.click(await screen.findByRole('button', { name: /read price list/i }))
    expect(await screen.findByText(/Existing:/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /apply prices/i }))
    await screen.findByText(/to your form/i)
    expect(state.items.find((i) => i.item_name === 'Shirt')?.unit_price).toBe('15')
    expect(state.items.find((i) => i.item_name === 'Tie')?.unit_price).toBe('5.00')
    unmount()

    render(<Harness step="pricelist" pricingModel="BY_ITEM" initialItems={initialItems} />)
    await scanAndApply([d({ item_name: 'Shirt', suggested_price: '18' })], () => {
      fireEvent.click(screen.getByLabelText('Use detected'))
    })
    expect(state.items).toEqual([{ item_name: 'Shirt', category: 'Wash Only', unit_price: '18.00' }])
  })
})

describe('onboarding: PER_KG on the pricing step (weight-only laundries)', () => {
  it('PER_KG is not dropped: it becomes the 1 kg tier, other tiers untouched', async () => {
    render(<Harness step="pricing" pricingModel="BY_WEIGHT" initialTiers={[{ weight_kg: '5', price: '80' }]} />)
    await scanAndApply([kg('18'), d({ item_name: 'Shirt', suggested_price: '10' })])
    expect(state.tiers).toEqual([{ weight_kg: '1', price: '18.00' }, { weight_kg: '5', price: '80' }])
    expect(state.items).toEqual([])
  })

  it('a per-item laundry never sees the scan on the pricing step', async () => {
    render(<Harness step="pricing" pricingModel="BY_ITEM" />)
    await waitFor(() => expect(screen.getByText(/how do you price/i)).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: /take a photo/i })).not.toBeInTheDocument()
  })
})
