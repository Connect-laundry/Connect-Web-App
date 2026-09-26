import { useCallback, useState } from 'react'
import { getDashboardEarnings } from '@/features/dashboard/api'
import { useSilentPolling } from '@/shared/hooks/useSilentPolling'
import type { DashboardEarnings, Transaction } from '@/shared/types'
import {
  exportEarningsCSV,
  getPayoutsDashboard,
  getTransactionHistory,
  type DashboardPayoutsResponse,
} from '../api'

const emptyEarnings: DashboardEarnings = { today: 0, this_week: 0, this_month: 0, total_revenue: 0 }

export function useEarnings() {
  const [earnings, setEarnings] = useState(emptyEarnings)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [payoutsData, setPayoutsData] = useState<DashboardPayoutsResponse | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    let metrics: DashboardEarnings | null = null
    let rows: Transaction[] = []

    try {
      const pData = await getPayoutsDashboard()
      setPayoutsData(pData)
    } catch (e: any) {
      console.warn('Payouts dashboard load warning:', e)
    }

    try {
      metrics = await getDashboardEarnings()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to sync recent earnings metrics')
    }

    try {
      const response = await getTransactionHistory({ limit: 50 })
      rows = Array.isArray(response)
        ? response
        : ((response as unknown as { results?: Transaction[]; data?: Transaction[] }).results ??
            (response as unknown as { data?: Transaction[] }).data ?? [])
    } catch {
      console.warn('Transactions API endpoint fallback.')
    }

    const total = rows.reduce((sum, transaction) => sum + (Number(transaction.amount) || 0), 0)
    if (total > 0 && (!metrics || metrics.total_revenue === 0 || metrics.today === 0)) {
      metrics = {
        today: metrics?.today || total,
        this_week: metrics?.this_week || total,
        this_month: metrics?.this_month || total,
        total_revenue: metrics?.total_revenue || total,
      }
    }
    if (metrics) setEarnings(metrics)
    setTransactions(rows)
  }, [])

  const { isInitialLoading } = useSilentPolling(load, 20000)

  const exportReport = async () => {
    setIsExporting(true)
    try {
      const url = window.URL.createObjectURL(await exportEarningsCSV())
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `connect-earnings-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(anchor)
      anchor.click()
      window.URL.revokeObjectURL(url)
      anchor.remove()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to export report')
    } finally {
      setIsExporting(false)
    }
  }

  return {
    earnings,
    transactions,
    payoutsData,
    isExporting,
    error,
    isInitialLoading,
    exportReport,
    refresh: load,
  }
}
