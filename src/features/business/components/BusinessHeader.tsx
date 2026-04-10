'use client'

import { Button } from '@/shared/ui/button'
import { Palmtree } from 'lucide-react'
import { Laundry } from '@/shared/interfaces'

interface BusinessHeaderProps {
  laundry: Laundry | null
  isTogglingVacation: boolean
  onVacationToggle: () => void
}

export function BusinessHeader({
  laundry,
  isTogglingVacation,
  onVacationToggle,
}: BusinessHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your laundry business profile</p>
      </div>
      {laundry && (
        <Button
          variant={laundry.vacation_mode ? 'default' : 'outline'}
          size="sm"
          onClick={onVacationToggle}
          disabled={isTogglingVacation}
        >
          <Palmtree className="mr-2 h-4 w-4" />
          {isTogglingVacation
            ? 'Updating…'
            : laundry.vacation_mode
              ? 'Vacation mode ON — turn off'
              : 'Enable vacation mode'}
        </Button>
      )}
    </div>
  )
}
