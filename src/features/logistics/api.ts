import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap, unwrapList } from '@/shared/api/unwrap'

export interface DeliveryAssignment {
  id: string
  order: string
  driver: string
  driverEmail?: string
  assignment_type: string
  assigned_at: string
  completed_at: string | null
  status: string
}

export interface DriverAccount {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
}

export interface CreateDriverAccountRequest {
  email: string
  phone: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
}

export interface TrackingLog {
  id: string
  order: string
  status: string
  description: string
  location_name: string
  latitude: number | null
  longitude: number | null
  timestamp: string
}

export async function getDriverAccounts(search?: string): Promise<DriverAccount[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  const response = await apiGet<unknown>(`/logistics/drivers/${query}`)
  return unwrapList<DriverAccount>(response)
}

export async function createDriverAccount(
  data: CreateDriverAccountRequest,
): Promise<DriverAccount> {
  const response = await apiPost<unknown>('/logistics/drivers/', data)
  return unwrap<DriverAccount>(response)
}

export async function getDeliveryAssignments(): Promise<DeliveryAssignment[]> {
  const response = await apiGet<any>('/logistics/assignments/')
  return unwrapList<DeliveryAssignment>(response)
}

export async function createDeliveryAssignment(data: {
  order: string
  driver: string
  assignment_type?: string
}): Promise<DeliveryAssignment> {
  const response = await apiPost<any>('/logistics/assignments/', data)
  return unwrap<DeliveryAssignment>(response)
}

export async function updateDeliveryAssignment(
  id: string,
  data: Partial<Pick<DeliveryAssignment, 'driver' | 'status' | 'assignment_type'>>,
): Promise<DeliveryAssignment> {
  const response = await apiPatch<any>(`/logistics/assignments/${id}/`, data)
  return unwrap<DeliveryAssignment>(response)
}

export async function deleteDeliveryAssignment(id: string): Promise<void> {
  await apiDelete(`/logistics/assignments/${id}/`)
}

export async function getTrackingLogs(orderId?: string): Promise<TrackingLog[]> {
  const query = orderId ? `?order_id=${orderId}` : ''
  const response = await apiGet<any>(`/logistics/tracking/${query}`)
  return unwrapList<TrackingLog>(response)
}
