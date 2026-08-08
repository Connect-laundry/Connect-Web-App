'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/utils'
import { SimameLogo } from '@/shared/components/branding/SimameLogo'
import {
  LayoutDashboard,
  Package,
  Store,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
} from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/shared/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/tooltip'

const navigationItems = [
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

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

interface SidebarContentProps {
  pathname: string
  logout: () => void
  collapsed?: boolean
  isMobile?: boolean
  onLinkClick?: () => void
  onToggleCollapse?: () => void
  onMobileClose?: () => void
}

function SidebarContent({
  pathname,
  logout,
  collapsed = false,
  isMobile = false,
  onLinkClick,
  onToggleCollapse,
  onMobileClose,
}: SidebarContentProps) {
  const overviewItems = navigationItems.filter((i) => i.section === 'overview')
  const businessItems = navigationItems.filter((i) => i.section === 'business')
  const systemItems = navigationItems.filter((i) => i.section === 'system')

  const renderNavGroup = (
    title: string,
    items: typeof navigationItems
  ) => (
    <div className="mb-4">
      {!collapsed && (
        <p className="px-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-2 transition-all">
          {title}
        </p>
      )}
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/dashboard'
              ? pathname === item.href
              : pathname.startsWith(item.href)

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'group flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-2.5',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform duration-300',
                  !isActive && 'group-hover:scale-110'
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            )
          }

          return linkContent
        })}
      </nav>
    </div>
  )

  return (
    <div className="h-full flex flex-col justify-between bg-background">
      {/* Brand Header */}
      <div className={cn('p-5 border-b border-border/50 flex items-center justify-between')}>
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-3 group overflow-hidden"
        >
          <SimameLogo variant={collapsed ? 'icon' : 'lockup'} className="group-hover:scale-[1.02] transition-transform duration-300" />
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="sr-only">SIMAME Management</span>
            </div>
          )}
        </Link>

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground md:hidden"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        {renderNavGroup('Overview', overviewItems)}
        {renderNavGroup('Business', businessItems)}
        {renderNavGroup('System', systemItems)}
      </div>

      {/* Footer Controls & User Sign Out */}
      <div className="p-3 border-t border-border/50 space-y-2">
        {!isMobile && onToggleCollapse && (
          <Button
            variant="ghost"
            onClick={onToggleCollapse}
            className={cn(
              'w-full text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl transition-all',
              collapsed ? 'p-2 justify-center' : 'justify-between px-3 py-2'
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {!collapsed && <span className="text-xs font-semibold">Collapse Menu</span>}
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        )}

        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center p-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all group"
                onClick={logout}
              >
                <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-semibold text-destructive">
              Sign Out
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all group"
            onClick={logout}
          >
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-destructive/20 transition-colors shrink-0">
              <LogOut className="w-3.5 h-3.5 group-hover:text-destructive" />
            </div>
            <span className="font-semibold text-sm truncate">Sign Out</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <>
      {/* Desktop Sidebar (MD and larger screens) */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-background border-r border-border h-full transition-all duration-300 ease-in-out shrink-0 z-30',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent
          pathname={pathname}
          logout={logout}
          collapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>

      {/* Mobile Sidebar Sheet Drawer (< MD screens) */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent
          side="left"
          className="p-0 w-72 max-w-[85vw] border-r border-border bg-background [&>button]:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Access management sections and links</SheetDescription>
          </SheetHeader>
          <SidebarContent
            pathname={pathname}
            logout={logout}
            isMobile
            onLinkClick={onMobileClose}
            onMobileClose={onMobileClose}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
