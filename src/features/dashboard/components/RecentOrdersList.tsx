'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OrderDetailModal } from '@/features/orders/components/OrderDetailModal'
import type { Order } from '@/features/dashboard/types'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { getOrderStatusBadgeClass } from '@/shared/lib/order-status'
import { formatCurrency } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { ArrowUpRight, Package } from 'lucide-react'
import type { OrderListResponse } from '@/shared/types'

interface RecentOrdersListProps {
  recentOrders: OrderListResponse | null
  onOrderUpdated: (order: Order) => void
}

export const RecentOrdersList = ({ recentOrders, onOrderUpdated }: RecentOrdersListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const openOrder = (order: Order) => {
    setSelectedOrder(order)
    setDetailModalOpen(true)
  }

  return (
    <>
      <AnimateOnScroll animation="slide-up" delay={360}>
        <Card className="surface-card border-0 overflow-hidden py-0 gap-0">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 py-5">
            <div>
              <CardTitle className="text-lg font-black">Recent orders</CardTitle>
              <CardDescription>Latest activity — tap to manage</CardDescription>
            </div>
            <Link href="/orders">
              <Button size="sm" className="shadow-glow-sm font-bold">
                View all
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders?.results?.length ? (
              <div className="divide-y divide-border/40">
                {recentOrders.results.map((order) => (
                  <div
                    key={order.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openOrder(order)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') openOrder(order)
                    }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:bg-primary/3 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{order.order_no}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                      <Badge
                        className={cn(
                          'rounded-full text-[10px] font-bold uppercase border-0',
                          getOrderStatusBadgeClass(order.status),
                        )}
                      >
                        {order.status_display}
                      </Badge>
                      <p className="text-lg font-black tabular-nums min-w-[90px] text-right">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-muted-foreground">
                <Package className="w-10 h-10 opacity-30 mb-3" />
                <p className="font-semibold text-sm">No orders yet</p>
                <Link href="/orders" className="mt-2 text-primary text-sm font-bold hover:underline">
                  Go to orders
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimateOnScroll>

      <OrderDetailModal
        order={selectedOrder}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onOrderUpdated={onOrderUpdated}
      />
    </>
  )
}
