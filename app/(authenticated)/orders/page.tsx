'use client'

import { useEffect, useState } from 'react'
import { getDashboardOrders } from '@/lib/api/dashboard'
import { OrderListResponse, Order } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OrderDetailModal } from '@/components/orders/OrderDetailModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'IN_PROCESS', label: 'In Process' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'COMPLETED', label: 'Completed' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const ordersPerPage = 10

  useEffect(() => {
    const fetchOrders = async () => {
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
        setError(err.message || 'Failed to load orders')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [statusFilter, searchQuery, currentPage])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-purple-100 text-purple-800',
      IN_PROCESS: 'bg-orange-100 text-orange-800',
      OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-emerald-100 text-emerald-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-8">
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Search Order</label>
            <Input
              placeholder="Order no or customer name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter || 'ALL'} onValueChange={(value) => {
              setStatusFilter(value === 'ALL' ? '' : value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <Spinner />
        </div>
      ) : (
        /* Orders Table */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Total: {orders?.count || 0} orders</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {orders?.results && orders.results.length > 0 ? (
              <div className="space-y-2 overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Order No</th>
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Pickup Date</th>
                      <th className="text-right py-3 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.results.map((order: Order) => (
                      <tr
                        key={order.id}
                        className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order)
                          setDetailModalOpen(true)
                        }}
                      >
                        <td className="py-3 px-4 font-medium">{order.order_no}</td>
                        <td className="py-3 px-4">{order.customer_name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status_display}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">₦{order.total_amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(order.pickup_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOrder(order)
                              setDetailModalOpen(true)
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No orders found</p>
            )}

            {/* Pagination */}
            {orders && orders.count > ordersPerPage && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {Math.ceil(orders.count / ordersPerPage)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!orders.previous}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!orders.next}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onOrderUpdated={(updatedOrder) => {
          // Update the order in the list
          if (orders?.results) {
            const updatedOrders = orders.results.map((o) =>
              o.id === updatedOrder.id ? updatedOrder : o
            )
            setOrders({ ...orders, results: updatedOrders })
          }
        }}
      />
    </div>
  )
}
