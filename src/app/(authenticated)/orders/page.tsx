'use client'

import { useOrderManagement } from '@/features/orders/hooks/useOrderManagement'
import { OrdersFilters } from '@/features/orders/components/OrdersFilters'
import { OrdersTable } from '@/features/orders/components/OrdersTable'
import { OrderDetailModal } from '@/features/orders/components/OrderDetailModal'
import { Spinner } from '@/shared/ui/spinner'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function OrdersPage() {
  const {
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
  } = useOrderManagement()

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage all your laundry orders</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <OrdersFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q)
          setCurrentPage(1)
        }}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s)
          setCurrentPage(1)
        }}
      />

      {/* Loading State or Orders Table */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <Spinner />
        </div>
      ) : (
        <OrdersTable
          orders={orders}
          ordersPerPage={ordersPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSelectOrder={(order) => {
            setSelectedOrder(order)
            setDetailModalOpen(true)
          }}
        />
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  )
}
