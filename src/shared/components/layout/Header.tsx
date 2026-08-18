'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
  Building2,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  mobileOpen?: boolean
  setMobileOpen: (open: boolean | ((prev: boolean) => boolean)) => void
}

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Overview of your laundry operations',
  },
  '/orders': {
    title: 'Orders Management',
    description: 'Manage and track customer orders',
  },
  '/business': {
    title: 'Business Profile',
    description: 'Manage store details and services',
  },
  '/earnings': {
    title: 'Financials & Earnings',
    description: 'Track revenue, payouts and sales',
  },
  '/staff': {
    title: 'Staff Management',
    description: 'Manage employees and permissions',
  },
  '/settings': {
    title: 'Settings',
    description: 'Account and system preferences',
  },
}

export const Header = ({
  sidebarOpen,
  setSidebarOpen,
  setMobileOpen,
}: HeaderProps) => {
  const pathname = usePathname()
  const { user, laundry, logout } = useAuth()

  // Match current path to page title
  const currentTitleInfo = pageTitles[pathname] || {
    title: 'Management Portal',
    description: 'SIMAME Laundry Operations',
  }

  const userInitial = user?.first_name ? user.first_name[0].toUpperCase() : 'U'
  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : 'Account'
  const laundryName = laundry?.name || 'Laundry Business'

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b border-border bg-background/95 backdrop-blur-md transition-all">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left Section: Toggles & Page Info */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Trigger (< 768px) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop Sidebar Toggle (>= 768px) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            aria-label="Toggle desktop sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>

          {/* Page Title & Subtitle */}
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-1">
              {currentTitleInfo.title}
            </h1>
            <p className="hidden sm:block text-xs text-muted-foreground font-medium line-clamp-1">
              {currentTitleInfo.description}
            </p>
          </div>
        </div>

        {/* Right Section: Store Badge & Profile Dropdown */}
        <div className="flex items-center gap-3">
          {/* Business/Laundry Name Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Building2 className="w-3.5 h-3.5" />
            <span className="max-w-[150px] truncate">{laundryName}</span>
          </div>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 px-2 rounded-full flex items-center gap-2 hover:bg-accent focus:outline-none"
              >
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-xs font-semibold max-w-[120px] truncate text-foreground">
                  {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email || 'Authenticated User'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/business" className="cursor-pointer flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{laundryName}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
