import { useState } from 'react'
import type { Laundry } from '@/shared/types'
import { patchMyLaundry } from '../api'
import {
  buildProfilePayload,
  toProfileDraft,
  validateProfileDraft,
  type ProfileDraft,
} from '../lib/profile-edit'

export function useProfileEditor(laundry: Laundry, onSaved: (updated: Laundry) => void) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ProfileDraft>(() => toProfileDraft(laundry))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDraft = (patch: Partial<ProfileDraft>) => setDraft((previous) => ({ ...previous, ...patch }))
  const openEditor = () => {
    setDraft(toProfileDraft(laundry))
    setError(null)
    setOpen(true)
  }

  const save = async () => {
    const validationError = validateProfileDraft(draft)
    if (validationError) return setError(validationError)

    setIsSaving(true)
    setError(null)
    try {
      const updated = await patchMyLaundry(laundry.id, buildProfilePayload(draft))
      onSaved(updated)
      setOpen(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return { open, setOpen, draft, updateDraft, isSaving, error, openEditor, save }
}
