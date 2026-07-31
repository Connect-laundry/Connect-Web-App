import type { DashboardStatCardConfig } from '@/features/dashboard/types'

export const DASHBOARD_STAT_CARDS: DashboardStatCardConfig[] = [
  {
    title: 'Pending',
    subtitle: 'Awaiting acceptance',
    statKey: 'pending_count',
    color: 'amber',
    iconName: 'clock',
  },
  {
    title: 'Confirmed',
    subtitle: 'Accepted orders',
    statKey: 'confirmed_count',
    color: 'blue',
    iconName: 'package',
  },
  {
    title: 'Picked up',
    subtitle: 'At your shop',
    statKey: 'picked_up_count',
    color: 'indigo',
    iconName: 'trending',
  },
  {
    title: 'Delivered',
    subtitle: 'Delivered orders',
    statKey: 'delivered_count',
    totalOrdersLabel: true,
    color: 'emerald',
    iconName: 'check',
  },
]

export const DASHBOARD_POLL_INTERVAL_MS = 10_000
