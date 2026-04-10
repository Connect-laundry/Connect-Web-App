/**
 * Staff management is not implemented on the backend yet.
 * Delivery assignments live under /logistics/assignments/ — use logistics/api.ts instead.
 */
import {
  createDeliveryAssignment,
  deleteDeliveryAssignment,
  getDeliveryAssignments,
  updateDeliveryAssignment,
} from '@/features/logistics/api'

export {
  createDeliveryAssignment,
  deleteDeliveryAssignment,
  getDeliveryAssignments,
  updateDeliveryAssignment,
}

const STAFF_UNAVAILABLE =
  'Staff member endpoints (/staff/staff-members/) are not implemented on the backend yet.'

export async function getStaffMembers(): Promise<never[]> {
  console.warn(STAFF_UNAVAILABLE)
  return []
}

export async function getStaffMemberById(_staffId: string): Promise<never> {
  throw new Error(STAFF_UNAVAILABLE)
}

export async function createStaffMember(_data: unknown): Promise<never> {
  throw new Error(STAFF_UNAVAILABLE)
}

export async function updateStaffMember(_staffId: string, _data: unknown): Promise<never> {
  throw new Error(STAFF_UNAVAILABLE)
}

export async function updateStaffRole(_staffId: string, _role: string): Promise<never> {
  throw new Error(STAFF_UNAVAILABLE)
}

export async function deactivateStaffMember(_staffId: string): Promise<never> {
  throw new Error(STAFF_UNAVAILABLE)
}

export async function getStaffStatus(_staffId: string): Promise<string> {
  return 'Unavailable'
}

export async function assignOrderToDriver(orderId: string, driverId: string): Promise<void> {
  await createDeliveryAssignment({ order: orderId, driver: driverId })
}

export async function getStaffAssignedOrders(_staffId: string) {
  return getDeliveryAssignments()
}
