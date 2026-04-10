'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Users, Truck, CheckCircle2 } from 'lucide-react'

interface StaffStatsCardProps {
  driverCount: number
  activeCount: number
  completedCount: number
}

export function StaffStatsCard({
  driverCount,
  activeCount,
  completedCount,
}: StaffStatsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Assigned Drivers
          </CardTitle>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Users className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black">{driverCount}</div>
          <p className="text-xs font-semibold text-muted-foreground mt-1">Active registered couriers</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Active Dispatches
          </CardTitle>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Truck className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black">{activeCount}</div>
          <p className="text-xs font-semibold text-muted-foreground mt-1">In progress or pending pickup</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Completed Tasks
          </CardTitle>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black">{completedCount}</div>
          <p className="text-xs font-semibold text-muted-foreground mt-1">Successfully delivered</p>
        </CardContent>
      </Card>
    </div>
  )
}
