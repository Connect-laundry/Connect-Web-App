import { DASHBOARD_STAT_CARDS } from '@/features/dashboard/constants/stat-cards'
import { StatCard } from '@/shared/components/dashboard/StatCard'
import type { DashboardStats } from '@/shared/types'
import { CheckCircle, Clock, Package, TrendingUp, type LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  package: Package,
  trending: TrendingUp,
  check: CheckCircle,
}

interface DashboardStatsGridProps {
  stats: DashboardStats | null
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {DASHBOARD_STAT_CARDS.map((card, index) => {
        const Icon = ICONS[card.iconName]
        const value = stats?.[card.statKey] ?? 0
        const subtitle = card.totalOrdersLabel
          ? `${stats?.total_orders ?? 0} total orders`
          : card.subtitle

        return (
          <StatCard
            key={card.statKey}
            title={card.title}
            value={value}
            subtitle={subtitle}
            icon={Icon}
            color={card.color}
            index={index}
          />
        )
      })}
    </div>
  )
}
