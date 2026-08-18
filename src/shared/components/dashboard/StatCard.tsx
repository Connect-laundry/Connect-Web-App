'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import type { LucideIcon } from 'lucide-react'

export type StatCardColor = 'blue' | 'indigo' | 'amber' | 'emerald' | 'teal'

const styles: Record<
  StatCardColor,
  { icon: string; accent: string; glow: string }
> = {
  blue: {
    icon: 'bg-primary/12 text-primary border-primary/20',
    accent: 'from-primary/80 via-primary/40 to-transparent',
    glow: 'shadow-[0_8px_30px_-8px_oklch(0.42_0.15_260/0.35)]',
  },
  indigo: {
    icon: 'bg-indigo-500/12 text-indigo-600 border-indigo-500/20',
    accent: 'from-indigo-500/80 via-indigo-400/30 to-transparent',
    glow: 'shadow-[0_8px_30px_-8px_rgba(99,102,241,0.35)]',
  },
  amber: {
    icon: 'bg-amber-500/12 text-amber-700 border-amber-500/20',
    accent: 'from-amber-500/80 via-amber-400/30 to-transparent',
    glow: 'shadow-[0_8px_30px_-8px_rgba(245,158,11,0.35)]',
  },
  emerald: {
    icon: 'bg-emerald-500/12 text-emerald-700 border-emerald-500/20',
    accent: 'from-emerald-500/80 via-emerald-400/30 to-transparent',
    glow: 'shadow-[0_8px_30px_-8px_rgba(16,185,129,0.35)]',
  },
  teal: {
    icon: 'bg-teal-500/12 text-teal-700 border-teal-500/20',
    accent: 'from-teal-500/80 via-teal-400/30 to-transparent',
    glow: 'shadow-[0_8px_30px_-8px_rgba(20,184,166,0.35)]',
  },
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  color: StatCardColor
  index?: number
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  index = 0,
}: StatCardProps) => {
  const s = styles[color]

  return (
    <AnimateOnScroll animation="slide-up" delay={index * 80}>
      <Card
        className={cn(
          'surface-card group overflow-hidden border-0 py-0 gap-0 transition-all duration-300 hover:-translate-y-0.5',
          s.glow,
        )}
      >
        <div
          className={cn('h-1 w-full bg-linear-to-r', s.accent)}
          aria-hidden
        />
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={cn(
              'p-2.5 rounded-xl border transition-transform duration-300 group-hover:scale-110',
              s.icon,
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
          <div className="text-3xl md:text-4xl font-black tracking-tight tabular-nums">
            {value}
          </div>
          <p className="text-[11px] font-semibold text-muted-foreground/80 mt-1.5">
            {subtitle}
          </p>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
