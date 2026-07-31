'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Spinner } from '@/shared/ui/spinner'
import { Search, Truck, Trash2 } from 'lucide-react'
import { formatDate } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { type DeliveryAssignment } from '@/features/logistics/api'

interface StaffTableProps {
  loading: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  assignments: DeliveryAssignment[]
  onDeleteAssignment: (id: string) => void
}

export function StaffTable({
  loading,
  searchQuery,
  onSearchChange,
  assignments,
  onDeleteAssignment,
}: StaffTableProps) {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 border-b border-border/40 pb-4">
        <div>
          <CardTitle className="text-lg font-bold">Delivery Assignments</CardTitle>
          <CardDescription className="text-xs">
            Live driver tasks synchronized via backend logistics service.
          </CardDescription>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 text-xs font-medium bg-background border-border/50"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spinner className="w-8 h-8 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground animate-pulse">
              Fetching driver assignments...
            </p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center p-6 gap-3">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Truck className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No delivery assignments found
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Assign drivers to active orders using the button above to manage couriers and track deliveries.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-muted/20 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        Order #{assignment.order.slice(0, 8)}…
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-primary/20 bg-primary/5 text-primary"
                      >
                        {assignment.assignment_type || 'BOTH'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                      <span>
                        Driver:{' '}
                        <strong className="text-foreground">
                          {assignment.driverEmail || assignment.driver}
                        </strong>
                      </span>
                      {assignment.assigned_at && (
                        <>
                          <span>•</span>
                          <span>{formatDate(assignment.assigned_at)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'px-3 py-1 text-[10px] font-bold uppercase tracking-wider border-none',
                      assignment.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-500/10 text-amber-600'
                    )}
                  >
                    {assignment.status}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteAssignment(assignment.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    title="Remove Assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
