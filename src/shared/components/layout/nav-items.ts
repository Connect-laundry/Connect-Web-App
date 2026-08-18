import {
  LayoutDashboard,
  Package,
  Store,
  TrendingUp,
  Users,
  Settings,
  Bell,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  section: string
}

export const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    section: 'overview',
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: Package,
    section: 'overview',
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    section: 'overview',
  },
  {
    name: 'Business',
    href: '/business',
    icon: Store,
    section: 'business',
  },
  {
    name: 'Earnings',
    href: '/earnings',
    icon: TrendingUp,
    section: 'business',
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: Users,
    section: 'business',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    section: 'system',
  },
]
