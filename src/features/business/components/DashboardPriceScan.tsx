'use client'

import dynamic from 'next/dynamic'
// Loaded on demand so the pricing form itself stays light; manual entry
// is usable immediately and the panel appears once it (and availability) load.
const PriceListScanPanel = dynamic(
  () => import('@/features/price-import/components/PriceListScanPanel').then((m) => m.PriceListScanPanel),
  { ssr: false },
)
import { confirmImport } from '@/features/price-import/api'
import { scanErrorText } from '@/features/price-import/lib/messages'
import { toConfirmRows } from '@/features/price-import/lib/review'
import type { LaundryPricingModel } from '@/features/price-import/types'
import type { PricingItem, WeightPricing } from '@/shared/types'
import { getPricingItems, getWeightPricing } from '../api'

interface Props {
  pricingModel: LaundryPricingModel
  ironingAvailable?: boolean
  pricingItems: PricingItem[]
  weightPricing: WeightPricing | null
  onItemsChanged: (items: PricingItem[]) => void
  onWeightChanged: (pricing: WeightPricing) => void
}

/**
 * Existing owners: scan → review (keep / update / create / ignore per row) →
 * "Confirm & import". The server revalidates every row, saves atomically,
 * never overwrites unless the owner chose "Update", and a repeated confirm
 * can't create duplicates.
 */
export const DashboardPriceScan = ({
  pricingModel,
  ironingAvailable,
  pricingItems,
  weightPricing,
  onItemsChanged,
  onWeightChanged,
}: Props) => (
  <PriceListScanPanel
    scope="dashboard"
    key={pricingModel}
    context={{
      pricingModel,
      ironingAvailable,
      existingItems: pricingItems.map((it) => ({
        id: it.id,
        name: it.item_name,
        category: it.category,
        price: it.unit_price,
      })),
      existingPerKg: weightPricing?.base_price_per_kg ?? null,
    }}
    applyLabel="Confirm & import"
    applyHint="Only the rows you keep are saved. Prices you chose to keep stay as they are."
    onApply={async (scan) => {
      if (!scan.job) throw new Error('Please scan your price list again.')
      const rows = toConfirmRows(scan.rows, scan.defaultService, !!weightPricing)
      let result
      try {
        result = await confirmImport(scan.job.id, rows, scan.currencyConfirmed)
      } catch (e) {
        const code = (e as { code?: string }).code ?? ''
        if (code === 'VALIDATION_FAILED' || code === 'CURRENCY_CONFIRMATION_REQUIRED' || code === 'NOTHING_TO_IMPORT') {
          throw new Error((e as Error).message || 'Some rows need attention before importing.')
        }
        throw new Error(scanErrorText(code))
      }
      onItemsChanged(await getPricingItems())
      const weight = await getWeightPricing().catch(() => null)
      if (weight) onWeightChanged(weight)
      const parts = [`Saved ${result.created.length} new`]
      if (result.updated.length) parts.push(`updated ${result.updated.length}`)
      if (result.skipped.length) parts.push(`skipped ${result.skipped.length} you already had`)
      return `${parts.join(', ')}.`
    }}
  />
)
