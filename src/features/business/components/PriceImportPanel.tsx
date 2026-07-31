'use client'

import { useRef, useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { Camera, CheckCircle, Upload } from 'lucide-react'
import { PricingItem } from '@/shared/interfaces'
import {
  confirmPriceImport,
  getPriceImportJob,
  uploadPriceImport,
  type PriceImportDraftItem,
} from '../api'

interface DraftRow extends PriceImportDraftItem {
  unit_price: string
}

interface PriceImportPanelProps {
  onImported: (items: PricingItem[]) => void
  reloadItems: () => Promise<PricingItem[]>
}

const TERMINAL_STATUSES = new Set(['READY', 'CONFIRMED', 'FAILED'])

export function PriceImportPanel({ onImported, reloadItems }: PriceImportPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<DraftRow[]>([])
  const [jobId, setJobId] = useState<string | null>(null)
  const [provider, setProvider] = useState<string>('')

  const pollJob = async (id: string) => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const job = await getPriceImportJob(id)
      if (TERMINAL_STATUSES.has(job.status)) {
        if (job.status === 'FAILED') {
          throw new Error(job.error || 'Price list import failed.')
        }
        setProvider(job.provider)
        setDrafts(
          (job.draft_items ?? []).map((item) => ({
            ...item,
            unit_price:
              item.suggested_price != null ? String(item.suggested_price) : '',
          })),
        )
        return
      }
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    throw new Error('Import is taking too long. Try again in a moment.')
  }

  const handleFile = async (file: File | null) => {
    if (!file) return
    setIsUploading(true)
    setError(null)
    setSuccess(null)
    setDrafts([])
    setJobId(null)

    try {
      const job = await uploadPriceImport(file)
      setJobId(job.id)
      setProvider(job.provider)
      if (job.status === 'READY') {
        setDrafts(
          (job.draft_items ?? []).map((item) => ({
            ...item,
            unit_price:
              item.suggested_price != null ? String(item.suggested_price) : '',
          })),
        )
      } else {
        await pollJob(job.id)
      }
    } catch (err: any) {
      setError(err.message || 'Could not import price list.')
    } finally {
      setIsUploading(false)
    }
  }

  const updateDraft = (index: number, patch: Partial<DraftRow>) => {
    setDrafts((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  const handleConfirm = async () => {
    if (!jobId) return
    const selected = drafts.filter((row) => row.is_selected && row.item_name.trim())
    const items = selected
      .filter((row) => row.unit_price.trim())
      .map((row) => ({
        item_name: row.item_name.trim(),
        unit_price: row.unit_price.trim(),
        category: row.category || '',
      }))

    if (items.length === 0) {
      setError('Select at least one item with a name and price.')
      return
    }

    setIsConfirming(true)
    setError(null)
    try {
      const result = await confirmPriceImport(jobId, items)
      const refreshed = await reloadItems()
      onImported(refreshed)
      setSuccess(
        `Imported ${result.created.length} item(s)${
          result.skipped.length ? `; skipped ${result.skipped.length} duplicate(s).` : '.'
        }`,
      )
      setDrafts([])
      setJobId(null)
    } catch (err: any) {
      setError(err.message || 'Could not confirm import.')
    } finally {
      setIsConfirming(false)
    }
  }

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
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4 mr-2" />}
            {isUploading ? 'Processing…' : 'Upload price list'}
          </Button>
        </div>
      </div>

      {provider && (
        <p className="text-xs text-muted-foreground">
          OCR provider: {provider || 'none configured'}
          {provider === 'null' && ' — backend will return empty drafts until Google Vision or another provider is configured.'}
        </p>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {drafts.length > 0 && (
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
                {drafts.map((row, index) => (
                  <tr key={row.id || index} className="border-b">
                    <td className="py-2 pr-2">
                      <input
                        type="checkbox"
                        checked={row.is_selected}
                        onChange={(e) => updateDraft(index, { is_selected: e.target.checked })}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={row.item_name}
                        onChange={(e) => updateDraft(index, { item_name: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={row.category}
                        onChange={(e) => updateDraft(index, { category: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={row.unit_price}
                        onChange={(e) => updateDraft(index, { unit_price: e.target.value })}
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button type="button" size="sm" disabled={isConfirming} onClick={handleConfirm}>
            {isConfirming ? <Spinner className="h-4 w-4" /> : 'Add selected to price list'}
          </Button>
        </div>
      )}

      {!isUploading && drafts.length === 0 && jobId && (
        <p className="text-xs text-muted-foreground">
          Import finished with no items detected. Add items manually or configure OCR on the backend.
        </p>
      )}
    </div>
  )
}
