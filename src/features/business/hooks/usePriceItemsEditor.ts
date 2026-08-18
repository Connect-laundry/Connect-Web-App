import { useState } from 'react'
import type { PricingItem } from '@/shared/types'
import { createPricingItem, updatePricingItem, deletePricingItem } from '../api'
import {
  buildPriceItemPayload,
  emptyDraft,
  nonEmptyDrafts,
  toDraft,
  validatePriceDrafts,
  type ItemDraft,
} from '../lib/price-items'

export function usePriceItemsEditor(items: PricingItem[], onSaved: (items: PricingItem[]) => void) {
  const [editing, setEditing] = useState(false)
  const [drafts, setDrafts] = useState<ItemDraft[]>([])
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startEditing = () => {
    setDrafts(items.map(toDraft))
    setDeletedIds([])
    setError(null)
    setEditing(true)
  }

  const update = (index: number, patch: Partial<ItemDraft>) =>
    setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)))

  const addRow = () => setDrafts((prev) => [...prev, emptyDraft(prev.length)])

  const removeRow = (index: number) => {
    const row = drafts[index]
    if (row.id) setDeletedIds((prev) => [...prev, row.id!])
    setDrafts((prev) => prev.filter((_, i) => i !== index))
  }

  const save = async () => {
    const nonEmpty = nonEmptyDrafts(drafts)
    const validationError = validatePriceDrafts(nonEmpty)
    if (validationError) return setError(validationError)

    setIsSaving(true)
    setError(null)
    try {
      for (const id of deletedIds) await deletePricingItem(id)
      const saved: PricingItem[] = []
      for (let i = 0; i < nonEmpty.length; i++) {
        const payload = buildPriceItemPayload(nonEmpty[i], i)
        saved.push(
          nonEmpty[i].id
            ? await updatePricingItem(nonEmpty[i].id!, payload)
            : await createPricingItem(payload),
        )
      }
      onSaved(saved)
      setEditing(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to save the price list. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    editing,
    setEditing,
    drafts,
    isSaving,
    error,
    startEditing,
    update,
    addRow,
    removeRow,
    save,
  }
}
