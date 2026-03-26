import { apiGet, apiPost } from '@/shared/api/client'
import { Order, OrderListResponse } from '@/shared/types'

/**
 * Get all orders for the owner
 */
export async function getOrders(params?: {
  limit?: number
  offset?: number
  status?: string
  search?: string
}): Promise<OrderListResponse> {
  const queryString = new URLSearchParams()

  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.offset) queryString.append('offset', params.offset.toString())
  if (params?.status) queryString.append('status', params.status)
  if (params?.search) queryString.append('search', params.search)

  const query = queryString.toString()
  const endpoint = `/booking/bookings/${query ? '?' + query : ''}`

  return apiGet<OrderListResponse>(endpoint)
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order> {
  return apiGet<Order>(`/booking/bookings/${orderId}/`)
}

/**
 * Accept an order
 */
export async function acceptOrder(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/accept/`)
}

/**
 * Reject an order
 */
export async function rejectOrder(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/reject/`)
}

/**
 * Mark order as picked up
 */
export async function markPickedUp(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/mark-picked-up/`)
}

/**
 * Mark order as washed/in process
 */
export async function markWashed(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/mark-washed/`)
}

/**
 * Mark order as out for delivery
 */
export async function markOutForDelivery(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/mark-out-for-delivery/`)
}

/**
 * Mark order as delivered
 */
export async function markDelivered(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/mark-delivered/`)
}

/**
 * Mark order as completed
 */
export async function completeOrder(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/complete/`)
}

/**
 * Get available actions for an order based on its current status
 */
export function getAvailableActions(status: string): string[] {
  const actions: Record<string, string[]> = {
    PENDING: ['accept', 'reject'],
    CONFIRMED: ['markPickedUp'],
    PICKED_UP: ['markWashed'],
    IN_PROCESS: ['markOutForDelivery'],
    OUT_FOR_DELIVERY: ['markDelivered'],
    DELIVERED: ['complete'],
    COMPLETED: [],
    REJECTED: [],
    CANCELLED: [],
  }

  return actions[status] || []
}

/**
 * Execute an order action
 */
export async function executeOrderAction(orderId: string, action: string): Promise<Order> {
  const actionMap: Record<string, (id: string) => Promise<Order>> = {
    accept: acceptOrder,
    reject: rejectOrder,
    markPickedUp,
    markWashed,
    markOutForDelivery,
    markDelivered,
    complete: completeOrder,
  }

  const actionFn = actionMap[action]
  if (!actionFn) {
    throw new Error(`Unknown action: ${action}`)
  }

  return actionFn(orderId)
}
