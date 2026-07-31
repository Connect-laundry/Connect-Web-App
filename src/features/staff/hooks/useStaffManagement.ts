'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getDeliveryAssignments,
  createDeliveryAssignment,
  deleteDeliveryAssignment,
  type DeliveryAssignment,
} from '@/features/logistics/api'
import { getOrders } from '@/features/orders/api'
import { Order } from '@/shared/interfaces'

export function useStaffManagement() {
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([])
  const [orders, setOrders] = useState<Order[]>([])
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [assignmentData, orderData] = await Promise.all([
        getDeliveryAssignments().catch(() => []),
        getOrders({ limit: 50 }).then((res) => res.results).catch(() => []),
      ])
      setAssignments(assignmentData)
      setOrders(orderData)
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
    ])
      .then(([assignmentData, orderData]) => {
        if (!isCancelled) {
          setAssignments(assignmentData)
          setOrders(orderData)
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

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId || !driverId) {
      setModalError('Please select an order and provide a driver ID / UUID.')
      return
    }

    try {
      setIsSubmitting(true)
      setModalError(null)
      await createDeliveryAssignment({
        order: selectedOrderId,
        driver: driverId,
        assignment_type: assignmentType,
      })
      setIsModalOpen(false)
      setSelectedOrderId('')
      setDriverId('')
      fetchData()
    } catch (err: any) {
      setModalError(err.message || 'Failed to create driver assignment. Verify driver UUID/account.')
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
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchData,
    // Modal & Form State
    isModalOpen,
    setIsModalOpen,
    selectedOrderId,
    setSelectedOrderId,
    driverId,
    setDriverId,
    assignmentType,
    setAssignmentType,
    isSubmitting,
    modalError,
    handleCreateAssignment,
    handleDeleteAssignment,
    // Derived Stats
    uniqueDrivers,
    activeAssignments,
    completedAssignments,
  }
}
