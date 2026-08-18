'use client'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Pencil, X } from 'lucide-react'
import { WeightPricing } from '@/shared/types'
import { useWeightPricingEditor } from '../hooks/useWeightPricingEditor'

interface WeightPricingEditorProps {
  pricing: WeightPricing | null
  onSaved: (updated: WeightPricing) => void
}

/**
 * Read-only weight tariff panel with an inline edit mode. PATCHes the
 * weight-pricing singleton (creates it if the owner has none yet).
 */
export const WeightPricingEditor = ({ pricing, onSaved }: WeightPricingEditorProps) => {
  const { editing, setEditing, draft, set, isSaving, error, startEditing, save } =
    useWeightPricingEditor(pricing, onSaved)

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
