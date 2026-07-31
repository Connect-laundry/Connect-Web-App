'use client'

import { useCallback, useMemo, useState } from 'react'
import { getDashboardStats, getDashboardEarnings, getRecentOrders } from '@/features/dashboard/api'
import { DASHBOARD_POLL_INTERVAL_MS } from '@/features/dashboard/constants/stat-cards'
import { getUnreadNotificationCount } from '@/features/notifications/api'
import { SessionExpiredError } from '@/shared/api/client'
import { useSilentPolling } from '@/shared/hooks/useSilentPolling'
import type { DashboardEarnings, DashboardStats, Order, OrderListResponse } from '@/shared/interfaces'

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [earnings, setEarnings] = useState<DashboardEarnings | null>(null)
  const [recentOrders, setRecentOrders] = useState<OrderListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Order Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

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

  // Derived metrics calculation
  const metrics = useMemo(() => {
    const orders = recentOrders?.results || []
    const pendingCount =
      stats?.pending_count && stats.pending_count > 0
        ? stats.pending_count
        : orders.filter((o) => o.status === 'PENDING').length

    const inProcessCount =
      stats?.picked_up_count && stats.picked_up_count > 0
        ? stats.picked_up_count
        : orders.filter((o) => ['PICKED_UP', 'IN_PROCESS', 'CONFIRMED'].includes(o.status)).length

    const readyCount =
      stats?.confirmed_count && stats.confirmed_count > 0
        ? stats.confirmed_count
        : orders.filter((o) => ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status)).length

    const ordersRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
    const dailyRevenue = earnings?.today && earnings.today > 0 ? earnings.today : ordersRevenue
    const totalRevenue =
      earnings?.total_revenue && earnings.total_revenue > 0 ? earnings.total_revenue : ordersRevenue
    const weeklyRevenue = earnings?.this_week && earnings.this_week > 0 ? earnings.this_week : ordersRevenue
    const monthlyRevenue =
      earnings?.this_month && earnings.this_month > 0 ? earnings.this_month : ordersRevenue

    return {
      pendingCount,
      inProcessCount,
      readyCount,
      dailyRevenue,
      totalRevenue,
      weeklyRevenue,
      monthlyRevenue,
    }
  }, [stats, earnings, recentOrders])

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

  const handleSelectOrder = useCallback((order: Order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }, [])

  return {
    stats,
    earnings,
    recentOrders,
    metrics,
    error,
    unreadCount,
    isInitialLoading,
    isRefreshing,
    selectedOrder,
    modalOpen,
    setModalOpen,
    handleSelectOrder,
    updateRecentOrder,
  }
}
