import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ImportDraftItem, ImportJob } from '@/features/price-import/types'

const api = vi.hoisted(() => ({
  getScanAvailability: vi.fn(),
  scanPriceList: vi.fn(),
  cancelImport: vi.fn(),
  confirmImport: vi.fn(),
}))
vi.mock('@/features/price-import/api', async (orig) => ({
  ...(await orig<typeof import('@/features/price-import/api')>()),
  ...api,
}))
const bizApi = vi.hoisted(() => ({ getPricingItems: vi.fn(), getWeightPricing: vi.fn() }))
vi.mock('../api', () => bizApi)

import { DashboardPriceScan } from './DashboardPriceScan'

const d = (p: Partial<ImportDraftItem>): ImportDraftItem => ({
  id: `d-${Math.random().toString(36).slice(2)}`, position: 0, item_name: 'Shirt', raw_name: 'Shirt', variant: '',
  category: '', pricing_method: 'PER_ITEM', suggested_price: '12.00', price_per_kg: null, surcharge_type: '',
  surcharge_amount: null, source_text: '', review_state: 'LOOKS_GOOD', warnings: [], confidence: 0.9,
  match_type: 'NONE', matched_item: null, is_selected: true, ...p,
})
const job = (drafts: ImportDraftItem[]): ImportJob => ({
  id: 'job-9', status: 'READY', review_required: true, provider: '', error: '', error_code: '', currency: 'GHS',
  document_warnings: [], summary: { total: 0, looks_good: 0, please_check: 0, could_not_read: 0, possible_matches: 0 },
  served_from_cache: false, draft_items: drafts, created_at: '', completed_at: '', confirmed_at: null,
})

beforeEach(() => {
  vi.clearAllMocks()
  api.getScanAvailability.mockResolvedValue({ available: true })
  URL.createObjectURL = vi.fn(() => 'blob:x')
  URL.revokeObjectURL = vi.fn()
})

describe('dashboard: existing owner imports with duplicate handling', () => {
  it('Update existing / Create / Ignore and per-kg go to the server confirm, then reload', async () => {
    const possible = d({
      item_name: 'Wash Shirt', suggested_price: '18', match_type: 'POSSIBLE',
      matched_item: { id: 'item-1', item_name: 'Shirt Wash', unit_price: '15.00', category: 'Wash Only' },
      warnings: ['POSSIBLE_MATCH'],
    })
    const trouser = d({ item_name: 'Trouser', suggested_price: '15' })
    const perKg = d({ item_name: 'Bulk', pricing_method: 'PER_KG', suggested_price: null, price_per_kg: '20' })
    api.scanPriceList.mockResolvedValue(job([possible, trouser, perKg]))
    api.confirmImport.mockResolvedValue({ created: ['Trouser'], updated: ['Shirt Wash', 'Per-kg price'], skipped: [], already_confirmed: false })
    bizApi.getPricingItems.mockResolvedValue([{ id: 'item-1' }])
    bizApi.getWeightPricing.mockResolvedValue({ base_price_per_kg: '20.00' })
    const onItems = vi.fn()
    const onWeight = vi.fn()

    render(
      <DashboardPriceScan
        pricingModel="HYBRID"
        ironingAvailable
        pricingItems={[{ id: 'item-1', item_name: 'Shirt Wash', category: 'Wash Only', unit_price: '15.00', is_active: true, display_order: 0 }]}
        weightPricing={{ id: 'w', base_price_per_kg: '18.00', minimum_charge: '0', minimum_order_weight_kg: null, rounding_strategy: 'NONE', is_active: true }}
        onItemsChanged={onItems}
        onWeightChanged={onWeight}
      />,
    )
    await screen.findByRole('button', { name: /take a photo/i })
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['x'], 'l.jpg', { type: 'image/jpeg' })] } })
    fireEvent.click(await screen.findByRole('button', { name: /read price list/i }))
    await screen.findByText(/possible prices/i)

    // Both matches start on "Keep existing"; nothing is overwritten by default.
    expect(screen.getAllByText(/Existing:/)).toHaveLength(2)
    fireEvent.click(screen.getAllByLabelText('Update existing')[0])
    fireEvent.click(screen.getAllByLabelText('Use detected')[0])
    fireEvent.click(screen.getByRole('button', { name: /confirm & import/i }))

    await waitFor(() => expect(api.confirmImport).toHaveBeenCalledTimes(1))
    const [jobId, rows, currencyOk] = api.confirmImport.mock.calls[0]
    expect(jobId).toBe('job-9')
    expect(currencyOk).toBe(false)
    expect(rows).toEqual([
      expect.objectContaining({ action: 'UPDATE', existing_item_id: 'item-1', unit_price: '18.00', pricing_method: 'PER_ITEM' }),
      expect.objectContaining({ action: 'CREATE', item_name: 'Trouser', unit_price: '15.00', category: 'Wash Only' }),
      expect.objectContaining({ action: 'UPDATE', pricing_method: 'PER_KG', price_per_kg: '20.00' }),
    ])
    await waitFor(() => expect(onItems).toHaveBeenCalled())
    expect(onWeight).toHaveBeenCalledWith({ base_price_per_kg: '20.00' })
    expect(await screen.findByText(/saved 1 new, updated 2/i)).toBeInTheDocument()
  })

  it('keeping existing values sends IGNORE, not an overwrite', async () => {
    api.scanPriceList.mockResolvedValue(job([d({ item_name: 'Shirt Wash', suggested_price: '18' }), d({ item_name: 'Tie', suggested_price: '5' })]))
    api.confirmImport.mockResolvedValue({ created: ['Tie'], updated: [], skipped: [], already_confirmed: false })
    bizApi.getPricingItems.mockResolvedValue([])
    bizApi.getWeightPricing.mockResolvedValue(null)
    render(
      <DashboardPriceScan pricingModel="BY_ITEM" pricingItems={[{ id: 'i1', item_name: 'Shirt Wash', category: 'Wash Only', unit_price: '15.00', is_active: true, display_order: 0 }]}
        weightPricing={null} onItemsChanged={vi.fn()} onWeightChanged={vi.fn()} />,
    )
    await screen.findByRole('button', { name: /take a photo/i })
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['x'], 'l.jpg', { type: 'image/jpeg' })] } })
    fireEvent.click(await screen.findByRole('button', { name: /read price list/i }))
    fireEvent.click(await screen.findByRole('button', { name: /confirm & import/i }))
    await waitFor(() => expect(api.confirmImport).toHaveBeenCalled())
    expect(api.confirmImport.mock.calls[0][1].map((r: { action: string }) => r.action)).toEqual(['IGNORE', 'CREATE'])
  })
})
