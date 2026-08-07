'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  getDeliveryAssignments,
  createDeliveryAssignment,
  deleteDeliveryAssignment,
  getDriverAccounts,
  type DeliveryAssignment,
  type DriverAccount,
} from '@/features/logistics/api'
import { getOrders, getOrderById } from '@/features/orders/api'
import { Order } from '@/shared/interfaces'
import { getAssignmentTypes } from '../lib/assignments'

export function useStaffManagement() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<DriverAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [assignmentType, setAssignmentType] = useState('BOTH')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [isOrderLocked, setIsOrderLocked] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [assignmentData, orderData, driverData] = await Promise.all([
        getDeliveryAssignments().catch(() => []),
        getOrders({ limit: 50 }).then((res) => res.results).catch(() => []),
        getDriverAccounts().catch(() => []),
      ])
      setAssignments(assignmentData)
      setOrders(orderData)
      setDrivers(driverData)
    } catch (err: any) {
      setError(err.message || 'Failed to sync staff and delivery assignments.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    Promise.all([
      getDeliveryAssignments().catch(() => []),
      getOrders({ limit: 50 }).then((res) => res.results).catch(() => []),
      getDriverAccounts().catch(() => []),
    ])
      .then(([assignmentData, orderData, driverData]) => {
        if (!isCancelled) {
          setAssignments(assignmentData)
          setOrders(orderData)
          setDrivers(driverData)
        }
      })
      .catch((err: any) => {
        if (!isCancelled) {
          setError(err?.message || 'Failed to sync staff and delivery assignments.')
        }
      })
      .finally(() => {
        if (!isCancelled) setLoading(false)
      })
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const shouldOpenAssign = searchParams.get('assign') === '1'

    if (!orderId || !shouldOpenAssign) return

    setSelectedOrderId(orderId)
    setIsOrderLocked(true)
    setIsModalOpen(true)
    router.replace('/staff', { scroll: false })

    getOrderById(orderId)
      .then((order) => {
        setOrders((prev) => {
          if (prev.some((o) => o.id === order.id)) return prev
          return [order, ...prev]
        })
      })
      .catch(() => {})
  }, [searchParams, router])

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setSelectedOrderId('')
      setDriverId('')
      setIsOrderLocked(false)
      setModalError(null)
    }
  }

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId || !driverId) {
      setModalError('Please select an order and a driver account.')
      return
    }

    try {
      setIsSubmitting(true)
      setModalError(null)
      const assignmentTypes = getAssignmentTypes(assignmentType)
      await Promise.all(
        assignmentTypes.map((type) =>
          createDeliveryAssignment({
            order: selectedOrderId,
            driver: driverId,
            assignment_type: type,
          }),
        ),
      )
      setIsModalOpen(false)
      setSelectedOrderId('')
      setDriverId('')
      setIsOrderLocked(false)
      fetchData()
    } catch (err: any) {
      setModalError(err.message || 'Failed to create driver assignment. Verify the selected driver account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Are you sure you want to remove this driver assignment?')) return
    try {
      await deleteDeliveryAssignment(id)
      setAssignments((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) {
      alert('Failed to remove assignment: ' + (err.message || 'Unknown error'))
    }
  }

  const filteredAssignments = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return assignments.filter((a) => {
      return (
        a.order.toLowerCase().includes(query) ||
        (a.driverEmail && a.driverEmail.toLowerCase().includes(query)) ||
        a.driver.toLowerCase().includes(query)
      )
    })
  }, [assignments, searchQuery])

  const uniqueDrivers = useMemo(
    () => new Set(assignments.map((a) => a.driverEmail || a.driver)),
    [assignments]
  )

  const activeAssignments = useMemo(
    () => assignments.filter((a) => a.status !== 'COMPLETED'),
    [assignments]
  )

  const completedAssignments = useMemo(
    () => assignments.filter((a) => a.status === 'COMPLETED'),
    [assignments]
  )

  return {
    assignments,
    filteredAssignments,
    orders,
    drivers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchData,
    // Modal & Form State
    isModalOpen,
    setIsModalOpen: handleModalOpenChange,
    selectedOrderId,
    setSelectedOrderId,
    driverId,
    setDriverId,
    assignmentType,
    setAssignmentType,
    isSubmitting,
    modalError,
    isOrderLocked,
    handleCreateAssignment,
    handleDeleteAssignment,
    // Derived Stats
    uniqueDrivers,
    activeAssignments,
    completedAssignments,
  }
}
