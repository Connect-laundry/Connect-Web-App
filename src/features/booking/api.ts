import { apiGet, apiPost } from '@/shared/api/client'
import { unwrap, unwrapList, unwrapPaginated } from '@/shared/api/unwrap'
import { OrderListResponse } from '@/shared/interfaces'

export async function getCatalogServices() {
  const response = await apiGet<any>('/booking/services/')
  return unwrapList<any>(response)
}

export async function getCatalogItems() {
  const response = await apiGet<any>('/booking/items/')
  return unwrapList<any>(response)
}

export async function getBookingSchedule(laundryId: string) {
  const response = await apiGet<any>(`/booking/schedule/?laundry_id=${laundryId}`)
  return unwrap<any>(response)
}

export async function estimateBooking(data: Record<string, unknown>) {
  const response = await apiPost<any>('/booking/estimate/', data)
  return unwrap<any>(response)
}

export async function getCustomerOrders(): Promise<OrderListResponse> {
  const response = await apiGet<any>('/booking/')
  const page = unwrapPaginated<any>(response)
  return {
    count: page.count,
    results: page.results,
    next: page.next ?? undefined,
    previous: page.previous ?? undefined,
  }
}

export async function getActiveCustomerOrders() {
  const response = await apiGet<any>('/booking/active/')
  return unwrapList<any>(response)
}

export async function validateCoupon(data: {
  code: string
  laundry_id: string
  items_total: string | number
}) {
  const response = await apiPost<any>('/booking/coupons/validate/', data)
  return unwrap<any>(response)
}

export async function getOrderTracking(orderId: string) {
  const response = await apiGet<any>(`/booking/${orderId}/tracking/`)
  return unwrap<any>(response)
}
