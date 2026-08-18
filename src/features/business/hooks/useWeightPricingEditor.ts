import { useState } from 'react'
import type { WeightPricing } from '@/shared/types'
import { upsertWeightPricing } from '../api'
import {
  buildWeightPricingPayload,
  toDraft,
  validateWeightDraft,
  type Draft,
} from '../lib/weight-pricing'

export function useWeightPricingEditor(
  pricing: WeightPricing | null,
  onSaved: (updated: WeightPricing) => void,
) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(pricing))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (patch: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...patch }))

  const startEditing = () => {
    setDraft(toDraft(pricing))
    setError(null)
    setEditing(true)
  }

  const save = async () => {
    const validationError = validateWeightDraft(draft)
    if (validationError) return setError(validationError)

    setIsSaving(true)
    setError(null)
    try {
      const updated = await upsertWeightPricing(buildWeightPricingPayload(draft))
      onSaved(updated)
      setEditing(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to save weight pricing. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return { editing, setEditing, draft, set, isSaving, error, startEditing, save }
}
