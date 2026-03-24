'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Store,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  WashingMachine,
} from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { Button } from '@/components/ui/button'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: Package,
  },
  {
    name: 'Business',
    href: '/business',
    icon: Store,
  },
  {
    name: 'Earnings',
    href: '/earnings',
    icon: TrendingUp,
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-background border-r border-border h-full flex flex-col z-30 relative">
      {/* Brand Header */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-105">
            <WashingMachine className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none">
              Connect<span className="text-primary font-black">.</span>
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Management
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-4 py-2 space-y-6 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-4 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-3">
            Overview
          </p>
          <nav className="space-y-1">
            {navigationItems.slice(0, 2).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  <Icon className={cn('w-4.5 h-4.5 transition-transform duration-300', !isActive && 'group-hover:scale-110')} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          <p className="px-4 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-3">
            Business
          </p>
          <nav className="space-y-1">
            {navigationItems.slice(2, 5).map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  <Icon className={cn('w-4.5 h-4.5 transition-transform duration-300', !isActive && 'group-hover:scale-110')} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="pt-2">
          <nav className="space-y-1">
            {navigationItems.slice(5).map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  <Icon className={cn('w-4.5 h-4.5 transition-transform duration-300', !isActive && 'group-hover:scale-110')} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-4 py-6 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group"
          onClick={logout}
        >
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
            <LogOut className="w-4 h-4 group-hover:text-destructive" />
          </div>
          <span className="font-semibold text-sm">Sign Out</span>
        </Button>
      </div>
    </aside>
  )
}
