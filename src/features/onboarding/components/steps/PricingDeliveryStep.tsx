import { useFormContext } from 'react-hook-form'
import { Clock, Shirt, Scale, Layers, Truck, Zap, Info } from 'lucide-react'
import { NumberField } from '../fields/NumberField'
import { RadioCardGroup, type RadioCardOption } from '../fields/RadioCardGroup'
import { WeightPricingFields } from './WeightPricingFields'
import { ExpressServiceFields } from './ExpressServiceFields'
import { usesWeightPricing, usesItemPricing } from '../../config'
import { WEIGHT_EXPRESS_KEY, type ExpressByService, type WeightTier } from '../../types'

// Mirrors Laundry.PricingModel on the backend (BY_ITEM / BY_WEIGHT / HYBRID).
const pricingModels: RadioCardOption[] = [
  { value: 'BY_ITEM', label: 'Per item', hint: 'Charge per garment', icon: Shirt },
  { value: 'BY_WEIGHT', label: 'Per weight', hint: 'Charge per kg', icon: Scale },
  { value: 'HYBRID', label: 'Hybrid', hint: 'Item + weight', icon: Layers },
]

const priceRanges: RadioCardOption[] = [
  { value: '$', label: 'Low', hint: 'Budget-friendly', symbol: '₵' },
  { value: '$$', label: 'Medium', hint: 'Standard pricing', symbol: '₵₵' },
  { value: '$$$', label: 'High', hint: 'Premium service', symbol: '₵₵₵' },
]

const deliveryOptions: RadioCardOption[] = [
  { value: '12', label: 'Express', hint: 'within 12 hours', icon: Zap },
  { value: '24', label: 'Standard', hint: 'within 24 hours', icon: Clock },
  { value: '48', label: '2 Days', hint: 'within 48 hours', icon: Truck },
  { value: '72', label: '3 Days', hint: 'within 72 hours', icon: Truck },
]

interface PricingDeliveryStepProps {
  weightTiers: WeightTier[]
  setWeightTiers: (updater: (prev: WeightTier[]) => WeightTier[]) => void
  express: ExpressByService
  setExpress: (updater: (prev: ExpressByService) => ExpressByService) => void
}

export const PricingDeliveryStep = ({
  weightTiers,
  setWeightTiers,
  express,
  setExpress,
}: PricingDeliveryStepProps) => {
  const form = useFormContext()
  const pricingModel = form.watch('pricing_model')

  return (
    <div className="space-y-6">
      <RadioCardGroup name="pricing_model" label="How do you price?" options={pricingModels} />

      {usesWeightPricing(pricingModel) && (
        <WeightPricingFields
          tiers={weightTiers}
          setTiers={setWeightTiers}
          isHybrid={pricingModel === 'HYBRID'}
        />
      )}

      {/* Weight-only laundries have no Price List step, so express lives here
          next to their tariff; item/hybrid configure express per service on
          the Price List step. */}
      {!usesItemPricing(pricingModel) && (
        <ExpressServiceFields
          serviceKey={WEIGHT_EXPRESS_KEY}
          serviceLabel="weight-based orders"
          express={express}
          setExpress={setExpress}
        />
      )}

      {pricingModel === 'HYBRID' && (
        <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Hybrid pricing:</span> the per-kg
            rate above covers bulk / wash-and-fold orders. You&apos;ll add your per-item
            garment prices in the <span className="font-medium text-foreground">Price List</span>{' '}
            step next.
          </p>
        </div>
      )}

      <RadioCardGroup name="price_range" label="Price Range" options={priceRanges} />

      <RadioCardGroup
        name="estimated_delivery_hours"
        label="Estimated Delivery Time"
        options={deliveryOptions}
        gridClassName="grid grid-cols-2 sm:grid-cols-4 gap-3"
      />

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <NumberField
          name="min_order"
          label="Minimum Order Amount (GH₵)"
          className="col-span-2 sm:col-span-1"
        />
        <NumberField
          name="service_radius_km"
          label="Service Radius (km)"
          step="0.5"
          min="0"
          description="How far you deliver / pick up."
          className="col-span-2 sm:col-span-1"
        />
      </div>
    </div>
  )
}
