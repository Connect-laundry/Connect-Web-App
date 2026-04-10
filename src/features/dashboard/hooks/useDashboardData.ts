'use client'

import { useEffect, useState, useMemo } from 'react'
import { getDashboardStats, getDashboardEarnings, getRecentOrders } from '../api'
import { DashboardStats, DashboardEarnings, OrderListResponse, Order } from '@/shared/interfaces'

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [earnings, setEarnings] = useState<DashboardEarnings | null>(null)
  const [recentOrders, setRecentOrders] = useState<OrderListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Order Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let inFlight = false

    const fetchDashboardData = async (isInitial = false) => {
      if (inFlight) return
      inFlight = true
      try {
        if (isInitial) setIsLoading(true)
        setError(null)

        const [statsData, earningsData, ordersData] = await Promise.all([
          getDashboardStats(),
          getDashboardEarnings(),
          getRecentOrders(5),
        ])

        setStats(statsData)
        setEarnings(earningsData)
        setRecentOrders(ordersData)
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        if (isInitial) setIsLoading(false)
        inFlight = false
      }
    }

    fetchDashboardData(true)
    const interval = setInterval(() => fetchDashboardData(), 10000)
    return () => clearInterval(interval)
  }, [])

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

  const handleOrderUpdated = (updatedOrder: Order) => {
    if (recentOrders?.results) {
      const updated = recentOrders.results.map((o) =>
        o.id === updatedOrder.id ? updatedOrder : o
      )
      setRecentOrders({ ...recentOrders, results: updated })
    }
  }

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  return {
    isLoading,
    error,
    recentOrders,
    metrics,
    selectedOrder,
    modalOpen,
    setModalOpen,
    handleSelectOrder,
    handleOrderUpdated,
  }
}
