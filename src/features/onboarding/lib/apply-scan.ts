/**
 * Merge reviewed scan results into the onboarding wizard's form state. The
 * wizard's normal final submit then saves everything through the usual
 * pricing endpoints: scanning never saves prices on its own.
 */
import type { AppliedPrices } from '@/features/price-import/lib/review'
import type { ReviewContext } from '@/features/price-import/lib/review'
import type { LaundryPricingModel } from '@/features/price-import/types'
import { COMMON_ITEMS } from '../constants'
import type { PriceItem, WeightTier } from '../types'

const norm = (s: string) => s.trim().toLowerCase()

/** Per-kg price the wizard already has: a 1 kg tier is "price per kg". */
export function existingPerKgFromTiers(tiers: WeightTier[]): string | null {
  const oneKg = tiers.find((t) => Number(t.weight_kg) === 1 && t.price.trim())
  return oneKg ? oneKg.price.trim() : null
}

export function onboardingReviewContext(
  pricingModel: LaundryPricingModel,
  ironingAvailable: boolean | undefined,
  items: PriceItem[],
  tiers: WeightTier[],
): ReviewContext {
  return {
    pricingModel,
    ironingAvailable,
    existingItems: items
      .filter((it) => it.item_name.trim())
      .map((it) => ({ name: it.item_name, category: it.category, price: it.unit_price })),
    existingPerKg: existingPerKgFromTiers(tiers),
  }
}

export function mergeItems(prev: PriceItem[], applied: AppliedPrices['items']): PriceItem[] {
  const next = [...prev]
  for (const a of applied) {
    const at = next.findIndex((it) => norm(it.item_name) === norm(a.name) && norm(it.category) === norm(a.service))
    if (at >= 0) {
      // Only reached when the owner chose "Use detected" for an existing value.
      if (a.replaces) next[at] = { ...next[at], unit_price: a.price }
      continue
    }
    const isCommon = COMMON_ITEMS.some((c) => norm(c) === norm(a.name))
    // Replace an empty placeholder row in the same service rather than leaving it.
    const blank = next.findIndex((it) => it.category === a.service && !it.item_name.trim() && !it.unit_price.trim())
    const row: PriceItem = { item_name: a.name, category: a.service, unit_price: a.price, is_custom: !isCommon }
    if (blank >= 0) next[blank] = row
    else next.push(row)
  }
  return next
}

/**
 * A detected "GH₵18 per kg" becomes the 1 kg tier (1 kg → GH₵18). Other
 * tiers the owner set are left alone; no minimum weight is invented beyond
 * what "per kg" says, and the owner is told they can change it.
 */
export function mergePerKg(prev: WeightTier[], perKg: AppliedPrices['perKg']): WeightTier[] {
  if (!perKg) return prev
  const at = prev.findIndex((t) => Number(t.weight_kg) === 1)
  if (at >= 0) {
    if (!perKg.replaces && prev[at].price.trim()) return prev
    return prev.map((t, i) => (i === at ? { ...t, price: perKg.price } : t))
  }
  const withoutBlank = prev.filter((t) => t.weight_kg.trim() || t.price.trim())
  return [{ weight_kg: '1', price: perKg.price }, ...withoutBlank]
}

export function appliedSummary(applied: AppliedPrices): string {
  const parts: string[] = []
  if (applied.items.length) parts.push(`${applied.items.length} item price${applied.items.length === 1 ? '' : 's'}`)
  if (applied.perKg) parts.push(`a per-kg price of GH₵${applied.perKg.price} (as a 1 kg tier; change the weight if you have a minimum)`)
  return parts.length
    ? `Added ${parts.join(' and ')} to your form. Check them below. Nothing is saved until you finish setup.`
    : 'Nothing was added.'
}
