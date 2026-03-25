import { apiGet } from '@/shared/api/client'
import { DashboardStats, DashboardEarnings, Order, OrderListResponse } from '@/shared/types'

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiGet<any>('/laundries/dashboard/stats/')
  // Backend wraps data in { status, data } envelope
  return response.data || response
}

/**
 * Get dashboard earnings
 */
export async function getDashboardEarnings(): Promise<DashboardEarnings> {
  const response = await apiGet<any>('/laundries/dashboard/earnings/')
  // Backend wraps data in { status, data } envelope
  return response.data || response
}

/**
 * Get orders for owner dashboard
 */
export async function getDashboardOrders(params?: {
  limit?: number
  offset?: number
  status?: string
  search?: string
}): Promise<OrderListResponse> {
  const queryString = new URLSearchParams()

  if (params?.limit) queryString.append('page_size', params.limit.toString())
  if (params?.offset) queryString.append('page', Math.floor((params.offset || 0) / (params?.limit || 20) + 1).toString())
  if (params?.status) queryString.append('status', params.status)
  if (params?.search) queryString.append('search', params.search)

  const query = queryString.toString()
  const endpoint = `/laundries/dashboard/orders/${query ? '?' + query : ''}`

  return apiGet<OrderListResponse>(endpoint)
}

/**
 * Get recent orders (limit to 5-10 for dashboard)
 */
export async function getRecentOrders(limit = 5): Promise<OrderListResponse> {
  return getDashboardOrders({ limit, offset: 0 })
}
