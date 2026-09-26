'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { WeightPricing, PricingItem } from '@/shared/types'
import type { LaundryPricingModel } from '@/features/price-import/types'
import { WeightPricingEditor } from './WeightPricingEditor'
import { PriceItemsEditor } from './PriceItemsEditor'
import { DashboardPriceScan } from './DashboardPriceScan'
import { AdvancedPricingPanel } from './AdvancedPricingPanel'

interface ServicesPricingTabProps {
  usesWeight: boolean
  usesItems: boolean
  weightPricing: WeightPricing | null
  setWeightPricing: (pricing: WeightPricing) => void
  pricingItems: PricingItem[]
  setPricingItems: (items: PricingItem[]) => void
  pricingModel?: LaundryPricingModel
  ironingAvailable?: boolean
}

export const ServicesPricingTab = ({
  usesWeight,
  usesItems,
  weightPricing,
  setWeightPricing,
  pricingItems,
  setPricingItems,
  pricingModel,
  ironingAvailable,
}: ServicesPricingTabProps) => {
  return (
    <div className="space-y-6">
      {/* Weight-based Tariff (when applicable) */}
      {usesWeight && (
        <Card>
          <CardHeader>
            <CardTitle>Weight-Based Pricing</CardTitle>
            <CardDescription>
              Configure your standard rate per kilogram and minimum order requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeightPricingEditor pricing={weightPricing} onSaved={setWeightPricing} />
          </CardContent>
        </Card>
      )}

      {/* Item-based Price List (when applicable) */}
      {usesItems && (
        <Card>
          <CardHeader>
            <CardTitle>Per-Item Price List</CardTitle>
            <CardDescription>
              Manage pricing for specific individual garments and specialized laundry services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PriceItemsEditor items={pricingItems} onSaved={setPricingItems} />
          </CardContent>
        </Card>
      )}

      {/* Fill prices from a photo of an existing price list */}
      {pricingModel && (
        <DashboardPriceScan
          pricingModel={pricingModel}
          ironingAvailable={ironingAvailable}
          pricingItems={pricingItems}
          weightPricing={weightPricing}
          onItemsChanged={setPricingItems}
          onWeightChanged={setWeightPricing}
        />
      )}

      {/* Advanced Pricing: Scheduled Changes & Delivery Zones */}
      <AdvancedPricingPanel />
    </div>
  )
}
