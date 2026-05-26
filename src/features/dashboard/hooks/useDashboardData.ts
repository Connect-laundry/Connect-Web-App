'use client'

import { useCallback, useState } from 'react'
import { getDashboardStats, getDashboardEarnings, getRecentOrders } from '@/features/dashboard/api'
import { DASHBOARD_POLL_INTERVAL_MS } from '@/features/dashboard/constants/stat-cards'
import { getUnreadNotificationCount } from '@/features/notifications/api'
import { SessionExpiredError } from '@/shared/api/client'
import { useSilentPolling } from '@/shared/hooks/useSilentPolling'
import type { DashboardEarnings, DashboardStats, Order, OrderListResponse } from '@/shared/types'

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [earnings, setEarnings] = useState<DashboardEarnings | null>(null)
  const [recentOrders, setRecentOrders] = useState<OrderListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchDashboardData = useCallback(async () => {
    setError(null)
    const [statsResult, earningsResult, ordersResult, unreadResult] = await Promise.allSettled([
      getDashboardStats(),
      getDashboardEarnings(),
      getRecentOrders(5),
      getUnreadNotificationCount(),
    ])

    if (statsResult.status === 'fulfilled') setStats(statsResult.value)
    if (earningsResult.status === 'fulfilled') setEarnings(earningsResult.value)
    if (ordersResult.status === 'fulfilled') setRecentOrders(ordersResult.value)
    if (unreadResult.status === 'fulfilled') setUnreadCount(unreadResult.value)

    const failures = [statsResult, earningsResult, ordersResult].filter(
      (r): r is PromiseRejectedResult => r.status === 'rejected',
    )
    if (failures.length === 3) {
      const first = failures[0].reason
      if (first instanceof SessionExpiredError) return
      setError(first instanceof Error ? first.message : 'Failed to load dashboard data')
    } else if (failures.length > 0) {
      console.warn('[dashboard] partial load failure', failures[0].reason)
    }
  }, [])

  const { isInitialLoading, isRefreshing } = useSilentPolling(
    fetchDashboardData,
    DASHBOARD_POLL_INTERVAL_MS,
  )

  const updateRecentOrder = useCallback((updatedOrder: Order) => {
    setRecentOrders((prev) => {
      if (!prev?.results) return prev
      return {
        ...prev,
        results: prev.results.map((o) =>
          o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o,
        ),
      }
    })
  }, [])

  return {
    stats,
    earnings,
    recentOrders,
    error,
    unreadCount,
    isInitialLoading,
    isRefreshing,
    updateRecentOrder,
  }
}
