import { apiGet } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'

export interface PaymentOwnerStats {
  total_revenue: number | string
  count_success: number
  count_failed: number
  count_pending: number
  method_breakdown: Array<{
    payment_method: string
    count: number
    total_amount: number | string
  }>
}

export async function getPaymentOwnerStats(): Promise<PaymentOwnerStats> {
  const response = await apiGet<any>('/payments/owner-stats/')
  return unwrap<PaymentOwnerStats>(response)
}

export async function getPaymentStatus(reference: string) {
  const response = await apiGet<any>(`/payments/status/${reference}/`)
  return unwrap<any>(response)
}

export async function getPaymentReceipt(reference: string) {
  const response = await apiGet<any>(`/payments/receipt/${reference}/`)
  return unwrap<any>(response)
}
