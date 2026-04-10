import { useState } from 'react'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Plus, Trash2, Tag, WashingMachine, Sparkles, Layers } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ExpressServiceFields } from './ExpressServiceFields'
import { type ExpressByService, type PriceItem } from '../../types'

/**
 * Service categories — each is a tab holding its own item list. An item's
 * service type is stored in the free-form `category` field on
 * LaundryPricingItem, so the same garment can be priced per service
 * (e.g. Shirt: wash-only GH₵8, wash+iron GH₵12).
 */
export const SERVICE_CATEGORIES = [
  { value: 'Wash Only', label: 'Wash only', icon: WashingMachine },
  { value: 'Wash & Iron', label: 'Wash + ironing', icon: Layers },
  { value: 'Iron Only', label: 'Ironing only', icon: Sparkles },
] as const

/** Common garments offered in the picker so owners don't type each name. */
export const COMMON_ITEMS = [
  'Shirt',
  'T-Shirt',
  'Trousers',
  'Jeans',
  'Shorts',
  'Dress',
  'Skirt',
  'Suit (2-piece)',
  'Suit (3-piece)',
  'Kaba & Slit',
  'Smock',
  'Jacket',
  'Sweater',
  'Bedsheet',
  'Duvet',
  'Pillowcase',
  'Blanket',
  'Curtains',
  'Towel',
  'Underwear',
  'Socks',
  'Sneakers',
] as const

const OTHER = '__other__'

interface PriceListStepProps {
  items: PriceItem[]
  setItems: (updater: (prev: PriceItem[]) => PriceItem[]) => void
  express: ExpressByService
  setExpress: (updater: (prev: ExpressByService) => ExpressByService) => void
  isHybrid: boolean
}

export function PriceListStep({
  items,
  setItems,
  express,
  setExpress,
  isHybrid,
}: PriceListStepProps) {
  const [activeCategory, setActiveCategory] = useState<string>(SERVICE_CATEGORIES[0].value)
  const activeMeta = SERVICE_CATEGORIES.find((c) => c.value === activeCategory)!

  // Items are stored flat (category on each row); the tabs just filter.
  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.category === activeCategory)

  const countFor = (category: string) =>
    items.filter((it) => it.category === category && it.item_name.trim()).length

  const updateItem = (index: number, patch: Partial<PriceItem>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  const addItem = () =>
    setItems((prev) => [...prev, { item_name: '', category: activeCategory, unit_price: '' }])

  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index))

  /** Names already used in the active tab (a garment appears once per service). */
  const usedNames = new Set(
    visible.map(({ item }) => item.item_name.trim().toLowerCase()).filter(Boolean),
  )

  /** Dropdown options for a row: unused common items + its own current value. */
  const optionsFor = (item: PriceItem) =>
    COMMON_ITEMS.filter(
      (name) =>
        name.toLowerCase() === item.item_name.trim().toLowerCase() ||
        !usedNames.has(name.toLowerCase()),
    )

  const onSelectName = (index: number, value: string) => {
    if (value === OTHER) {
      updateItem(index, { item_name: '', is_custom: true })
    } else {
      updateItem(index, { item_name: value, is_custom: false })
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {isHybrid
          ? 'Pick a service, then add the garments you price per item for it. Weight-based orders use the tiers you set earlier.'
          : 'Pick a service, then add the items customers can order and what each one costs.'}
      </p>

      {/* ----------------------------------------------- service type tabs */}
      <div className="grid grid-cols-3 gap-2">
        {SERVICE_CATEGORIES.map((c) => {
          const active = activeCategory === c.value
          const count = countFor(c.value)
          const hasExpress = !!express[c.value]?.enabled
          const Icon = c.icon
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setActiveCategory(c.value)}
              className={cn(
                'relative flex flex-col items-center gap-1 rounded-lg border-2 px-2 py-3 text-sm font-medium transition-colors',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input bg-background text-muted-foreground hover:border-primary/40 hover:bg-accent',
              )}
            >
              {hasExpress && (
                <span className="absolute right-1.5 top-1.5 text-amber-500" title="Express enabled">
                  ⚡
                </span>
              )}
              <Icon className="h-5 w-5" />
              {c.label}
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  active ? 'bg-primary/15' : 'bg-muted',
                )}
              >
                {count} item{count === 1 ? '' : 's'}
              </span>
            </button>
          )
        })}
      </div>

      {/* ---------------------------------------- items for the active tab */}
      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            No items yet for{' '}
            {SERVICE_CATEGORIES.find((c) => c.value === activeCategory)?.label.toLowerCase()}.
            Add the garments and their prices below.
          </p>
        )}
        {visible.map(({ item, index }) => (
          <div key={index} className="flex items-center gap-2 rounded-lg border p-3 animate-fadeIn">
            <Tag className="w-4 h-4 text-primary shrink-0" />
            {item.is_custom ? (
              <Input
                placeholder="Type the item name…"
                value={item.item_name}
                onChange={(e) => updateItem(index, { item_name: e.target.value })}
                className="flex-1"
                autoFocus
              />
            ) : (
              <select
                value={item.item_name}
                onChange={(e) => onSelectName(index, e.target.value)}
                className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>
                  Select an item…
                </option>
                {optionsFor(item).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <option value={OTHER}>Other… (type your own)</option>
              </select>
            )}
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Price (GH₵)"
              value={item.unit_price}
              onChange={(e) => updateItem(index, { unit_price: e.target.value })}
              className="w-32"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/5 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={addItem}>
        <Plus className="w-4 h-4 mr-2" /> Add item to {activeMeta.label.toLowerCase()}
      </Button>

      {/* Express is configured per service — this block follows the active tab. */}
      <ExpressServiceFields
        serviceKey={activeCategory}
        serviceLabel={activeMeta.label.toLowerCase()}
        express={express}
        setExpress={setExpress}
      />
    </div>
  )
}
