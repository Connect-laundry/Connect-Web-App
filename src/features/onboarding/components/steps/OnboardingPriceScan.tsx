'use client'

import { useFormContext } from 'react-hook-form'
import dynamic from 'next/dynamic'
// Loaded on demand so the pricing form itself stays light; manual entry
// is usable immediately and the panel appears once it (and availability) load.
const PriceListScanPanel = dynamic(
  () => import('@/features/price-import/components/PriceListScanPanel').then((m) => m.PriceListScanPanel),
  { ssr: false },
)
import { toAppliedPrices } from '@/features/price-import/lib/review'
import type { LaundryPricingModel, ServiceType } from '@/features/price-import/types'
import { appliedSummary, mergeItems, mergePerKg, onboardingReviewContext } from '../../lib/apply-scan'
import type { PriceItem, WeightTier } from '../../types'

interface Props {
  items: PriceItem[]
  setItems: (updater: (prev: PriceItem[]) => PriceItem[]) => void
  weightTiers: WeightTier[]
  setWeightTiers: (updater: (prev: WeightTier[]) => WeightTier[]) => void
  /** The service tab the owner is on (item pricing). */
  activeService?: ServiceType
}

/**
 * "Already have a price list?" inside onboarding. Scanned prices fill the
 * wizard's own form (items per service tab, per-kg as a weight tier); the
 * owner edits them there and they are saved by the normal final submit.
 */
export const OnboardingPriceScan = ({ items, setItems, weightTiers, setWeightTiers, activeService }: Props) => {
  const form = useFormContext()
  const pricingModel = (form.watch('pricing_model') || 'BY_ITEM') as LaundryPricingModel
  const ironingAvailable = form.watch('ironing_available') as boolean | undefined
  const context = onboardingReviewContext(pricingModel, ironingAvailable, items, weightTiers)

  return (
    <PriceListScanPanel
      scope="onboarding"
      key={pricingModel}
      context={context}
      initialService={activeService}
      applyLabel="Apply prices"
      applyHint="Applying fills your form below. You can still edit everything before you finish."
      onApply={async (scan) => {
        const applied = toAppliedPrices(scan.rows, scan.defaultService)
        if (applied.items.length) setItems((prev) => mergeItems(prev, applied.items))
        if (applied.perKg) setWeightTiers((prev) => mergePerKg(prev, applied.perKg))
        return appliedSummary(applied)
      }}
    />
  )
}
