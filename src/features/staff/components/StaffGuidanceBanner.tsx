'use client'

import { Card, CardContent } from '@/shared/ui/card'
import { Truck } from 'lucide-react'

export const StaffGuidanceBanner = () => {
  return (
    <Card className="border-primary/20 bg-primary/5 shadow-xs overflow-hidden">
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
            <Truck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              How Driver & Dispatch Management Works
            </h3>
            <p className="text-xs text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Driver accounts (<code className="px-1 py-0.5 rounded bg-muted text-[10px]">role: DRIVER</code>) receive dispatched orders for pickup and final delivery. Create the courier&apos;s login with <strong>Create Driver</strong>, then use <strong>Assign Driver to Order</strong> to delegate pickup or delivery work.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
