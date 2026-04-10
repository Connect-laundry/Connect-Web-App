import { Input } from '@/shared/ui/input'
import { Switch } from '@/shared/ui/switch'
import { Moon } from 'lucide-react'
import type { DayHours } from '../../types'

interface WorkingHoursStepProps {
  hours: DayHours[]
  updateDay: (day: number, patch: Partial<DayHours>) => void
}

export function WorkingHoursStep({ hours, updateDay }: WorkingHoursStepProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Toggle a day off if you’re closed, or set its open and close times.
      </p>
      {hours.map((d) => (
        <div
          key={d.day}
          className="flex items-center gap-3 rounded-lg border p-3 flex-wrap animate-fadeIn"
        >
          <div className="flex items-center gap-2 w-28">
            <Switch
              checked={!d.is_closed}
              onCheckedChange={(checked) =>
                updateDay(d.day, { is_closed: !checked })
              }
            />
            <span className="text-sm font-medium">{d.label}</span>
          </div>
          {d.is_closed ? (
            <span className="text-sm text-muted-foreground italic">Closed</span>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                type="time"
                value={d.opening_time}
                onChange={(e) => updateDay(d.day, { opening_time: e.target.value })}
                className="w-32"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <Input
                type="time"
                value={d.closing_time}
                onChange={(e) => updateDay(d.day, { closing_time: e.target.value })}
                className="w-32"
              />
              {!d.is_closed && d.closing_time < d.opening_time && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 text-xs px-2 py-0.5">
                  <Moon className="w-3 h-3" /> Overnight
                </span>
              )}
            </div>
          )}
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Closing earlier than opening (e.g. 20:00 → 02:00) is treated as overnight hours that cross midnight.
      </p>
    </div>
  )
}
