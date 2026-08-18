import { useState } from 'react'
import type { Laundry } from '@/shared/types'
import { copyMondayHours, patchMyLaundry } from '../api'
import { buildOperatingHours, toHoursDrafts, validateHoursDrafts, type DayDraft } from '../lib/hours'

export function useHoursEditor(laundry: Laundry, onSaved: (updated: Laundry) => void) {
  const [editing, setEditing] = useState(false)
  const [drafts, setDrafts] = useState<DayDraft[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startEditing = () => { setDrafts(toHoursDrafts(laundry.operating_hours)); setError(null); setEditing(true) }
  const updateDay = (day: number, patch: Partial<DayDraft>) => setDrafts((previous) => previous.map((draft) => draft.day === day ? { ...draft, ...patch } : draft))
  const save = async () => {
    const validationError = validateHoursDrafts(drafts)
    if (validationError) return setError(validationError)
    setIsSaving(true); setError(null)
    try {
      onSaved(await patchMyLaundry(laundry.id, { operating_hours: buildOperatingHours(drafts) }))
      setEditing(false)
    } catch (error: unknown) { setError(error instanceof Error ? error.message : 'Failed to save hours. Please try again.') }
    finally { setIsSaving(false) }
  }
  const copyMonday = async () => {
    try { onSaved(await copyMondayHours()) }
    catch (error: unknown) { setError(error instanceof Error ? error.message : 'Could not copy Monday hours.') }
  }
  return { editing, setEditing, drafts, isSaving, error, startEditing, updateDay, save, copyMonday }
}
