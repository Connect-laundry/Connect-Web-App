'use client'

import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

interface PageHeaderAction {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
}

interface PageHeaderProps {
  title: string
  description?: string
  badge?: React.ReactNode
  actions?: PageHeaderAction[]
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 mb-8 md:mb-10 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="space-y-2">
        {badge}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gradient-brand">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {actions?.map((action) =>
          action.href ? (
            <Link key={action.label} href={action.href}>
              <Button variant={action.variant ?? 'default'} size="sm" className="gap-2 shadow-glow-sm">
                {action.icon}
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button
              key={action.label}
              variant={action.variant ?? 'default'}
              size="sm"
              className="gap-2"
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          ),
        )}
        {children}
      </div>
    </div>
  )
}
