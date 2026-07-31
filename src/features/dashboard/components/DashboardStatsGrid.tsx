'use client'

import { Clock, TrendingUp, Package, CheckCircle } from 'lucide-react'
import { StatCard } from './StatCard'

interface DashboardStatsGridProps {
  pendingCount: number
  inProcessCount: number
  readyCount: number
  dailyRevenue: number
}

export function DashboardStatsGrid({
  pendingCount,
  inProcessCount,
  readyCount,
  dailyRevenue,
}: DashboardStatsGridProps) {
  const formattedDailyRevenue = `GH₵${dailyRevenue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="New Orders"
        value={pendingCount}
        subtitle="Pending approval"
        icon={Clock}
        color="blue"
        index={0}
      />
      <StatCard
        title="In Processing"
        value={inProcessCount}
        subtitle="Actively washing/drying"
        icon={TrendingUp}
        color="indigo"
        index={1}
      />
      <StatCard
        title="Ready For Delivery"
        value={readyCount}
        subtitle="Awaiting dispatch"
        icon={Package}
        color="amber"
        index={2}
      />
      <StatCard
        title="Daily Revenue"
        value={formattedDailyRevenue}
        subtitle="From active & completed jobs"
        icon={CheckCircle}
        color="emerald"
        index={3}
      />
    </div>
  )
}
