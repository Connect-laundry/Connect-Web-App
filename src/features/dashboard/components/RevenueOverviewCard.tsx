import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { formatCurrency } from '@/shared/lib/format'
import type { DashboardEarnings } from '@/shared/types'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'

interface RevenueOverviewCardProps {
  earnings: DashboardEarnings | null
}

export function RevenueOverviewCard({ earnings }: RevenueOverviewCardProps) {
  return (
    <AnimateOnScroll animation="slide-up" delay={200} className="lg:col-span-2">
      <Card className="surface-card border-0 py-0 gap-0 overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-accent to-primary/30" aria-hidden />
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-xl font-black">Revenue overview</CardTitle>
          <CardDescription>From completed & delivered orders</CardDescription>
        </CardHeader>
        <CardContent className="pb-6 grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl p-5 bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">Today</p>
            <p className="text-3xl font-black tabular-nums">{formatCurrency(earnings?.today)}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-border/50 pb-3">
              <span className="text-xs font-semibold text-muted-foreground">This week</span>
              <span className="text-lg font-black tabular-nums">{formatCurrency(earnings?.this_week)}</span>
            </div>
            <div className="flex justify-between items-end border-b border-border/50 pb-3">
              <span className="text-xs font-semibold text-muted-foreground">This month</span>
              <span className="text-lg font-black tabular-nums">{formatCurrency(earnings?.this_month)}</span>
            </div>
            <div className="flex justify-between items-end pt-1">
              <span className="text-xs font-bold text-foreground">All time</span>
              <span className="text-xl font-black text-primary tabular-nums">
                {formatCurrency(earnings?.total_revenue)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
