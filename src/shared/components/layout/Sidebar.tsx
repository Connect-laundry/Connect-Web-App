'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/utils'
import {
  LayoutDashboard,
  Package,
  Store,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  WashingMachine,
  Bell,
} from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/shared/ui/button'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Business', href: '/business', icon: Store },
  { name: 'Machines', href: '/machines', icon: WashingMachine },
  { name: 'Earnings', href: '/earnings', icon: TrendingUp },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function NavLink({
  item,
  isActive,
}: {
  item: (typeof navigationItems)[0]
  isActive: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      prefetch
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
        isActive
          ? 'bg-primary text-primary-foreground shadow-glow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
      )}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-foreground/90"
          aria-hidden
        />
      )}
      <Icon
        className={cn(
          'w-[18px] h-[18px] shrink-0 transition-transform duration-200',
          !isActive && 'group-hover:scale-110',
        )}
      />
      <span>{item.name}</span>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join('') ||
    user?.email?.[0]?.toUpperCase() ||
    'O'

  return (
    <aside className="w-[260px] sidebar-glass h-full flex flex-col z-30 shrink-0">
      <div className="p-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow-sm transition-transform duration-300 group-hover:scale-105">
            <WashingMachine className="w-5 h-5 text-primary-foreground" />
            <div className="absolute -inset-0.5 rounded-2xl bg-primary/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none">
              Connect<span className="text-primary">.</span>
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
              Owner Hub
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-2">
            Overview
          </p>
          <nav className="space-y-0.5">
            {navigationItems.slice(0, 3).map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-2">
            Business
          </p>
          <nav className="space-y-0.5">
            {navigationItems.slice(3, 7).map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname.startsWith(item.href)}
              />
            ))}
          </nav>
        </div>

        <nav className="space-y-0.5 pt-1">
          {navigationItems.slice(7).map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 mt-auto border-t border-border/60 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/40">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          <span className="font-semibold text-sm">Sign Out</span>
        </Button>
      </div>
    </aside>
  )
}
