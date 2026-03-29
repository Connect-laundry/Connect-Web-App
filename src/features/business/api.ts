import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { Laundry, Service, BusinessHours } from '@/shared/types'

/**
 * Get laundry profile for the current owner
 */
export async function getLaundryProfile(): Promise<Laundry | null> {
  try {
    const response = await apiGet<any>('/laundries/dashboard/my-laundry/')
    // Handle both { data: ... } wrapped and flat responses
    return response.data || response
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
 * Get laundry services
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
