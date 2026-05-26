'use client'

import { useEffect, useState, useRef } from 'react'
import { getDashboardOrders } from '@/features/dashboard/api'
import { OrderListResponse, Order } from '@/shared/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Spinner } from '@/shared/ui/spinner'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { OrderDetailModal } from '@/features/orders/components/OrderDetailModal'
import { PageShell } from '@/shared/components/layout/PageShell'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { getOrderStatusBadgeClass } from '@/shared/lib/order-status'
import { cn } from '@/shared/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

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
  const hasLoadedOnce = useRef(false)
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
        if (!hasLoadedOnce.current) setIsLoading(true)
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
        hasLoadedOnce.current = true
      }
    }

    fetchOrders()
  }, [statusFilter, searchQuery, currentPage])

  return (
    <PageShell>
      <PageHeader
        title="Orders"
        description="Manage and update every order in your pipeline."
      />

      {error && (
        <Alert variant="destructive" className="mb-6 surface-card border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="surface-card border-0 mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-black">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground">Search</label>
            <Input
              placeholder="Order no or customer name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="mt-1.5 h-11 rounded-xl border-border/60 bg-background/80"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground">Status</label>
            <Select value={statusFilter || 'ALL'} onValueChange={(value) => {
              setStatusFilter(value === 'ALL' ? '' : value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl">
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
        <Card className="surface-card border-0 overflow-hidden py-0 gap-0">
          <CardHeader className="border-b border-border/40 bg-muted/15 py-5">
            <CardTitle className="font-black">All orders</CardTitle>
            <CardDescription>{orders?.count ?? 0} total</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {orders?.results && orders.results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/40 bg-muted/10">
                    <tr>
                      <th className="text-left py-4 px-5 font-bold text-muted-foreground text-xs uppercase tracking-wider">Order</th>
                      <th className="text-left py-4 px-5 font-bold text-muted-foreground text-xs uppercase tracking-wider">Customer</th>
                      <th className="text-left py-4 px-5 font-bold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-5 font-bold text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                      <th className="text-left py-4 px-5 font-bold text-muted-foreground text-xs uppercase tracking-wider">Pickup</th>
                      <th className="text-right py-4 px-5 font-bold text-muted-foreground text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.results.map((order: Order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border/30 hover:bg-primary/[0.04] transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order)
                          setDetailModalOpen(true)
                        }}
                      >
                        <td className="py-4 px-5 font-bold">{order.order_no}</td>
                        <td className="py-4 px-5">{order.customer_name}</td>
                        <td className="py-4 px-5">
                          <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase', getOrderStatusBadgeClass(order.status))}>
                            {order.status_display}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-black tabular-nums">₦{order.total_amount.toLocaleString()}</td>
                        <td className="py-4 px-5 text-muted-foreground">
                          {new Date(order.pickup_date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg font-semibold"
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
    </PageShell>
  )
}
