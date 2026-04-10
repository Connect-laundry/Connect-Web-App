import type { DayHours, PriceItem, WeightTier, ExpressByService } from './types'

/** Monetary / decimal string with up to 2 decimal places. */
export const MONEY_RE = /^\d+(\.\d{1,2})?$/

/**
 * Validate working hours. Returns an error message, or null when valid.
 * A close time earlier than the open time is allowed (overnight); only equal
 * open/close times are rejected.
 */
export function validateHours(hours: DayHours[]): string | null {
  for (const d of hours) {
    if (!d.is_closed && d.opening_time === d.closing_time) {
      return `${d.label}: opening and closing time can't be the same.`
    }
  }
  return null
}

/**
 * Validate the per-item price list. Returns an error message, or null when
 * valid. Empty rows are ignored, but at least one valid item is required.
 */
export function validatePriceList(items: PriceItem[]): string | null {
  const nonEmpty = items.filter((it) => it.item_name.trim() || it.unit_price !== '')
  if (nonEmpty.length === 0) return 'Add at least one item with a price.'
  const seen = new Set<string>()
  for (const it of nonEmpty) {
    if (!it.item_name.trim()) return 'Every item needs a name.'
    if (!MONEY_RE.test(it.unit_price) || Number(it.unit_price) <= 0) {
      return `“${it.item_name.trim() || 'Item'}”: enter a price greater than 0.`
    }
    const key = `${it.category}::${it.item_name.trim().toLowerCase()}`
    if (seen.has(key)) {
      return `“${it.item_name.trim()}” is listed twice under ${it.category || 'the same service'}.`
    }
    seen.add(key)
  }
  return null
}

/**
 * Validate weight pricing tiers. Returns an error message, or null when valid.
 * Empty rows are ignored, but at least one valid tier is required and weights
 * must be unique.
 */
export function validateWeightTiers(tiers: WeightTier[]): string | null {
  const nonEmpty = tiers.filter((t) => t.weight_kg !== '' || t.price !== '')
  if (nonEmpty.length === 0) return 'Add at least one weight tier with a price.'
  const seen = new Set<number>()
  for (const t of nonEmpty) {
    const kg = Number(t.weight_kg)
    if (!t.weight_kg || Number.isNaN(kg) || kg <= 0) {
      return 'Every tier needs a weight greater than 0 kg.'
    }
    if (!MONEY_RE.test(t.price) || Number(t.price) <= 0) {
      return `${t.weight_kg} kg: enter a price greater than 0.`
    }
    if (seen.has(kg)) return `Duplicate tier for ${t.weight_kg} kg — each weight can only appear once.`
    seen.add(kg)
  }
  return null
}

/**
 * Validate per-service express settings. Only enabled services are checked:
 * each needs a turnaround (hours) and surcharge (%) greater than 0.
 */
export function validateExpress(express: ExpressByService): string | null {
  for (const [service, setting] of Object.entries(express)) {
    if (!setting.enabled) continue
    const hours = Number(setting.hours)
    if (!setting.hours || Number.isNaN(hours) || hours <= 0) {
      return `Express for ${service}: enter the turnaround in hours.`
    }
    const pct = Number(setting.surcharge_percent)
    if (!setting.surcharge_percent || Number.isNaN(pct) || pct <= 0) {
      return `Express for ${service}: enter the extra charge as a percentage.`
    }
  }
  return null
}
