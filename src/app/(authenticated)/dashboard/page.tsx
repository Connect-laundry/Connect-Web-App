'use client'

import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'
import { Spinner } from '@/shared/ui/spinner'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { OrderDetailModal } from '@/features/orders/components/OrderDetailModal'

import { DashboardStatsGrid } from '@/features/dashboard/components/DashboardStatsGrid'
import { PerformanceSummaryCard } from '@/features/dashboard/components/PerformanceSummaryCard'
import { QuickActionsCard } from '@/features/dashboard/components/QuickActionsCard'
import { RecentOrdersCard } from '@/features/dashboard/components/RecentOrdersCard'

const DashboardPage = () => {
  const {
    isInitialLoading,
    error,
    recentOrders,
    metrics,
    selectedOrder,
    modalOpen,
    setModalOpen,
    handleSelectOrder,
    updateRecentOrder,
  } = useDashboardData()

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Syncing your business data...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Overview of your laundry operations for today.
          </p>
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

      {/* Operational Stats Grid */}
      <DashboardStatsGrid
        pendingCount={metrics.pendingCount}
        inProcessCount={metrics.inProcessCount}
        readyCount={metrics.readyCount}
        dailyRevenue={metrics.dailyRevenue}
      />

      {/* Performance Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <PerformanceSummaryCard
          totalRevenue={metrics.totalRevenue}
          weeklyRevenue={metrics.weeklyRevenue}
          monthlyRevenue={metrics.monthlyRevenue}
        />
        <QuickActionsCard />
      </div>

      {/* Recent Orders List */}
      <RecentOrdersCard recentOrders={recentOrders} onSelectOrder={handleSelectOrder} />

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onOrderUpdated={updateRecentOrder}
      />
    </div>
  )
}

export default DashboardPage
