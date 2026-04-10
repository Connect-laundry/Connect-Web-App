'use client'

import { Button } from '@/shared/ui/button'
import { RefreshCw, UserPlus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface StaffHeaderProps {
  loading: boolean
  onRefresh: () => void
  onOpenModal: () => void
}

export function StaffHeader({ loading, onRefresh, onOpenModal }: StaffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Delivery & Staff Operations
        </h1>
        <p className="text-muted-foreground mt-1 font-medium text-sm">
          Manage driver dispatches, order assignments, and active courier tasks.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="gap-2 font-bold h-10 border-border/50"
        >
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          Refresh
        </Button>

        <Button
          onClick={onOpenModal}
          className="gap-2 font-bold shadow-md h-10 bg-primary hover:bg-primary/90"
        >
          <UserPlus className="w-4 h-4" />
          Assign Driver to Order
        </Button>
      </div>
    </div>
  )
}
