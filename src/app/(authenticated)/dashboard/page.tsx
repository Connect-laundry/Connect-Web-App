'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats, getDashboardEarnings, getRecentOrders } from '@/features/dashboard/api'
import { DashboardStats, DashboardEarnings, OrderListResponse } from '@/shared/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Spinner } from '@/shared/ui/spinner'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle, TrendingUp, Package, CheckCircle, Clock, Search, Bell, Filter, MoreHorizontal, ArrowUpRight, Users, Settings, Store } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'

import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [earnings, setEarnings] = useState<DashboardEarnings | null>(null)
  const [recentOrders, setRecentOrders] = useState<OrderListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
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
        setIsLoading(false)
      }
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 10000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing your business data...</p>
      </div>
    )
  }

  return (
    <div className="max-w-(--breakpoint-2xl) mx-auto p-6 md:p-8">
      {/* Top Header Bar (Integrated) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Overview of your laundry operations for today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search orders, customers..." 
              className="pl-10 w-64 h-10 border-border/50 bg-muted/30 focus:bg-background transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>
          <div className="h-10 w-px bg-border mx-1" />
          <Avatar className="h-10 w-10 border border-border/50 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {error && (
        <AnimateOnScroll animation="fade-in">
          <Alert variant="destructive" className="mb-8 border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        </AnimateOnScroll>
      )}

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="New Orders" 
          value={stats?.pending_count || 0} 
          subtitle="Pending approval"
          icon={Clock}
          color="blue"
          trend="+5%"
          trendIsUp={true}
          index={0}
        />
        <StatCard 
          title="In Processing" 
          value={stats?.picked_up_count || 0} 
          subtitle="Actively washing/drying"
          icon={TrendingUp}
          color="indigo"
          trend="+12%"
          trendIsUp={true}
          index={1}
        />
        <StatCard 
          title="Ready For Delivery" 
          value={stats?.confirmed_count || 0} 
          subtitle="Awaiting dispatch"
          icon={Package}
          color="amber"
          trend="-2%"
          trendIsUp={false}
          index={2}
        />
        <StatCard 
          title="Daily Revenue" 
          value={`₦${(earnings?.today || 0).toLocaleString()}`} 
          subtitle="From completed jobs"
          icon={CheckCircle}
          color="emerald"
          trend="+8.3%"
          trendIsUp={true}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Weekly Revenue Chart / Card */}
        <AnimateOnScroll animation="slide-up" delay={400} className="lg:col-span-2">
          <Card className="h-full border-border/50 shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
              <div>
                <CardTitle className="text-lg font-bold">Performance Summary</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider font-bold text-muted-foreground/60 mt-0.5">Financial Metrics</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex flex-col p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Total Balance</span>
                    <span className="text-3xl font-black">₦{(earnings?.total_revenue || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Weekly</span>
                      <span className="text-lg font-bold">₦{(earnings?.this_week || 0).toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                        <ArrowUpRight className="w-2.5 h-2.5" />
                        <span>14.5%</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Monthly</span>
                      <span className="text-lg font-bold">₦{(earnings?.this_month || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-2xl flex flex-col items-center justify-center p-8 border border-dashed border-border group-hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm mb-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-center mb-1">Revenue Tracking</p>
                  <p className="text-xs text-muted-foreground text-center px-4">Detailed analytics and reports will be available soon.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateOnScroll>

        {/* Quick Actions / Activity */}
        <AnimateOnScroll animation="slide-up" delay={500}>
          <Card className="h-full border-border/50 shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {[
                { label: 'Register New Staff', icon: Users, color: 'blue' },
                { label: 'Update Service Fees', icon: Settings, color: 'gray' },
                { label: 'Review Business Info', icon: Store, color: 'indigo' },
              ].map((action, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className="w-full h-12 justify-start gap-4 border-border/30 hover:bg-muted/50 group transition-all"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform", 
                    action.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : 
                    action.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-gray-500/10 text-gray-500'
                  )}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">{action.label}</span>
                </Button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border/50">
                <div className="bg-primary p-6 rounded-2xl text-primary-foreground relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-sm font-bold mb-1 relative z-10">Premium Plan</p>
                  <p className="text-[10px] opacity-80 mb-4 relative z-10">Your current owner subscription is active until July 2026.</p>
                  <Button variant="secondary" size="sm" className="w-full text-xs font-bold relative z-10">Manage Subscription</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateOnScroll>
      </div>

      {/* Recent Orders List */}
      <AnimateOnScroll animation="slide-up" delay={600}>
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/10 border-b border-border/50">
            <div>
              <CardTitle className="text-lg font-bold">Recent Invoices</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground">Latest 5 active orders</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-bold border-border/50">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </Button>
              <Link href="/orders">
                <Button size="sm" className="h-8 text-xs font-bold shadow-lg shadow-primary/20">
                  Manage All
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
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-muted/20 transition-all group animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
                    style={{ animationDelay: `${700 + (i * 100)}ms` }}
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
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{order.customer_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                      <Badge 
                        variant="secondary" 
                        className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none", 
                          order.status === 'PENDING' ? 'bg-amber-100/50 text-amber-700' : 
                          order.status === 'CONFIRMED' ? 'bg-blue-100/50 text-blue-700' : 
                          order.status === 'PICKED_UP' ? 'bg-indigo-100/50 text-indigo-700' :
                          'bg-emerald-100/50 text-emerald-700'
                        )}
                      >
                        {order.status_display}
                      </Badge>
                      <div className="text-right min-w-[100px]">
                        <p className="text-base font-black">₦{order.total_amount.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Total Amount</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
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
                 <p className="text-sm font-bold text-muted-foreground">No recent activity found.</p>
                 <Button variant="link" className="text-xs font-bold text-primary">Sync Database</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimateOnScroll>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend, trendIsUp, index }: any) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  }

  return (
    <AnimateOnScroll animation="slide-up" delay={index * 100}>
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative">
        <div className={cn("absolute top-0 right-0 w-24 h-24 -translate-y-12 translate-x-12 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500", 
          color === 'blue' ? 'bg-blue-500' : color === 'indigo' ? 'bg-indigo-500' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
        )} />
        
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
          <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110 duration-300", colorMap[color])}>
            <Icon className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-black tracking-tight">{value}</div>
              <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-tighter mt-1">{subtitle}</p>
            </div>
            {trend && (
              <div className={cn("flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-black", 
                trendIsUp ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              )}>
                {trendIsUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5 rotate-180" />}
                {trend}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
