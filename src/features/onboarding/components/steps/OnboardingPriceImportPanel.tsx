'use client'

import { useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { useOnboardingPriceImport } from '../../hooks/useOnboardingPriceImport'
import { draftsToPriceItems } from '../../lib/price-import'
import type { PriceItem } from '../../types'

interface OnboardingPriceImportPanelProps {
  /** SERVICE category the extracted items are added under (the active tab). */
  serviceCategory: string
  /** Lower-cased label for that service, used in copy ("… to wash + ironing"). */
  serviceLabel: string
  onAdd: (items: PriceItem[]) => void
}

export const OnboardingPriceImportPanel = ({
  serviceCategory,
  serviceLabel,
  onAdd,
}: OnboardingPriceImportPanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const workflow = useOnboardingPriceImport()

  const selectable = workflow.drafts.filter(
    (row) => row.is_selected && row.item_name.trim() && row.unit_price.trim(),
  ).length

  const handleAdd = () => {
    const items = draftsToPriceItems(workflow.drafts, serviceCategory)
    if (items.length === 0) return
    onAdd(items)
    workflow.reset()
  }

  return (
    <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Import from a photo
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Snap or upload a photo of your price list and AI fills in the items and prices — they&apos;ll
            be added to <span className="font-medium">{serviceLabel}</span> for you to review.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => workflow.selectFile(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={workflow.isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {workflow.isUploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4 mr-2" />}
            {workflow.isUploading ? 'Reading photo…' : 'Upload price list'}
          </Button>
        </div>
      </div>

      {workflow.provider === 'null' && (
        <p className="text-xs text-muted-foreground">
          OCR isn&apos;t configured on the server yet, so no items will be detected. You can still add
          them manually below.
        </p>
      )}

      {workflow.error && (
        <Alert variant="destructive">
          <AlertDescription>{workflow.error}</AlertDescription>
        </Alert>
      )}

      {workflow.drafts.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Review extracted items</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-2">Use</th>
                  <th className="py-2 pr-2">Item</th>
                  <th className="py-2 pr-2">Price (GH₵)</th>
                </tr>
              </thead>
              <tbody>
                {workflow.drafts.map((draftRow, index) => (
                  <tr key={draftRow.id || index} className="border-b">
                    <td className="py-2 pr-2">
                      <input
                        type="checkbox"
                        checked={draftRow.is_selected}
                        onChange={(e) => workflow.updateDraft(index, { is_selected: e.target.checked })}
                        aria-label={`Include ${draftRow.item_name || 'item'}`}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={draftRow.item_name}
                        onChange={(e) => workflow.updateDraft(index, { item_name: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={draftRow.unit_price}
                        onChange={(e) => workflow.updateDraft(index, { unit_price: e.target.value })}
                        placeholder="0.00"
                        className="w-28"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button type="button" size="sm" disabled={selectable === 0} onClick={handleAdd}>
            Add {selectable} item{selectable === 1 ? '' : 's'} to {serviceLabel}
          </Button>
        </div>
      )}

      {!workflow.isUploading && workflow.drafts.length === 0 && workflow.jobId && (
        <p className="text-xs text-muted-foreground">
          No items were detected in that photo. Try a clearer picture or add items manually below.
        </p>
      )}
    </div>
  )
}
