import type { WeightPricing } from '@/shared/types'

export interface Draft {
  base_price_per_kg: string
  minimum_charge: string
  minimum_order_weight_kg: string
}

export function toDraft(p: WeightPricing | null): Draft {
  return {
    base_price_per_kg: p?.base_price_per_kg ?? '',
    minimum_charge: p?.minimum_charge ?? '0',
    minimum_order_weight_kg: p?.minimum_order_weight_kg ?? '',
  }
}

/** Returns a validation error message, or null when the draft is valid. */
export function validateWeightDraft(draft: Draft): string | null {
  if (!draft.base_price_per_kg || Number(draft.base_price_per_kg) <= 0) {
    return 'Enter a price per kg greater than 0.'
  }
  return null
}

export function buildWeightPricingPayload(draft: Draft): Partial<WeightPricing> {
  return {
    base_price_per_kg: draft.base_price_per_kg,
    minimum_charge: draft.minimum_charge || '0',
    minimum_order_weight_kg: draft.minimum_order_weight_kg || null,
    is_active: true,
  }
}
