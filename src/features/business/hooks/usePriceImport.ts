import { useState } from 'react'
import type { PricingItem } from '@/shared/types'
import { confirmPriceImport, getPriceImportJob, uploadPriceImport } from '../api'
import {
  PRICE_IMPORT_TERMINAL_STATUSES,
  buildPriceImportItems,
  normalizePriceImportDrafts,
  type PriceImportDraftRow,
} from '../lib/price-import'

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

interface UsePriceImportOptions {
  onImported: (items: PricingItem[]) => void
  reloadItems: () => Promise<PricingItem[]>
}

export function usePriceImport({ onImported, reloadItems }: UsePriceImportOptions) {
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<PriceImportDraftRow[]>([])
  const [jobId, setJobId] = useState<string | null>(null)
  const [provider, setProvider] = useState('')

  const applyJobDrafts = (job: Awaited<ReturnType<typeof getPriceImportJob>>) => {
    setProvider(job.provider)
    setDrafts(normalizePriceImportDrafts(job.draft_items))
  }

  const pollJob = async (id: string) => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const job = await getPriceImportJob(id)
      if (PRICE_IMPORT_TERMINAL_STATUSES.has(job.status)) {
        if (job.status === 'FAILED') throw new Error(job.error || 'Price list import failed.')
        applyJobDrafts(job)
        return
      }
      await delay(1500)
    }
    throw new Error('Import is taking too long. Try again in a moment.')
  }

  const selectFile = async (file: File | null) => {
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
      if (job.status === 'READY') applyJobDrafts(job)
      else await pollJob(job.id)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Could not import price list.')
    } finally {
      setIsUploading(false)
    }
  }

  const updateDraft = (index: number, patch: Partial<PriceImportDraftRow>) => {
    setDrafts((previous) => previous.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)))
  }

  const confirm = async () => {
    if (!jobId) return
    const items = buildPriceImportItems(drafts)
    if (items.length === 0) return setError('Select at least one item with a name and price.')

    setIsConfirming(true)
    setError(null)
    try {
      const result = await confirmPriceImport(jobId, items)
      onImported(await reloadItems())
      setSuccess(`Imported ${result.created.length} item(s)${result.skipped.length ? `; skipped ${result.skipped.length} duplicate(s).` : '.'}`)
      setDrafts([])
      setJobId(null)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Could not confirm import.')
    } finally {
      setIsConfirming(false)
    }
  }

  return { isUploading, isConfirming, error, success, drafts, jobId, provider, selectFile, updateDraft, confirm }
}
