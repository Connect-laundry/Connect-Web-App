import type { DashboardEarnings, DashboardStats, Order, OrderListResponse } from '@/shared/interfaces'

export interface DashboardData {
  stats: DashboardStats | null
  earnings: DashboardEarnings | null
  recentOrders: OrderListResponse | null
  unreadCount: number
  error: string | null
}

export interface DashboardStatCardConfig {
  title: string
  subtitle: string
  statKey: keyof Pick<
    DashboardStats,
    'pending_count' | 'confirmed_count' | 'picked_up_count' | 'delivered_count'
  >
  totalOrdersLabel?: boolean
  color: 'amber' | 'blue' | 'indigo' | 'emerald'
  iconName: 'clock' | 'package' | 'trending' | 'check'
}

export type { Order }
