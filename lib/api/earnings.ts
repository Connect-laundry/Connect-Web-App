import { apiGet } from './client'
import { EarningsResponse, Transaction } from '@/lib/types'

/**
 * Get earnings overview
 */
export async function getEarningsOverview(): Promise<EarningsResponse> {
  return apiGet<EarningsResponse>('/laundries/dashboard/earnings/')
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

  return apiGet<EarningsResponse>(`/laundries/dashboard/earnings/?${params.toString()}`)
}

/**
 * Get transaction history
 */
export async function getTransactionHistory(params?: {
  limit?: number
  offset?: number
  status?: string
  start_date?: string
  end_date?: string
}): Promise<{ count: number; results: Transaction[] }> {
  const queryString = new URLSearchParams()

  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.offset) queryString.append('offset', params.offset.toString())
  if (params?.status) queryString.append('status', params.status)
  if (params?.start_date) queryString.append('start_date', params.start_date)
  if (params?.end_date) queryString.append('end_date', params.end_date)

  const query = queryString.toString()
  return apiGet<{ count: number; results: Transaction[] }>(
    `/booking/transactions/${query ? '?' + query : ''}`
  )
}

/**
 * Export earnings as CSV
 */
export async function exportEarningsCSV(params?: {
  start_date?: string
  end_date?: string
}): Promise<Blob> {
  const queryString = new URLSearchParams()

  if (params?.start_date) queryString.append('start_date', params.start_date)
  if (params?.end_date) queryString.append('end_date', params.end_date)

  const query = queryString.toString()
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/laundries/dashboard/earnings/export/${query ? '?' + query : ''}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to export earnings')
  }

  return response.blob()
}
