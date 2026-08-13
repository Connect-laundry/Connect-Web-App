import { apiGet } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'
import { EarningsResponse, Transaction } from '@/shared/interfaces'
import { getPaymentOwnerStats } from '@/features/payments/api'

export interface PayoutOverview {
  summary: { held: string; available: string; paid: string; currency: string }
  settles_directly: boolean
  settlements: Array<{
    order_no: string | null
    gross: string
    commission: string
    net: string
    status: string
    route: string
    created_at: string
  }>
  payouts: Array<{
    id: string
    amount: string
    status: string
    method: string
    reference: string
    paid_at: string | null
    created_at: string
  }>
}

export async function getPayoutOverview(): Promise<PayoutOverview> {
  const response = await apiGet<any>('/laundries/dashboard/payouts/')
  return unwrap<PayoutOverview>(response)
}

/**
 * Get earnings overview
 */
export async function getEarningsOverview(): Promise<EarningsResponse> {
  const response = await apiGet<any>('/laundries/dashboard/earnings/')
  return unwrap<EarningsResponse>(response)
}

/**
 * Get earnings for a specific date range
 */
export async function getEarningsByDateRange(
  startDate: string,
  endDate: string
): Promise<EarningsResponse> {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  })

  return apiGet<EarningsResponse>(`/laundries/dashboard/earnings/?${params.toString()}`).then(
    (response) => unwrap<EarningsResponse>(response),
  )
}

import { getDashboardOrders } from '@/features/dashboard/api'

export async function getTransactionHistory(params?: {
  limit?: number
  offset?: number
  status?: string
  start_date?: string
  end_date?: string
}): Promise<{ count: number; results: Transaction[] }> {
  try {
    const ordersRes = await getDashboardOrders({
      limit: params?.limit ?? 50,
      offset: params?.offset,
      status: params?.status,
    })
    const results: Transaction[] = (ordersRes.results || [])
      .filter((o) => o.status === 'DELIVERED' || o.status === 'COMPLETED')
      .map((o) => ({
        id: o.id,
        order_id: o.id,
        order_no: o.order_no,
        customer_name: o.customer_name || 'Customer',
        amount: Number(o.total_amount) || 0,
        status: o.status as Transaction['status'],
        date: o.created_at || new Date().toISOString(),
      }))

    if (results.length > 0) {
      return { count: results.length, results }
    }
  } catch (_e) {
    /* The payout endpoint is authoritative; do not fabricate history on failure. */
  }

  return { count: 0, results: [] }
}

/**
 * Export earnings as CSV
 */
export async function exportEarningsCSV(): Promise<Blob> {
  const [earnings, stats] = await Promise.all([
    getEarningsOverview(),
    getPaymentOwnerStats(),
  ])

  const lines = [
    'Metric,Value',
    `Today,${earnings.today}`,
    `This Week,${earnings.this_week}`,
    `This Month,${earnings.this_month}`,
    `Total Revenue,${earnings.total_revenue}`,
    '',
    'Payment Method,Count,Total Amount',
    ...(stats.method_breakdown ?? []).map(
      (row) => `${row.payment_method},${row.count},${row.total_amount}`,
    ),
  ]

  return new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
}
