'use client'

import { ComponentType } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: ComponentType<{ className?: string }>
  color: 'blue' | 'indigo' | 'amber' | 'emerald'
  trend?: string
  trendIsUp?: boolean
  index: number
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  trendIsUp,
  index,
}: StatCardProps) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400',
  }

  return (
    <AnimateOnScroll animation="slide-up" delay={index * 100}>
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative">
        <div
          className={cn(
            'absolute top-0 right-0 w-24 h-24 -translate-y-12 translate-x-12 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500',
            color === 'blue'
              ? 'bg-blue-500'
              : color === 'indigo'
              ? 'bg-indigo-500'
              : color === 'amber'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          )}
        />

        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn('p-2 rounded-xl transition-transform group-hover:scale-110 duration-300', colorMap[color])}>
            <Icon className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-black tracking-tight">{value}</div>
              <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-tighter mt-1">
                {subtitle}
              </p>
            </div>
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-black',
                  trendIsUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                )}
              >
                {trendIsUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5 rotate-180" />}
                {trend}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
