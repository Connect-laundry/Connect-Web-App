import { apiGet } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'
import { EarningsResponse, Transaction } from '@/shared/interfaces'
import { getPaymentOwnerStats } from '@/features/payments/api'

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
    const ordersRes = await getDashboardOrders({ limit: 50 })
    const results: Transaction[] = (ordersRes.results || []).map((o) => ({
      id: o.id,
      order_id: o.id,
      order_no: o.order_no,
      customer_name: o.customer_name || 'Customer',
      amount: Number(o.total_amount) || 0,
      status: o.status === 'CANCELLED' || o.status === 'REJECTED' ? 'COMPLETED' : 'COMPLETED',
      date: o.created_at || new Date().toISOString(),
    }))

    if (results.length > 0) {
      return { count: results.length, results }
    }
  } catch (_e) {
    /* fallback to payment stats if orders fetch fails */
  }

  const stats = await getPaymentOwnerStats()
  const results: Transaction[] = (stats.method_breakdown ?? []).map((row, index) => ({
    id: `${row.payment_method}-${index}`,
    order_id: row.payment_method,
    order_no: row.payment_method,
    customer_name: `${row.payment_method.replace('_', ' ')} Payment`,
    amount: Number(row.total_amount),
    status: 'COMPLETED' as const,
    date: new Date().toISOString(),
  }))

  return {
    count: results.length,
    results: results.slice(params?.offset ?? 0, (params?.offset ?? 0) + (params?.limit ?? 50)),
  }
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
