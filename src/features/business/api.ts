import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap as sharedUnwrap, unwrapList as sharedUnwrapList } from '@/shared/api/unwrap'
import { Laundry, PricingItem, WeightPricing, Service, BusinessHours } from '@/shared/interfaces'

function unwrap<T = any>(response: any): T {
  return sharedUnwrap<T>(response)
}

function unwrapList<T = any>(response: any): T[] {
  return sharedUnwrapList<T>(response)
}

export interface PriceImportDraftItem {
  id: string
  item_name: string
  suggested_price: string | number | null
  category: string
  confidence: number | null
  is_selected: boolean
}

export interface PriceImportJob {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'CONFIRMED' | 'FAILED'
  provider: string
  error: string
  draft_items: PriceImportDraftItem[]
  created_at: string
  updated_at: string
  confirmed_at: string | null
}

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

/**
 * Get laundry profile for the current owner
 */
export async function getLaundryProfile(): Promise<Laundry | null> {
  try {
    const response = await apiGet<any>('/laundries/dashboard/my-laundry/')
    return unwrap<Laundry>(response)
  } catch (_error) {
    return null
  }
}

/**
 * Get the owner's per-item pricing catalog (what was entered during onboarding
 * under BY_ITEM / HYBRID). Backend: GET /laundries/dashboard/pricing-items/.
 */
export async function getPricingItems(): Promise<PricingItem[]> {
  try {
    const response = await apiGet<any>('/laundries/dashboard/pricing-items/')
    return unwrapList<PricingItem>(response)
  } catch (_error) {
    return []
  }
}

/**
 * Get the owner's weight-based tariff (singleton; set during onboarding under
 * BY_WEIGHT / HYBRID). Backend: GET /laundries/dashboard/weight-pricing/.
 * Returns null when the owner hasn't configured weight pricing.
 */
export async function getWeightPricing(): Promise<WeightPricing | null> {
  try {
    const response = await apiGet<any>('/laundries/dashboard/weight-pricing/')
    const data = unwrap<WeightPricing | null>(response)
    return data && (data as any).base_price_per_kg != null ? data : null
  } catch (_error) {
    return null
  }
}

/**
 * Update laundry profile
 */
export async function updateLaundryProfile(data: Partial<Laundry>): Promise<Laundry> {
  return apiPatch<Laundry>('/laundries/dashboard/my-laundry/', data)
}

/**
 * Update the owner's laundry profile fields (name, phone, address, fees, …).
 * Backend: PATCH /laundries/dashboard/my-laundry/<id>/. Also accepts
 * `operating_hours` (full list) which the serializer syncs per-day.
 */
export async function patchMyLaundry(
  laundryId: string,
  data: Record<string, any>,
): Promise<Laundry> {
  const response = await apiPatch<any>(`/laundries/dashboard/my-laundry/${laundryId}/`, data)
  return unwrap<Laundry>(response)
}

/**
 * Toggle vacation mode on/off (backend flips the current value).
 * Backend: POST /laundries/dashboard/my-laundry/toggle-vacation/.
 */
export async function toggleVacationMode(): Promise<boolean> {
  const response = await apiPost<any>('/laundries/dashboard/my-laundry/toggle-vacation/')
  return !!unwrap<any>(response)?.vacation_mode
}

/** Create a pricing item. Backend: POST /laundries/dashboard/pricing-items/. */
export async function createPricingItem(data: Partial<PricingItem>): Promise<PricingItem> {
  const response = await apiPost<any>('/laundries/dashboard/pricing-items/', data)
  return unwrap<PricingItem>(response)
}

/** Update a pricing item. Backend: PATCH /laundries/dashboard/pricing-items/<id>/. */
export async function updatePricingItem(
  id: string,
  data: Partial<PricingItem>,
): Promise<PricingItem> {
  const response = await apiPatch<any>(`/laundries/dashboard/pricing-items/${id}/`, data)
  return unwrap<PricingItem>(response)
}

