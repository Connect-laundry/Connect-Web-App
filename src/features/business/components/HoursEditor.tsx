'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Switch } from '@/shared/ui/switch'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Moon, Pencil, X } from 'lucide-react'
import type { Laundry, OperatingHour } from '@/shared/interfaces'
import { patchMyLaundry, copyMondayHours } from '../api'

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type DayDraft = {
  day: number
  is_closed: boolean
  opening_time: string // "HH:MM"
  closing_time: string
}

/** Backend times are "HH:MM:SS"; inputs want "HH:MM". */
const toInputTime = (t: string | null) => (t ? t.slice(0, 5) : '08:00')

function toDrafts(hours: OperatingHour[] | undefined): DayDraft[] {
  const byDay = new Map((hours ?? []).map((h) => [h.day, h]))
  return Array.from({ length: 7 }, (_, i) => {
    const day = i + 1
    const h = byDay.get(day)
    return {
      day,
      is_closed: h ? h.is_closed : true,
      opening_time: toInputTime(h?.opening_time ?? null),
      closing_time: h && !h.is_closed ? toInputTime(h.closing_time) : '18:00',
    }
  })
}

interface HoursEditorProps {
  laundry: Laundry
  onSaved: (updated: Laundry) => void
}

/**
 * Weekly operating hours: read-only list with an Edit toggle that switches to
 * inline per-day editing (PATCHes the full list to my-laundry/<id>/).
 */
export function HoursEditor({ laundry, onSaved }: HoursEditorProps) {
  const [editing, setEditing] = useState(false)
  const [drafts, setDrafts] = useState<DayDraft[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startEditing = () => {
    setDrafts(toDrafts(laundry.operating_hours))
    setError(null)
    setEditing(true)
  }

  const updateDay = (day: number, patch: Partial<DayDraft>) =>
    setDrafts((prev) => prev.map((d) => (d.day === day ? { ...d, ...patch } : d)))

  const save = async () => {
    for (const d of drafts) {
      if (!d.is_closed && d.opening_time === d.closing_time) {
        return setError(
          `${DAY_NAMES[d.day]}: opening and closing time can't be the same.`,
        )
      }
    }

    setIsSaving(true)
    setError(null)
    try {
      const operating_hours = drafts.map((d) => ({
        day: d.day,
        is_closed: d.is_closed,
        opening_time: d.is_closed ? '00:00' : d.opening_time,
        closing_time: d.is_closed ? '00:00' : d.closing_time,
        // Crosses midnight when the close time is earlier than the open time.
        is_overnight: !d.is_closed && d.closing_time < d.opening_time,
      }))
      const updated = await patchMyLaundry(laundry.id, { operating_hours })
      onSaved(updated)
      setEditing(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to save hours. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // ------------------------------------------------------------- read mode
  if (!editing) {
    const hours = laundry.operating_hours ?? []
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                const updated = await copyMondayHours()
                onSaved(updated)
              } catch (err: any) {
                setError(err?.message || 'Could not copy Monday hours.')
              }
            }}
          >
            Copy Mon → weekdays
          </Button>
          <Button variant="outline" size="sm" onClick={startEditing}>
            <Pencil className="mr-2 h-4 w-4" /> Edit hours
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {hours.length > 0 ? (
          <div className="divide-y">
            {[...hours]
              .sort((a, b) => a.day - b.day)
              .map((h) => (
                <div key={h.day} className="flex items-center justify-between py-3">
                  <span className="font-medium">{DAY_NAMES[h.day] || `Day ${h.day}`}</span>
                  {h.is_closed ? (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  ) : (
                    <span className="text-sm">
                      {toInputTime(h.opening_time)} – {toInputTime(h.closing_time)}
                      {h.is_overnight && (
                        <span className="ml-2 text-xs text-muted-foreground">(overnight)</span>
                      )}
                    </span>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No operating hours configured. Click “Edit hours” to set them.
          </p>
        )}
      </div>
    )
  }

  // ------------------------------------------------------------- edit mode
  return (
    <div className="w-full space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {drafts.map((d) => (
        <div key={d.day} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
          <div className="flex w-32 items-center gap-2">
            <Switch
              checked={!d.is_closed}
              onCheckedChange={(checked) => updateDay(d.day, { is_closed: !checked })}
              disabled={isSaving}
            />
            <span className="text-sm font-medium">{DAY_NAMES[d.day]}</span>
          </div>
          {d.is_closed ? (
            <span className="text-sm italic text-muted-foreground">Closed</span>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="time"
                value={d.opening_time}
                onChange={(e) => updateDay(d.day, { opening_time: e.target.value })}
                className="w-32"
                disabled={isSaving}
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="time"
                value={d.closing_time}
                onChange={(e) => updateDay(d.day, { closing_time: e.target.value })}
                className="w-32"
                disabled={isSaving}
              />
              {d.closing_time < d.opening_time && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                  <Moon className="h-3 w-3" /> Overnight
                </span>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditing(false)} disabled={isSaving}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button size="sm" onClick={save} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save hours'}
        </Button>
      </div>
    </div>
  )
}
