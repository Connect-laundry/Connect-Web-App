import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import type { Service } from '@/shared/interfaces'

/**
 * @deprecated The `/laundries/services/` endpoint is not exposed by the backend.
 * These exports remain part of the public API only to avoid breaking existing consumers.
 */
export async function getServices(): Promise<Service[]> {
  const response = await apiGet<{ results: Service[] }>('/laundries/services/')
  return response.results || []
}

export async function createService(data: Partial<Service>): Promise<Service> {
  return apiPost<Service>('/laundries/services/', data)
}

export async function deleteService(serviceId: string): Promise<void> {
  await apiDelete(`/laundries/services/${serviceId}/`)
}

export async function getServiceById(serviceId: string): Promise<Service> {
  return apiGet<Service>(`/laundries/services/${serviceId}/`)
}

export async function updateService(serviceId: string, data: Partial<Service>): Promise<Service> {
  return apiPatch<Service>(`/laundries/services/${serviceId}/`, data)
}

export async function toggleServiceStatus(serviceId: string, isActive: boolean): Promise<Service> {
  return updateService(serviceId, { is_active: isActive })
}
