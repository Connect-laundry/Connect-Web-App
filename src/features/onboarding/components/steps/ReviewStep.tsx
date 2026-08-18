import { useFormContext } from 'react-hook-form'
import { Check } from 'lucide-react'
import type { DayHours, ExpressByService, PriceItem, WeightTier } from '../../types'
import { usesWeightPricing, usesItemPricing } from '../../config'

interface ReviewStepProps {
  hours: DayHours[]
  priceItems?: PriceItem[]
  weightTiers?: WeightTier[]
  express?: ExpressByService
}

const priceRanges = [
  { value: '$', label: 'Low', hint: 'Budget-friendly', symbol: '₵' },
  { value: '$$', label: 'Medium', hint: 'Standard pricing', symbol: '₵₵' },
  { value: '$$$', label: 'High', hint: 'Premium service', symbol: '₵₵₵' },
] as const

const deliveryOptions = [
  { value: '12', label: 'Express', hint: 'within 12 hours' },
  { value: '24', label: 'Standard', hint: 'within 24 hours' },
  { value: '48', label: '2 Days', hint: 'within 48 hours' },
  { value: '72', label: '3 Days', hint: 'within 72 hours' },
] as const

const pricingModelLabels: Record<string, string> = {
  BY_ITEM: 'Per item',
  BY_WEIGHT: 'Per weight (kg)',
  HYBRID: 'Hybrid (item + weight)',
}

export const ReviewStep = ({ hours, priceItems = [], weightTiers = [], express = {} }: ReviewStepProps) => {
  const form = useFormContext()

  const selectedPrice = priceRanges.find((p) => p.value === form.watch('price_range'))
  const selectedDelivery = deliveryOptions.find(
    (d) => d.value === form.watch('estimated_delivery_hours')
  )
  const openDays = hours.filter((d) => !d.is_closed).length
  const pricingModel = form.watch('pricing_model')
  const usesWeight = usesWeightPricing(pricingModel)
  const usesItems = usesItemPricing(pricingModel)
  const itemCount = priceItems.filter(
    (it) => it.item_name.trim() && it.unit_price !== ''
  ).length
  const tierSummary = weightTiers
    .filter((t) => t.weight_kg !== '' && t.price !== '')
    .sort((a, b) => Number(a.weight_kg) - Number(b.weight_kg))
    .map((t) => `${t.weight_kg} kg → GH₵ ${t.price}`)
    .join(' · ')
  const expressSummary = Object.entries(express)
    .filter(([, s]) => s.enabled)
    .map(([service, s]) => `${service}: ${s.hours} hrs +${s.surcharge_percent}%`)
    .join(' · ')
  const attributes = [
    form.watch('ironing_available') ? 'Ironing' : null,
    form.watch('is_eco_friendly') ? 'Eco-friendly' : null,
  ].filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      <div className="py-2 text-center space-y-3">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Almost Done!</h3>
        <p className="text-muted-foreground text-sm">
          Review your details below, then submit for approval.
        </p>
      </div>

      <div className="rounded-lg border divide-y text-sm bg-card">
        {[
          ['Business', form.watch('name')],
          ['City', form.watch('city')],
          ['Phone', form.watch('phone_number')],
          ['Coordinates', `${form.watch('latitude')}, ${form.watch('longitude')}`],
          ['Open days', `${openDays} of 7 days/week`],
          ['Pricing', pricingModelLabels[form.watch('pricing_model')] || '—'],
          ...(usesWeight
            ? [['Weight pricing', tierSummary || '—'] as [string, string]]
            : []),
          ...(usesItems
            ? [['Price list', `${itemCount} item${itemCount === 1 ? '' : 's'}`] as [string, string]]
            : []),
          [
            'Price range',
            selectedPrice ? `${selectedPrice.symbol} · ${selectedPrice.label}` : '',
          ],
          [
            'Delivery',
            selectedDelivery
              ? `${selectedDelivery.label} (${selectedDelivery.hint})`
              : '',
          ],
          [
            'Express',
            expressSummary || 'Not offered',
          ],
          ['Min order', `GH₵ ${form.watch('min_order')}`],
          ['Service radius', `${form.watch('service_radius_km') || '—'} km`],
          ...(attributes ? [['Attributes', attributes] as [string, string]] : []),
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 px-4 py-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right break-all">{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
