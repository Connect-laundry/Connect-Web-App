import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap, unwrapList } from '@/shared/api/unwrap'
import type {
  DeliveryZonePricing,
  HolidayOverride,
  PricingCatalogVersion,
  ScheduledPriceChange,
} from '../api-types'

export async function updateServiceAvailability(serviceId: string, isAvailable: boolean) {
  return unwrap<unknown>(await apiPatch<unknown>(`/laundries/dashboard/services/${serviceId}/`, { is_available: isAvailable }))
}

export async function getPricingVersions(): Promise<PricingCatalogVersion[]> {
  return unwrapList<PricingCatalogVersion>(await apiGet<unknown>('/laundries/dashboard/pricing-versions/'))
}

export async function createPricingVersion(): Promise<PricingCatalogVersion> {
  return unwrap<PricingCatalogVersion>(await apiPost<unknown>('/laundries/dashboard/pricing-versions/'))
}

export async function rollbackPricingVersion(versionId: string): Promise<void> {
  await apiPost(`/laundries/dashboard/pricing-versions/${versionId}/rollback/`)
}

export async function getScheduledPriceChanges(): Promise<ScheduledPriceChange[]> {
  return unwrapList<ScheduledPriceChange>(await apiGet<unknown>('/laundries/dashboard/scheduled-prices/'))
}

export async function createScheduledPriceChange(data: { effective_at: string; pricing_data: Array<Record<string, unknown>> }): Promise<ScheduledPriceChange> {
  return unwrap<ScheduledPriceChange>(await apiPost<unknown>('/laundries/dashboard/scheduled-prices/', data))
}

export async function deleteScheduledPriceChange(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/scheduled-prices/${id}/`)
}

export async function getDeliveryZones(): Promise<DeliveryZonePricing[]> {
  return unwrapList<DeliveryZonePricing>(await apiGet<unknown>('/laundries/dashboard/delivery-zones/'))
}

export async function createDeliveryZone(data: Omit<DeliveryZonePricing, 'id'>): Promise<DeliveryZonePricing> {
  return unwrap<DeliveryZonePricing>(await apiPost<unknown>('/laundries/dashboard/delivery-zones/', data))
}

export async function updateDeliveryZone(id: string, data: Partial<Omit<DeliveryZonePricing, 'id'>>): Promise<DeliveryZonePricing> {
  return unwrap<DeliveryZonePricing>(await apiPatch<unknown>(`/laundries/dashboard/delivery-zones/${id}/`, data))
}

export async function deleteDeliveryZone(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/delivery-zones/${id}/`)
}

export async function getHolidayOverrides(): Promise<HolidayOverride[]> {
  return unwrapList<HolidayOverride>(await apiGet<unknown>('/laundries/dashboard/holiday-overrides/'))
}

export async function createHolidayOverride(data: Omit<HolidayOverride, 'id'>): Promise<HolidayOverride> {
  return unwrap<HolidayOverride>(await apiPost<unknown>('/laundries/dashboard/holiday-overrides/', data))
}

export async function updateHolidayOverride(id: string, data: Partial<Omit<HolidayOverride, 'id'>>): Promise<HolidayOverride> {
  return unwrap<HolidayOverride>(await apiPatch<unknown>(`/laundries/dashboard/holiday-overrides/${id}/`, data))
}

export async function deleteHolidayOverride(id: string): Promise<void> {
  await apiDelete(`/laundries/dashboard/holiday-overrides/${id}/`)
}
