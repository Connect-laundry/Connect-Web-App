import { apiGet, apiPost, apiPatch } from './client'
import { StaffMember } from '@/lib/types'

/**
 * Get all staff members
 */
export async function getStaffMembers(): Promise<StaffMember[]> {
  const response = await apiGet<{ results: StaffMember[] }>('/staff/staff-members/')
  return response.results || []
}

/**
 * Get a single staff member
 */
export async function getStaffMemberById(staffId: string): Promise<StaffMember> {
  return apiGet<StaffMember>(`/staff/staff-members/${staffId}/`)
}

/**
 * Create a new staff member (invite)
 */
export async function createStaffMember(data: {
  email: string
  first_name: string
  last_name: string
  role: 'LaundryStaff' | 'Driver'
  phone_number?: string
}): Promise<StaffMember> {
  return apiPost<StaffMember>('/staff/staff-members/', data)
}

/**
 * Update staff member details
 */
export async function updateStaffMember(
  staffId: string,
  data: Partial<StaffMember>
): Promise<StaffMember> {
  return apiPatch<StaffMember>(`/staff/staff-members/${staffId}/`, data)
}

/**
 * Update staff role
 */
export async function updateStaffRole(
  staffId: string,
  role: 'LaundryStaff' | 'Driver'
): Promise<StaffMember> {
  return updateStaffMember(staffId, { role })
}

/**
 * Deactivate staff member
 */
export async function deactivateStaffMember(staffId: string): Promise<StaffMember> {
  return updateStaffMember(staffId, { is_active: false })
}

/**
 * Get staff member current status
 */
export async function getStaffStatus(staffId: string): Promise<string> {
  const staff = await getStaffMemberById(staffId)
  return staff.current_status || 'Idle'
}

/**
 * Assign order to driver
 */
export async function assignOrderToDriver(orderId: string, driverId: string): Promise<void> {
  await apiPost(`/booking/orders/${orderId}/assign-driver/`, {
    driver_id: driverId,
  })
}

/**
 * Get staff assigned orders
 */
export async function getStaffAssignedOrders(staffId: string) {
  return apiGet(`/staff/staff-members/${staffId}/orders/`)
}