/** Delete a pricing item. Backend: DELETE /laundries/dashboard/pricing-items/<id>/. */
export async function deletePricingItem(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/pricing-items/${id}/`)
}

/**
 * Upsert the weight tariff (singleton). Backend: PATCH
 * /laundries/dashboard/weight-pricing/ (creates the row if missing).
 */
export async function upsertWeightPricing(
  data: Partial<WeightPricing>,
): Promise<WeightPricing> {
  const response = await apiPatch<any>('/laundries/dashboard/weight-pricing/', data)
  return unwrap<WeightPricing>(response)
}

/**
 * @deprecated The `/laundries/services/` endpoint does NOT exist on the backend
 * (the router exposes no `services` route — see laundries/urls.py). These calls
 * 404. Owner pricing lives at `dashboard/pricing-items/` and
 * `dashboard/weight-pricing/` — use getPricingItems() / getWeightPricing().
 * Kept only to avoid breaking imports; do not wire into UI.
 */
export async function getServices(): Promise<Service[]> {
  const response = await apiGet<{ results: Service[] }>('/laundries/services/')
  return response.results || []
}

/**
 * Create a new service
 */
export async function createService(data: Partial<Service>): Promise<Service> {
  return apiPost<Service>('/laundries/services/', data)
}

/**
 * Delete a service
 */
export async function deleteService(serviceId: string): Promise<void> {
  await apiDelete(`/laundries/services/${serviceId}/`)
}

/**
 * Get a single service
 */
export async function getServiceById(serviceId: string): Promise<Service> {
  return apiGet<Service>(`/laundries/services/${serviceId}/`)
}

/**
 * Update service
 */
export async function updateService(serviceId: string, data: Partial<Service>): Promise<Service> {
  return apiPatch<Service>(`/laundries/services/${serviceId}/`, data)
}

/**
 * Toggle service active status
 */
export async function toggleServiceStatus(serviceId: string, isActive: boolean): Promise<Service> {
  return updateService(serviceId, { is_active: isActive })
}

/**
 * Deactivate laundry (vacation mode)
 */
export async function deactivateLaundry(reason?: string): Promise<Laundry> {
  return apiPatch<Laundry>('/laundries/laundries/deactivate/', {
    reason: reason || 'Vacation mode',
  })
}

/**
 * Reactivate laundry
 */
export async function reactivateLaundry(): Promise<Laundry> {
  return apiPatch<Laundry>('/laundries/laundries/', { is_active: true })
}

/**
 * Get business operating hours
 */
export async function getBusinessHours(): Promise<BusinessHours> {
  const _laundry = await getLaundryProfile()
  // This would need to be added to the Laundry model from the API
  return {}
}

/**
 * Update business operating hours
 */
export async function updateBusinessHours(hours: BusinessHours): Promise<void> {
  // This would need to be implemented on the backend
  await apiPatch('/laundries/laundries/hours/', { hours })
}

/** Upload a price-list photo for AI/OCR extraction. */
export async function uploadPriceImport(sourceImage: File): Promise<PriceImportJob> {
  const formData = new FormData()
  formData.append('source_image', sourceImage)
  const response = await apiPost<any>('/laundries/dashboard/price-imports/', formData)
  return unwrap<PriceImportJob>(response)
}

/** Poll an import job until OCR finishes. */
export async function getPriceImportJob(jobId: string): Promise<PriceImportJob> {
  const response = await apiGet<any>(`/laundries/dashboard/price-imports/${jobId}/`)
  return unwrap<PriceImportJob>(response)
}

/** Confirm reviewed draft rows as live pricing items. */
export async function confirmPriceImport(
  jobId: string,
  items: Array<{ item_name: string; unit_price: string; category?: string }>,
): Promise<{ created: string[]; skipped: string[]; job: PriceImportJob }> {
  const response = await apiPost<any>(`/laundries/dashboard/price-imports/${jobId}/confirm/`, {
    items,
  })
  return unwrap<{ created: string[]; skipped: string[]; job: PriceImportJob }>(response)
}

/** Apply the backend's default operating-hours template. */
export async function applyHoursTemplate(): Promise<Laundry> {
  const response = await apiPost<any>('/laundries/dashboard/my-laundry/hours/template/')
  return unwrap<Laundry>(response)
}

/** Copy Monday hours to Tue–Fri. */
export async function copyMondayHours(): Promise<Laundry> {
  const response = await apiPost<any>('/laundries/dashboard/my-laundry/hours/copy-monday/')
  return unwrap<Laundry>(response)
}

/** Copy one day's hours to all other days. day: 1=Mon … 7=Sun */
export async function copyTodayHours(day: number): Promise<Laundry> {
  const response = await apiPost<any>('/laundries/dashboard/my-laundry/hours/copy-today/', { day })
  return unwrap<Laundry>(response)
}

/** Bulk-update pricing items. */
export async function bulkUpdatePricingItems(
  items: Array<{ id: string } & Partial<PricingItem>>,
): Promise<PricingItem[]> {
  const response = await apiPost<any>('/laundries/dashboard/pricing-items/bulk-update/', { items })
  return unwrapList<PricingItem>(response)
}

/** Reorder pricing items. */
export async function bulkReorderPricingItems(
  items: Array<{ id: string; display_order: number }>,
): Promise<PricingItem[]> {
  const response = await apiPost<any>('/laundries/dashboard/pricing-items/bulk-reorder/', { items })
  return unwrapList<PricingItem>(response)
}

export async function getDefaultPricingCategories(): Promise<string[]> {
  const response = await apiGet<any>('/laundries/dashboard/pricing-items/default-categories/')
  const data = unwrap<any>(response)
  return Array.isArray(data) ? data : []
}

export async function importPricingBulk(file: File, overwrite = false) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('overwrite', String(overwrite))
  const response = await apiPost<any>('/laundries/dashboard/pricing-items/import-bulk/', formData)
  return unwrap<{ created: number; updated: number }>(response)
}

/** Toggle a laundry service's availability. */
export async function updateServiceAvailability(serviceId: string, isAvailable: boolean) {
  const response = await apiPatch<any>(`/laundries/dashboard/services/${serviceId}/`, {
    is_available: isAvailable,
  })
  return unwrap<any>(response)
}

export async function getPricingVersions(): Promise<PricingCatalogVersion[]> {
  const response = await apiGet<any>('/laundries/dashboard/pricing-versions/')
  return unwrapList<PricingCatalogVersion>(response)
}

export async function createPricingVersion(): Promise<PricingCatalogVersion> {
  const response = await apiPost<any>('/laundries/dashboard/pricing-versions/')
  return unwrap<PricingCatalogVersion>(response)
}

export async function rollbackPricingVersion(versionId: string): Promise<void> {
  await apiPost(`/laundries/dashboard/pricing-versions/${versionId}/rollback/`)
}

export async function getScheduledPriceChanges(): Promise<ScheduledPriceChange[]> {
  const response = await apiGet<any>('/laundries/dashboard/scheduled-prices/')
  return unwrapList<ScheduledPriceChange>(response)
}

export async function createScheduledPriceChange(data: {
  effective_at: string
  pricing_data: Array<Record<string, unknown>>
}): Promise<ScheduledPriceChange> {
  const response = await apiPost<any>('/laundries/dashboard/scheduled-prices/', data)
  return unwrap<ScheduledPriceChange>(response)
}

export async function deleteScheduledPriceChange(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/scheduled-prices/${id}/`)
}

