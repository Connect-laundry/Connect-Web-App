import { Scale, Plus, Trash2 } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { emptyWeightTier, type WeightTier } from '../../types'

/** Common load sizes offered as one-tap starting points. */
const QUICK_WEIGHTS = ['5', '10', '15', '20']

interface WeightPricingFieldsProps {
  tiers: WeightTier[]
  setTiers: (updater: (prev: WeightTier[]) => WeightTier[]) => void
  isHybrid: boolean
}

/**
 * Weight-tier editor, shown for BY_WEIGHT / HYBRID laundries. Owners define
 * brackets like "20 kg → GH₵ 160". Saved to dashboard/weight-pricing/ after
 * the laundry is created (per-kg rate derived from the smallest tier until the
 * backend supports tiers natively).
 */
export const WeightPricingFields = ({ tiers, setTiers, isHybrid }: WeightPricingFieldsProps) => {
  const updateTier = (index: number, patch: Partial<WeightTier>) =>
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)))

  const addTier = (weight_kg = '') =>
    setTiers((prev) => [...prev, { ...emptyWeightTier(), weight_kg }])

  const removeTier = (index: number) =>
    setTiers((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)))

  const usedWeights = new Set(tiers.map((t) => t.weight_kg))

  return (
    <div className="space-y-4 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Scale className="w-4 h-4 text-primary" />
        Weight-based pricing
      </div>

      <p className="text-xs text-muted-foreground">
        Set the weights you offer and what each costs — e.g. 20 kg for GH₵ 160.
      </p>

      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_1fr_2.5rem] gap-2 text-xs font-medium text-muted-foreground px-1">
          <span>Weight (kg)</span>
          <span>Price (GH₵)</span>
          <span />
        </div>
        {tiers.map((tier, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_2.5rem] gap-2 items-center">
            <Input
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 20"
              value={tier.weight_kg}
              onChange={(e) => updateTier(index, { weight_kg: e.target.value })}
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 160.00"
              value={tier.price}
              onChange={(e) => updateTier(index, { price: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeTier(index)}
              disabled={tiers.length === 1}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/5"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => addTier()}>
          <Plus className="w-4 h-4 mr-1" /> Add tier
        </Button>
        {QUICK_WEIGHTS.filter((w) => !usedWeights.has(w)).map((w) => (
          <Button
            key={w}
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => addTier(w)}
          >
            + {w} kg
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {isHybrid
          ? 'Used alongside per-item prices for bulk/wash-and-fold orders.'
          : 'Customers are charged based on the weight bracket of their laundry.'}
      </p>
    </div>
  )
}
