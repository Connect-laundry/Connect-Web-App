import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap, unwrapList } from '@/shared/api/unwrap'
import type { PricingItem, WeightPricing } from '@/shared/types'
import type { BasketDefinition, CatalogFields } from '../lib/unified-pricing'

export async function saveBasketForRow(row: CatalogFields): Promise<string | null> {
  if (row.pricing_basis !== 'PER_BASKET') return null
  if (!row.basket_draft) return row.basket ?? null
  const { id, ...data } = row.basket_draft
  const saved = id ? await updateBasketDefinition(id, data) : await createBasketDefinition(data)
  row.basket = saved.id!
  row.basket_details = saved
  row.basket_draft = undefined
  return saved.id!
}

export async function bulkCreatePricingItems(items: Partial<PricingItem>[]): Promise<PricingItem[]> {
  return unwrapList<PricingItem>(await apiPost('/laundries/dashboard/pricing-items/bulk-create/', { items }))
}

export async function getPricingItems(): Promise<PricingItem[]> {
  const response = await apiGet<unknown>('/laundries/dashboard/pricing-items/')
  return unwrapList<PricingItem>(response)
}

export async function getWeightPricing(): Promise<WeightPricing | null> {
  const response = await apiGet<unknown>('/laundries/dashboard/weight-pricing/')
  const data = unwrap<WeightPricing | null>(response)
  return data && data.base_price_per_kg != null ? data : null
}

export async function getBasketDefinitions(): Promise<BasketDefinition[]> {
  return unwrapList<BasketDefinition>(
    await apiGet<unknown>('/laundries/dashboard/basket-definitions/'),
  )
}

export async function createBasketDefinition(data: BasketDefinition): Promise<BasketDefinition> {
  return unwrap<BasketDefinition>(
    await apiPost<unknown>('/laundries/dashboard/basket-definitions/', data),
  )
}

export async function updateBasketDefinition(
  id: string,
  data: Partial<BasketDefinition>,
): Promise<BasketDefinition> {
  return unwrap<BasketDefinition>(
    await apiPatch<unknown>(`/laundries/dashboard/basket-definitions/${id}/`, data),
  )
}

export async function deleteBasketDefinition(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/basket-definitions/${id}/`)
}

export async function createPricingItem(data: Partial<PricingItem>): Promise<PricingItem> {
  return unwrap<PricingItem>(await apiPost<unknown>('/laundries/dashboard/pricing-items/', data))
}

export async function updatePricingItem(id: string, data: Partial<PricingItem>): Promise<PricingItem> {
  return unwrap<PricingItem>(await apiPatch<unknown>(`/laundries/dashboard/pricing-items/${id}/`, data))
}

export async function deletePricingItem(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/pricing-items/${id}/`)
}

export async function upsertWeightPricing(data: Partial<WeightPricing>): Promise<WeightPricing> {
  return unwrap<WeightPricing>(await apiPatch<unknown>('/laundries/dashboard/weight-pricing/', data))
}

export async function bulkUpdatePricingItems(items: Array<{ id: string } & Partial<PricingItem>>): Promise<PricingItem[]> {
  return unwrapList<PricingItem>(await apiPost<unknown>('/laundries/dashboard/pricing-items/bulk-update/', { items }))
}

export async function bulkReorderPricingItems(items: Array<{ id: string; display_order: number }>): Promise<PricingItem[]> {
  return unwrapList<PricingItem>(await apiPost<unknown>('/laundries/dashboard/pricing-items/bulk-reorder/', { items }))
}

export async function getDefaultPricingCategories(): Promise<string[]> {
  const data = unwrap<unknown>(await apiGet<unknown>('/laundries/dashboard/pricing-items/default-categories/'))
  return Array.isArray(data) ? data.filter((item): item is string => typeof item === 'string') : []
}

export async function importPricingBulk(file: File, overwrite = false) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('overwrite', String(overwrite))
  return unwrap<{ created: number; updated: number }>(await apiPost<unknown>('/laundries/dashboard/pricing-items/import-bulk/', formData))
}
