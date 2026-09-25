export interface PricingCatalogVersion {
  id: string
  version_number: number
  items_data: Array<Record<string, unknown>>
  created_at: string
}

export interface ScheduledPriceChange {
  id: string
  effective_at: string
  pricing_data: Array<Record<string, unknown>>
  is_applied: boolean
  created_at: string
}

export interface DeliveryZonePricing {
  id: string
  min_distance_km: number | string
  max_distance_km: number | string
  delivery_fee: number | string
  pickup_fee: number | string
}

export interface HolidayOverride {
  id: string
  date: string
  opening_time: string | null
  closing_time: string | null
  is_closed: boolean
  note: string
}
