'use client'

import { useEffect, useState } from 'react'
import { getDashboardOrders } from '@/features/dashboard/api'
import { OrderListResponse, Order } from '@/shared/interfaces'

export function useOrderManagement() {
  const [orders, setOrders] = useState<OrderListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const ordersPerPage = 10

  const refetch = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const offset = (currentPage - 1) * ordersPerPage
      const data = await getDashboardOrders({
        limit: ordersPerPage,
        offset,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      })
      setOrders(data)
    } catch (err: any) {
      console.error('Failed to fetch orders:', err)
      setError(err?.message || 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isCancelled = false
    getDashboardOrders({
      limit: ordersPerPage,
      offset: (currentPage - 1) * ordersPerPage,
      status: statusFilter || undefined,
      search: searchQuery || undefined,
    })
      .then((data) => {
        if (!isCancelled) setOrders(data)
      })
      .catch((err: any) => {
        if (!isCancelled) {
          console.error('Failed to fetch orders:', err)
          setError(err?.message || 'Failed to load orders')
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })
    return () => {
      isCancelled = true
    }
  }, [statusFilter, searchQuery, currentPage])

  const handleOrderUpdated = (updatedOrder: Order) => {
    if (orders?.results) {
      const updatedOrders = orders.results.map((o) =>
        o.id === updatedOrder.id ? updatedOrder : o
      )
      setOrders({ ...orders, results: updatedOrders })
    }
  }

  return {
    orders,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    selectedOrder,
    setSelectedOrder,
    detailModalOpen,
    setDetailModalOpen,
    ordersPerPage,
    handleOrderUpdated,
    refetch,
  }
}
