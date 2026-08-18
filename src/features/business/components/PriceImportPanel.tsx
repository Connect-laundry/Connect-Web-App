'use client'

import { useRef } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { Camera, CheckCircle, Upload } from 'lucide-react'
import { PricingItem } from '@/shared/types'
import { usePriceImport } from '../hooks/usePriceImport'

interface PriceImportPanelProps {
  onImported: (items: PricingItem[]) => void
  reloadItems: () => Promise<PricingItem[]>
}

export const PriceImportPanel = ({ onImported, reloadItems }: PriceImportPanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const workflow = usePriceImport({ onImported, reloadItems })

  return (
    <div className="mb-6 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Import from photo
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload a photo of your price list (shirt, trousers, etc.) and AI will suggest items and prices for you to review.
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
            {workflow.isUploading ? 'Processing…' : 'Upload price list'}
          </Button>
        </div>
      </div>

      {workflow.provider && (
        <p className="text-xs text-muted-foreground">
          OCR provider: {workflow.provider || 'none configured'}
          {workflow.provider === 'null' && ' — backend will return empty drafts until Google Vision or another provider is configured.'}
        </p>
      )}

      {workflow.error && (
        <Alert variant="destructive">
          <AlertDescription>{workflow.error}</AlertDescription>
        </Alert>
      )}

      {workflow.success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{workflow.success}</AlertDescription>
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
                  <th className="py-2 pr-2">Category</th>
                  <th className="py-2 pr-2">Price (GH₵)</th>
                </tr>
              </thead>
              <tbody>
                {workflow.drafts.map((row, index) => (
                  <tr key={row.id || index} className="border-b">
                    <td className="py-2 pr-2">
                      <input
                        type="checkbox"
                        checked={row.is_selected}
                        onChange={(e) => workflow.updateDraft(index, { is_selected: e.target.checked })}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={row.item_name}
                        onChange={(e) => workflow.updateDraft(index, { item_name: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={row.category}
                        onChange={(e) => workflow.updateDraft(index, { category: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={row.unit_price}
                        onChange={(e) => workflow.updateDraft(index, { unit_price: e.target.value })}
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button type="button" size="sm" disabled={workflow.isConfirming} onClick={workflow.confirm}>
            {workflow.isConfirming ? <Spinner className="h-4 w-4" /> : 'Add selected to price list'}
          </Button>
        </div>
      )}

      {!workflow.isUploading && workflow.drafts.length === 0 && workflow.jobId && (
        <p className="text-xs text-muted-foreground">
          Import finished with no items detected. Add items manually or configure OCR on the backend.
        </p>
      )}
    </div>
  )
}
