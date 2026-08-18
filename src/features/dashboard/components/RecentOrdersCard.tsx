'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { Package, ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { OrderListResponse, Order } from '@/shared/types'

interface RecentOrdersCardProps {
  recentOrders: OrderListResponse | null
  onSelectOrder: (order: Order) => void
}

export const RecentOrdersCard = ({ recentOrders, onSelectOrder }: RecentOrdersCardProps) => {
  return (
    <AnimateOnScroll animation="slide-up" delay={600}>
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/10 border-b border-border/50">
          <div>
            <CardTitle className="text-lg font-bold">Recent Invoices</CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">
              Latest active customer orders
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Link href="/orders">
              <Button size="sm" className="h-8 text-xs font-bold shadow-lg shadow-primary/20">
                Manage All Orders
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders?.results && recentOrders.results.length > 0 ? (
            <div className="divide-y divide-border/30">
              {recentOrders.results.map((order, i) => (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-muted/20 cursor-pointer transition-all group animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
                  style={{ animationDelay: `${700 + i * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Package className="w-5 h-5 text-primary/70" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm tracking-tight">{order.order_no}</p>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {order.customer_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none',
                        order.status === 'PENDING'
                          ? 'bg-amber-100/50 text-amber-700'
                          : order.status === 'CONFIRMED'
                          ? 'bg-blue-100/50 text-blue-700'
                          : order.status === 'PICKED_UP'
                          ? 'bg-indigo-100/50 text-indigo-700'
                          : 'bg-emerald-100/50 text-emerald-700'
                      )}
                    >
                      {order.status_display}
                    </Badge>
                    <div className="text-right min-w-[100px]">
                      <p className="text-base font-black">GH₵{order.total_amount.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">
                        Total Amount
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">No recent orders yet.</p>
              <p className="text-xs text-muted-foreground">
                New customer orders will appear here automatically.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
