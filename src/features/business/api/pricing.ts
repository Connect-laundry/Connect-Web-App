import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap, unwrapList } from '@/shared/api/unwrap'
import type { PricingItem, WeightPricing } from '@/shared/interfaces'

export async function getPricingItems(): Promise<PricingItem[]> {
  try {
    const response = await apiGet<unknown>('/laundries/dashboard/pricing-items/')
    return unwrapList<PricingItem>(response)
  } catch (_error) {
    return []
  }
}

export async function getWeightPricing(): Promise<WeightPricing | null> {
  try {
    const response = await apiGet<unknown>('/laundries/dashboard/weight-pricing/')
    const data = unwrap<WeightPricing | null>(response)
    return data && data.base_price_per_kg != null ? data : null
  } catch (_error) {
    return null
  }
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
