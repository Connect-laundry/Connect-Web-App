'use client'

import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Truck, UserPlus } from 'lucide-react'

interface StaffGuidanceBannerProps {
  onAssignClick: () => void
}

export function StaffGuidanceBanner({ onAssignClick }: StaffGuidanceBannerProps) {
  return (
    <Card className="border-primary/20 bg-primary/5 shadow-xs overflow-hidden">
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
            <Truck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              How Driver & Dispatch Management Works
            </h3>
            <p className="text-xs text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Driver accounts (<code className="px-1 py-0.5 rounded bg-muted text-[10px]">role: DRIVER</code>) receive dispatched orders for pickup and final delivery. Assign an order using the driver&apos;s email address or account UUID below to delegate dispatch.
            </p>
          </div>
        </div>
        <Button 
          onClick={onAssignClick}
          className="gap-2 font-bold shadow-md h-9 text-xs shrink-0 bg-primary hover:bg-primary/90"
        >
          <UserPlus className="w-4 h-4" />
          Assign Driver Now
        </Button>
      </CardContent>
    </Card>
  )
}
