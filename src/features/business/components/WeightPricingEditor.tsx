'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Pencil, X } from 'lucide-react'
import { WeightPricing } from '@/shared/interfaces'
import { upsertWeightPricing } from '../api'

interface WeightPricingEditorProps {
  pricing: WeightPricing | null
  onSaved: (updated: WeightPricing) => void
}

type Draft = {
  base_price_per_kg: string
  minimum_charge: string
  minimum_order_weight_kg: string
}

function toDraft(p: WeightPricing | null): Draft {
  return {
    base_price_per_kg: p?.base_price_per_kg ?? '',
    minimum_charge: p?.minimum_charge ?? '0',
    minimum_order_weight_kg: p?.minimum_order_weight_kg ?? '',
  }
}

/**
 * Read-only weight tariff panel with an inline edit mode. PATCHes the
 * weight-pricing singleton (creates it if the owner has none yet).
 */
export function WeightPricingEditor({ pricing, onSaved }: WeightPricingEditorProps) {
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
    if (!draft.base_price_per_kg || Number(draft.base_price_per_kg) <= 0) {
      return setError('Enter a price per kg greater than 0.')
    }

    setIsSaving(true)
    setError(null)
    try {
      const updated = await upsertWeightPricing({
        base_price_per_kg: draft.base_price_per_kg,
        minimum_charge: draft.minimum_charge || '0',
        minimum_order_weight_kg: draft.minimum_order_weight_kg || null,
        is_active: true,
      })
      onSaved(updated)
      setEditing(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to save weight pricing. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const money = (v: string | null | undefined) => {
    const n = v == null ? NaN : parseFloat(v)
    return isNaN(n) ? '—' : `GH₵${n.toFixed(2)}`
  }

  // ------------------------------------------------------------- read mode
  if (!editing) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={startEditing}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        </div>
        {pricing ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Price per kg
              </p>
              <p className="text-sm font-medium">{money(pricing.base_price_per_kg)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Minimum charge
              </p>
              <p className="text-sm font-medium">{money(pricing.minimum_charge)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Min. order weight
              </p>
              <p className="text-sm font-medium">
                {pricing.minimum_order_weight_kg ? `${pricing.minimum_order_weight_kg} kg` : '—'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No weight pricing configured yet. Click “Edit” to set it up.
          </p>
        )}
      </div>
    )
  }

  // ------------------------------------------------------------- edit mode
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="wp-per-kg">Price per kg (GH₵)</Label>
          <Input
            id="wp-per-kg"
            type="number"
            step="0.01"
            min="0"
            value={draft.base_price_per_kg}
            onChange={(e) => set({ base_price_per_kg: e.target.value })}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wp-min-charge">Minimum charge (GH₵)</Label>
          <Input
            id="wp-min-charge"
            type="number"
            step="0.01"
            min="0"
            value={draft.minimum_charge}
            onChange={(e) => set({ minimum_charge: e.target.value })}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wp-min-weight">Min. weight (kg)</Label>
          <Input
            id="wp-min-weight"
            type="number"
            step="0.1"
            min="0"
            placeholder="optional"
            value={draft.minimum_order_weight_kg}
            onChange={(e) => set({ minimum_order_weight_kg: e.target.value })}
            disabled={isSaving}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditing(false)} disabled={isSaving}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button size="sm" onClick={save} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
