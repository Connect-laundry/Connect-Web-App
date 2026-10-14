import { useEffect, useState } from 'react'
import type { PricingItem } from '@/shared/types'
import {
  createBasketDefinition,
  createPricingItem,
  deletePricingItem,
  getBasketDefinitions,
  updateBasketDefinition,
  updatePricingItem,
} from '../api'
import { unifiedPricingEnabled, type BasketDefinition } from '../lib/unified-pricing'
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
  const [baskets, setBaskets] = useState<BasketDefinition[]>([])

  useEffect(() => {
    if (!unifiedPricingEnabled || !editing) return
    let cancelled = false
    getBasketDefinitions()
      .then((loaded) => {
        if (!cancelled) setBaskets(loaded)
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load basket definitions. You can still create a new basket while editing.')
      })
    return () => {
      cancelled = true
    }
  }, [editing])

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
      for (const id of deletedIds) {
        await deletePricingItem(id)
        setDeletedIds((previous) => previous.filter((value) => value !== id))
      }
      const saved: PricingItem[] = []
      for (let i = 0; i < nonEmpty.length; i++) {
        const draft = nonEmpty[i]
        let basketId = draft.basket ?? null
        if (draft.pricing_basis === 'PER_BASKET' && draft.basket_draft) {
          const { id, ...basketData } = draft.basket_draft
          const savedBasket = id
            ? await updateBasketDefinition(id, basketData)
            : await createBasketDefinition(basketData)
          basketId = savedBasket.id ?? null
          draft.basket = basketId
          draft.basket_details = savedBasket
          draft.basket_draft = undefined
          setDrafts([...nonEmpty])
        }
        const payload = {
          ...buildPriceItemPayload(draft, i),
          basket: draft.pricing_basis === 'PER_BASKET' ? basketId : null,
        }
        const previous = items.find((item) => item.id === draft.id)
        if (previous && Object.entries(payload).every(([key, value]) => JSON.stringify(previous[key as keyof PricingItem]) === JSON.stringify(value))) {
          saved.push(previous)
          continue
        }
        saved.push(
          draft.id
            ? await updatePricingItem(draft.id, payload)
            : await createPricingItem(payload),
        )
        draft.id = saved[saved.length - 1].id
        setDrafts([...nonEmpty])
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
    baskets,
  }
}
