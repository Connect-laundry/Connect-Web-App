import type { CatalogFields } from '@/features/business/lib/unified-pricing'
import { catalogProblem, serviceCode, unifiedPricingEnabled } from './unified-pricing'
import type { PricingItem } from '@/shared/types'

/** Service categories — must match the onboarding Price List step. */
export const SERVICE_CATEGORIES = [
  { value: 'Wash Only', label: 'Wash only' },
  { value: 'Wash & Iron', label: 'Wash + ironing' },
  { value: 'Iron Only', label: 'Ironing only' },
] as const

export interface ItemDraft extends CatalogFields {
  id: string | null // null = new, unsaved row
  item_name: string
  category: string
  unit_price: string
  is_active: boolean
  display_order: number
}

export function toDraft(item: PricingItem): ItemDraft {
  return {
    ...item,
    id: item.id,
    item_name: item.item_name,
    category: item.category,
    unit_price: item.unit_price,
    is_active: item.is_active,
    display_order: item.display_order,
  }
}

/** A fresh, unsaved row appended to the end of the current list. */
export function emptyDraft(displayOrder: number): ItemDraft {
  return {
    id: null,
    item_name: '',
    category: '',
    unit_price: '',
    is_active: true,
    display_order: displayOrder,
  }
}

/** Rows the user actually touched — completely blank rows are dropped on save. */
export function nonEmptyDrafts(drafts: ItemDraft[]): ItemDraft[] {
  return drafts.filter((d) => d.item_name.trim() || d.unit_price !== '')
}

/** Returns the first validation error message, or null when the drafts are valid. */
export function validatePriceDrafts(drafts: ItemDraft[]): string | null {
  for (const d of drafts) {
    const problem = catalogProblem(d)
    if (problem) return `${d.item_name}: ${problem}`
    if (!d.item_name.trim()) return 'Every item needs a name.'
    if (!d.unit_price || Number(d.unit_price) <= 0) {
      return `“${d.item_name.trim()}”: enter a price greater than 0.`
    }
    if (!d.category) {
      return `“${d.item_name.trim()}”: select a service type.`
    }
  }
  return null
}

export function buildPriceItemPayload(draft: ItemDraft, displayOrder: number): Partial<PricingItem> {
  return {
    ...(unifiedPricingEnabled ? { service_type: draft.service_type ?? serviceCode(draft.category), pricing_basis: draft.pricing_basis ?? 'PER_ITEM', pricing_rules: draft.pricing_rules ?? {}, description: draft.description ?? '', currency: 'GHS', basket: draft.basket ?? null } : {}),
    item_name: draft.item_name.trim(),
    category: draft.category,
    unit_price: draft.unit_price,
    is_active: draft.is_active,
    display_order: displayOrder,
  }
}
