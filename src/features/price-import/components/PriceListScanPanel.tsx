'use client'

import { useRef, useState } from 'react'
import { Camera, ImageUp, RotateCcw, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { DOC_NOTES } from '../lib/messages'
import { usePriceListScan } from '../hooks/usePriceListScan'
import type { ReviewContext } from '../lib/review'
import { SERVICE_TYPES, type ServiceType } from '../types'
import { PriceListReview } from './PriceListReview'

interface Props {
  context: ReviewContext
  /** Service tab the owner is on; rows that name no service default to it. */
  initialService?: ServiceType
  /** "Apply prices" (fill the form) or "Confirm & import" (save via the server). */
  applyLabel: string
  /** Returns a short success message, or throws an Error with owner-safe text. */
  onApply: (scan: ReturnType<typeof usePriceListScan>) => Promise<string>
  /** One-line explanation of what applying does. */
  applyHint: string
  /** Remembers an unfinished scan in this tab so a reload can reopen it. */
  scope?: string
}

export const PriceListScanPanel = ({ context, initialService, applyLabel, onApply, applyHint, scope }: Props) => {
  const scan = usePriceListScan(context, initialService, scope)
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [applying, setApplying] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [processingConsent, setProcessingConsent] = useState(false)

  const allowPerKg = context.pricingModel !== 'BY_ITEM'
  const allowPerItem = context.pricingModel !== 'BY_WEIGHT'
  const docNotes = (scan.job?.document_warnings ?? []).map((w) => DOC_NOTES[w]).filter(Boolean)
  const scanUnavailable = scan.available === false

  const apply = async () => {
    setApplying(true)
    scan.setError(null)
    try {
      const message = await onApply(scan)
      setDone(message)
      scan.clear()
    } catch (e) {
      scan.setError(e instanceof Error && e.message ? e.message : 'Could not apply the prices. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDone(null)
    setProcessingConsent(false)
    scan.pickFiles(Array.from(e.target.files ?? []))
    e.target.value = '' // allow re-picking the same file
  }

  return (
    <section className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 space-y-4" aria-label="Scan your price list">
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={pick} data-testid="camera-input" />
      <input ref={fileRef} type="file" multiple accept={scan.accept} className="hidden" onChange={pick} data-testid="file-input" />

      {scanUnavailable && (
        <Alert>
          <AlertDescription>
            Price-list scanning is temporarily unavailable. You can still enter prices manually, or try again later.
          </AlertDescription>
        </Alert>
      )}

      {scan.phase === 'idle' && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Already have a price list?</p>
            <p className="text-xs text-muted-foreground mt-1">
              We&apos;ll read the list and fill your prices. You&apos;ll review everything before saving.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => cameraRef.current?.click()}>
              <Camera className="h-4 w-4 mr-2" /> Take a photo
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <ImageUp className="h-4 w-4 mr-2" /> Upload price list with AI
            </Button>
          </div>
        </div>
      )}

      {done && scan.phase === 'idle' && (
        <Alert>
          <AlertDescription>{done}</AlertDescription>
        </Alert>
      )}

      {(scan.phase === 'preview' || scan.phase === 'reading') && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{scan.files?.map((file) => file.name).join(", ")}</p>
          {scan.previewUrl && <div className="flex flex-col gap-3 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scan.previewUrl}
              alt="Your price list photo"
              className="max-h-64 w-full rounded-md border object-contain bg-background sm:w-64"
            />
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>Include the full list</li>
              <li>Use good lighting</li>
              <li>Avoid glare and shadows</li>
              <li>Make sure the prices are readable</li>
            </ul>
          </div>}
          {scan.phase === 'reading' ? (
            <div className="flex items-center gap-3 text-sm" role="status" aria-live="polite">
              <Spinner className="h-4 w-4" />
              <span>{scan.readingText}</span>
              <Button type="button" variant="ghost" size="sm" onClick={scan.cancelReading} className="ml-auto">
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={processingConsent} onChange={(e) => setProcessingConsent(e.target.checked)} className="mt-0.5" />
                <span>I agree to send this price-list image to Google Gemini and, if needed, OCR.space to read services and prices. I have removed any personal information I do not want shared.</span>
              </label>
              <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-xs underline">Read our Privacy Policy</a>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => scan.read(processingConsent)} disabled={!processingConsent}>
                  Read price list
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => cameraRef.current?.click()}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Retake
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  Choose another
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={scan.clear}>
                  <X className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {scan.error && (
        <Alert variant="destructive">
          <AlertDescription>{scan.error}</AlertDescription>
        </Alert>
      )}

      {scan.phase === 'review' && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold">
              We found {scan.rows.length} possible {scan.rows.length === 1 ? 'price' : 'prices'}.
            </p>
            <p className="text-xs text-muted-foreground">Please review the details before saving. You can edit anything.</p>
          </div>
          {docNotes.map((n) => (
            <p key={n} className="text-xs text-amber-700 dark:text-amber-400">
              {n}
            </p>
          ))}
          {allowPerItem && (
            <label className="flex flex-wrap items-center gap-2 text-sm">
              <span>Services with no type on the list go under</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                value={scan.defaultService}
                onChange={(e) => scan.setDefaultService(e.target.value as ServiceType)}
                aria-label="Default service type"
              >
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          )}
          {scan.job?.source_available && <details className="rounded-md border p-3"><summary className="cursor-pointer text-sm">View original price list</summary><div className="mt-2 space-y-3">{Array.from({ length: scan.job.source_pages ?? 1 }, (_, index) => <a key={index} target="_blank" rel="noreferrer" href={`/api/proxy/laundries/dashboard/price-imports/${scan.job!.id}/source/?page=${index + 1}`} className="block text-sm text-primary underline">Open source page {index + 1}</a>)}</div></details>}
          <PriceListReview
            rows={scan.rows}
            defaultService={scan.defaultService}
            allowPerKg={allowPerKg}
            allowPerItem={allowPerItem}
            onChange={scan.updateRow}
          />
          {scan.needsCurrency && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={scan.currencyConfirmed}
                onChange={(e) => scan.setCurrencyConfirmed(e.target.checked)}
                className="h-4 w-4"
              />
              These prices are in Ghana cedis (GH₵)
            </label>
          )}
          {scan.problems.length > 0 && (
            <ul className="text-xs text-destructive space-y-0.5">
              {scan.problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">{applyHint}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={applying || scan.problems.length > 0 || scan.includedCount === 0}
              onClick={apply}
            >
              {applying && <Spinner className="h-4 w-4 mr-2" />}
              {applyLabel} ({scan.includedCount})
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={scan.clear} disabled={applying}>
              Discard
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
