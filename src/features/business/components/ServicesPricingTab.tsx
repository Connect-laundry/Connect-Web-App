'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { WeightPricing, PricingItem } from '@/shared/types'
import type { LaundryPricingModel } from '@/features/price-import/types'
import { WeightPricingEditor } from './WeightPricingEditor'
import { PriceItemsEditor } from './PriceItemsEditor'
import { DashboardPriceScan } from './DashboardPriceScan'
import { unifiedPricingEnabled } from '../lib/unified-pricing'
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
      {(usesItems || unifiedPricingEnabled) && (
        <Card>
          <CardHeader>
            <CardTitle>Services &amp; prices</CardTitle>
            <CardDescription>
              Manage item, weight, basket and package prices together. You can use more than one pricing method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pricingModel && (
              <div className="mb-6 border-b pb-6">
                <DashboardPriceScan
                  pricingModel={pricingModel}
                  ironingAvailable={ironingAvailable}
                  pricingItems={pricingItems}
                  weightPricing={weightPricing}
                  onItemsChanged={setPricingItems}
                  onWeightChanged={setWeightPricing}
                />
              </div>
            )}
            <PriceItemsEditor items={pricingItems} onSaved={setPricingItems} />
          </CardContent>
        </Card>
      )}

      {/* Weight-only laundries still need an import entry point even without item rows. */}
      {pricingModel && !usesItems && !unifiedPricingEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Import a price list</CardTitle>
            <CardDescription>Upload a photo or PDF and review the extracted weight prices before saving.</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardPriceScan
              pricingModel={pricingModel}
              ironingAvailable={ironingAvailable}
              pricingItems={pricingItems}
              weightPricing={weightPricing}
              onItemsChanged={setPricingItems}
              onWeightChanged={setWeightPricing}
            />
          </CardContent>
        </Card>
      )}

      {/* Advanced Pricing: Scheduled Changes & Delivery Zones */}
      <AdvancedPricingPanel />
    </div>
  )
}
