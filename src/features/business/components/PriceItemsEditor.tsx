'use client'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { cn } from '@/shared/lib/utils'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import type { PricingItem } from '@/shared/types'
import { usePriceItemsEditor } from '../hooks/usePriceItemsEditor'
import { SERVICE_CATEGORIES } from '../lib/price-items'

interface PriceItemsEditorProps {
  items: PricingItem[]
  onSaved: (items: PricingItem[]) => void
}

/**
 * Read-only price list table with an Edit mode that allows adding, editing,
 * and deleting items. Saves via the pricing-items CRUD endpoints.
 */
export const PriceItemsEditor = ({ items, onSaved }: PriceItemsEditorProps) => {
  const { editing, setEditing, drafts, isSaving, error, startEditing, update, addRow, removeRow, save } =
    usePriceItemsEditor(items, onSaved)

  // ------------------------------------------------------------- read mode
  if (!editing) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={startEditing}>
            <Pencil className="mr-2 h-4 w-4" /> Edit price list
          </Button>
        </div>
        {items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Unit Price</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[...items]
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 font-medium">{item.item_name}</td>
                      <td className="py-4">{item.category || '—'}</td>
                      <td className="py-4">GH₵{Number(item.unit_price).toFixed(2)}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                            item.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No price list items yet. Click “Edit price list” to add some.
          </p>
        )}
      </div>
    )
  }

  // ------------------------------------------------------------- edit mode
  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {drafts.map((d, index) => (
        <div key={d.id ?? `new-${index}`} className="space-y-2 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Item name (e.g. Shirt)"
              value={d.item_name}
              onChange={(e) => update(index, { item_name: e.target.value })}
              className="flex-1"
              disabled={isSaving}
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Price (GH₵)"
              value={d.unit_price}
              onChange={(e) => update(index, { unit_price: e.target.value })}
              className="w-32"
              disabled={isSaving}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRow(index)}
              disabled={isSaving}
              className="shrink-0 text-destructive hover:bg-destructive/5 hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SERVICE_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                disabled={isSaving}
                onClick={() => update(index, { category: c.value })}
                className={cn(
                  'rounded-md border px-2 py-2 text-xs font-medium transition-colors',
                  d.category === c.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input bg-background text-muted-foreground hover:bg-accent',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" className="w-full" onClick={addRow} disabled={isSaving}>
        <Plus className="mr-2 h-4 w-4" /> Add item
      </Button>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditing(false)} disabled={isSaving}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button size="sm" onClick={save} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save price list'}
        </Button>
      </div>
    </div>
  )
}
