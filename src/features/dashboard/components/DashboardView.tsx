'use client'

import { DashboardLoadingState } from '@/features/dashboard/components/DashboardLoadingState'
import { DashboardShortcutsCard } from '@/features/dashboard/components/DashboardShortcutsCard'
import { DashboardStatsGrid } from '@/features/dashboard/components/DashboardStatsGrid'
import { RecentOrdersList } from '@/features/dashboard/components/RecentOrdersList'
import { RevenueOverviewCard } from '@/features/dashboard/components/RevenueOverviewCard'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'
import { getDashboardGreeting } from '@/features/dashboard/lib/greeting'
import { useAuth } from '@/features/auth/context/AuthContext'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { PageShell } from '@/shared/components/layout/PageShell'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle, Bell, Package } from 'lucide-react'

export function DashboardView() {
  const { user } = useAuth()
  const {
    stats,
    earnings,
    recentOrders,
    error,
    unreadCount,
    isInitialLoading,
    isRefreshing,
    updateRecentOrder,
  } = useDashboardData()

  if (isInitialLoading) {
    return <DashboardLoadingState />
  }

  const greeting = getDashboardGreeting(user?.first_name)

  return (
    <PageShell>
      <PageHeader
        title="Dashboard"
        description={`${greeting} — here's how your laundry is performing today.`}
        actions={[
          {
            label: unreadCount > 0 ? `Alerts (${unreadCount})` : 'Notifications',
            href: '/notifications',
            icon: <Bell className="w-4 h-4" />,
            variant: unreadCount > 0 ? 'default' : 'outline',
          },
          { label: 'All orders', href: '/orders', icon: <Package className="w-4 h-4" /> },
        ]}
      >
        {isRefreshing && (
          <span className="text-xs font-medium text-muted-foreground animate-pulse">
            Updating…
          </span>
        )}
      </PageHeader>

      {error && (
        <Alert variant="destructive" className="mb-8 surface-card border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <DashboardStatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <RevenueOverviewCard earnings={earnings} />
        <DashboardShortcutsCard />
      </div>

      <RecentOrdersList recentOrders={recentOrders} onOrderUpdated={updateRecentOrder} />
    </PageShell>
  )
}
