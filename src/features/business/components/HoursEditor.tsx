'use client'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Switch } from '@/shared/ui/switch'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Moon, Pencil, X } from 'lucide-react'
import type { Laundry } from '@/shared/types'
import { useHoursEditor } from '../hooks/useHoursEditor'
import { DAY_NAMES, toInputTime } from '../lib/hours'

interface HoursEditorProps {
  laundry: Laundry
  onSaved: (updated: Laundry) => void
}

/**
 * Weekly operating hours: read-only list with an Edit toggle that switches to
 * inline per-day editing (PATCHes the full list to my-laundry/<id>/).
 */
export const HoursEditor = ({ laundry, onSaved }: HoursEditorProps) => {
  const editor = useHoursEditor(laundry, onSaved)

  // ------------------------------------------------------------- read mode
  if (!editor.editing) {
    const hours = laundry.operating_hours ?? []
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={editor.copyMonday}
          >
            Copy Mon → weekdays
          </Button>
          <Button variant="outline" size="sm" onClick={editor.startEditing}>
            <Pencil className="mr-2 h-4 w-4" /> Edit hours
          </Button>
        </div>
        {editor.error && (
          <Alert variant="destructive">
            <AlertDescription>{editor.error}</AlertDescription>
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
      {editor.error && (
        <Alert variant="destructive">
          <AlertDescription>{editor.error}</AlertDescription>
        </Alert>
      )}

      {editor.drafts.map((d) => (
        <div key={d.day} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
          <div className="flex w-32 items-center gap-2">
            <Switch
              checked={!d.is_closed}
              onCheckedChange={(checked) => editor.updateDay(d.day, { is_closed: !checked })}
              disabled={editor.isSaving}
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
                onChange={(e) => editor.updateDay(d.day, { opening_time: e.target.value })}
                className="w-32"
                disabled={editor.isSaving}
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="time"
                value={d.closing_time}
                onChange={(e) => editor.updateDay(d.day, { closing_time: e.target.value })}
                className="w-32"
                disabled={editor.isSaving}
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
        <Button variant="outline" size="sm" onClick={() => editor.setEditing(false)} disabled={editor.isSaving}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button size="sm" onClick={editor.save} disabled={editor.isSaving}>
          {editor.isSaving ? 'Saving…' : 'Save hours'}
        </Button>
      </div>
    </div>
  )
}