export async function getDeliveryZones(): Promise<DeliveryZonePricing[]> {
  const response = await apiGet<any>('/laundries/dashboard/delivery-zones/')
  return unwrapList<DeliveryZonePricing>(response)
}

export async function createDeliveryZone(
  data: Omit<DeliveryZonePricing, 'id'>,
): Promise<DeliveryZonePricing> {
  const response = await apiPost<any>('/laundries/dashboard/delivery-zones/', data)
  return unwrap<DeliveryZonePricing>(response)
}

export async function updateDeliveryZone(
  id: string,
  data: Partial<Omit<DeliveryZonePricing, 'id'>>,
): Promise<DeliveryZonePricing> {
  const response = await apiPatch<any>(`/laundries/dashboard/delivery-zones/${id}/`, data)
  return unwrap<DeliveryZonePricing>(response)
}

export async function deleteDeliveryZone(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/delivery-zones/${id}/`)
}

export async function getHolidayOverrides(): Promise<HolidayOverride[]> {
  const response = await apiGet<any>('/laundries/dashboard/holiday-overrides/')
  return unwrapList<HolidayOverride>(response)
}

export async function createHolidayOverride(
  data: Omit<HolidayOverride, 'id'>,
): Promise<HolidayOverride> {
  const response = await apiPost<any>('/laundries/dashboard/holiday-overrides/', data)
  return unwrap<HolidayOverride>(response)
}

export async function updateHolidayOverride(
  id: string,
  data: Partial<Omit<HolidayOverride, 'id'>>,
): Promise<HolidayOverride> {
  const response = await apiPatch<any>(`/laundries/dashboard/holiday-overrides/${id}/`, data)
  return unwrap<HolidayOverride>(response)
}

export async function deleteHolidayOverride(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/holiday-overrides/${id}/`)
}
