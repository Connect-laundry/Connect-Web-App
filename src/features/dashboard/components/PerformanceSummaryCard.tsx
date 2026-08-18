'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { MoreHorizontal, TrendingUp, ArrowUpRight } from 'lucide-react'

interface PerformanceSummaryCardProps {
  totalRevenue: number
  weeklyRevenue: number
  monthlyRevenue: number
}

export const PerformanceSummaryCard = ({
  totalRevenue,
  weeklyRevenue,
  monthlyRevenue,
}: PerformanceSummaryCardProps) => {
  const formatCurrency = (val: number) =>
    `GH₵${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  return (
    <AnimateOnScroll animation="slide-up" delay={400} className="lg:col-span-2">
      <Card className="h-full border-border/50 shadow-sm overflow-hidden group">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
          <div>
            <CardTitle className="text-lg font-bold">Performance Summary</CardTitle>
            <CardDescription className="text-xs uppercase tracking-wider font-bold text-muted-foreground/60 mt-0.5">
              Financial Metrics
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex flex-col p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  Total Balance
                </span>
                <span className="text-3xl font-black">{formatCurrency(totalRevenue)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Weekly
                  </span>
                  <span className="text-lg font-bold">{formatCurrency(weeklyRevenue)}</span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                    <ArrowUpRight className="w-2.5 h-2.5" />
                    <span>14.5%</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Monthly
                  </span>
                  <span className="text-lg font-bold">{formatCurrency(monthlyRevenue)}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl flex flex-col items-center justify-center p-8 border border-dashed border-border group-hover:bg-muted/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-center mb-1">Revenue Tracking</p>
              <p className="text-xs text-muted-foreground text-center px-4 font-medium">
                Real-time stats sync automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
