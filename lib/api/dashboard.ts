import { apiGet } from './client'
import { DashboardStats, DashboardEarnings, Order, OrderListResponse } from '@/lib/types'

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>('/dashboard/overview')
}

/**
 * Get dashboard earnings
 */
export async function getDashboardEarnings(): Promise<DashboardEarnings> {
  return apiGet<DashboardEarnings>('/dashboard/earnings')
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

  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.offset) queryString.append('offset', params.offset.toString())
  if (params?.status) queryString.append('status', params.status)
  if (params?.search) queryString.append('search', params.search)

  const query = queryString.toString()
  const endpoint = `/dashboard/orders${query ? '?' + query : ''}`

  return apiGet<OrderListResponse>(endpoint)
}

/**
 * Get recent orders (limit to 5-10 for dashboard)
 */
export async function getRecentOrders(limit = 5): Promise<OrderListResponse> {
  return getDashboardOrders({ limit, offset: 0 })
}
