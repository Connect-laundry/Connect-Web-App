'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { WeightPricing, PricingItem } from '@/shared/interfaces'
import { WeightPricingEditor } from './WeightPricingEditor'
import { PriceItemsEditor } from './PriceItemsEditor'
import { PriceImportPanel } from './PriceImportPanel'
import { AdvancedPricingPanel } from './AdvancedPricingPanel'

interface ServicesPricingTabProps {
  usesWeight: boolean
  usesItems: boolean
  weightPricing: WeightPricing | null
  setWeightPricing: (pricing: WeightPricing) => void
  pricingItems: PricingItem[]
  setPricingItems: (items: PricingItem[]) => void
  getPricingItems: () => Promise<PricingItem[]>
}

export function ServicesPricingTab({
  usesWeight,
  usesItems,
  weightPricing,
  setWeightPricing,
  pricingItems,
  setPricingItems,
  getPricingItems,
}: ServicesPricingTabProps) {
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

      {/* AI Photo & Bulk Import Tools */}
      <PriceImportPanel onImported={setPricingItems} reloadItems={getPricingItems} />

      {/* Advanced Pricing: Scheduled Changes & Delivery Zones */}
      <AdvancedPricingPanel />
    </div>
  )
}
