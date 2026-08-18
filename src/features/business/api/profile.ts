import { apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'
import type { BusinessHours, Laundry } from '@/shared/types'

export async function getLaundryProfile(): Promise<Laundry | null> {
  try {
    const response = await apiGet<unknown>('/laundries/dashboard/my-laundry/')
    return unwrap<Laundry>(response)
  } catch (_error) {
    return null
  }
}

export async function updateLaundryProfile(data: Partial<Laundry>): Promise<Laundry> {
  return apiPatch<Laundry>('/laundries/dashboard/my-laundry/', data)
}

export async function patchMyLaundry(laundryId: string, data: Record<string, unknown>): Promise<Laundry> {
  const response = await apiPatch<unknown>(`/laundries/dashboard/my-laundry/${laundryId}/`, data)
  return unwrap<Laundry>(response)
}

export async function toggleVacationMode(): Promise<boolean> {
  const response = await apiPost<unknown>('/laundries/dashboard/my-laundry/toggle-vacation/')
  return Boolean(unwrap<{ vacation_mode?: boolean }>(response)?.vacation_mode)
}

export async function deactivateLaundry(reason?: string): Promise<Laundry> {
  return apiPatch<Laundry>('/laundries/laundries/deactivate/', { reason: reason || 'Vacation mode' })
}

export async function reactivateLaundry(): Promise<Laundry> {
  return apiPatch<Laundry>('/laundries/laundries/', { is_active: true })
}

export async function getBusinessHours(): Promise<BusinessHours> {
  await getLaundryProfile()
  return {}
}

export async function updateBusinessHours(hours: BusinessHours): Promise<void> {
  await apiPatch('/laundries/laundries/hours/', { hours })
}

export async function getHoursTemplate() {
  const response = await apiGet<unknown>('/laundries/dashboard/my-laundry/hours/template/')
  return unwrap<unknown>(response)
}

export async function copyMondayHours(): Promise<Laundry> {
  const response = await apiPost<unknown>('/laundries/dashboard/my-laundry/hours/copy-monday/')
  return unwrap<Laundry>(response)
}

export async function copyTodayHours(day: number): Promise<Laundry> {
  const response = await apiPost<unknown>('/laundries/dashboard/my-laundry/hours/copy-today/', { day })
  return unwrap<Laundry>(response)
}
