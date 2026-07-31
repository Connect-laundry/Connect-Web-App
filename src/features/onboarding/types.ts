/** Shared domain types for the owner onboarding flow. */

export type DayHours = {
  day: number
  label: string
  is_closed: boolean
  opening_time: string
  closing_time: string
}

/** A single garment + price row within a category. */
export type PriceRow = {
  item_name: string
  unit_price: string
}

/** A service category (e.g. "Ironing") with the garment rows priced under it. */
export type CategoryGroup = {
  category: string
  items: PriceRow[]
}

/** Flat shape persisted to the backend (one LaundryPricingItem per row). */
export type PriceItem = {
  item_name: string
  category: string
  unit_price: string
  /** UI-only: row was added via “Other…” and uses free-text name entry. */
  is_custom?: boolean
}

/** A weight bracket priced as a bundle (e.g. 20 kg → GH₵ 160). */
export type WeightTier = {
  weight_kg: string
  price: string
}

export const emptyRow = (): PriceRow => ({ item_name: '', unit_price: '' })

export const emptyPriceItem = (): PriceItem => ({
  item_name: '',
  category: '',
  unit_price: '',
})

export const emptyWeightTier = (): WeightTier => ({ weight_kg: '', price: '' })

/** Express settings for one service type (or the weight tariff). */
export type ExpressSetting = {
  enabled: boolean
  hours: string
  surcharge_percent: string
}

/** Keyed by service category ("Wash Only", …) or WEIGHT_EXPRESS_KEY. */
export type ExpressByService = Record<string, ExpressSetting>

/** Express key used by weight-only laundries (no service tabs). */
export const WEIGHT_EXPRESS_KEY = 'Weight-based'

export const emptyExpressSetting = (): ExpressSetting => ({
  enabled: false,
  hours: '',
  surcharge_percent: '',
})

