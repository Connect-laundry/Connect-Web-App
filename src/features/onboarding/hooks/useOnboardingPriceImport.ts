import { useState } from 'react'
import {
  ONBOARDING_PRICE_IMPORT_TERMINAL_STATUSES,
  getOnboardingPriceImportJob,
  normalizeDrafts,
  uploadOnboardingPriceImport,
  type OnboardingPriceImportDraftRow,
  type OnboardingPriceImportJob,
} from '../lib/price-import'

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

/**
 * Upload a price-list photo and poll the OCR job until it produces draft rows.
 * Unlike the dashboard flow this never confirms — the caller lifts the reviewed
 * drafts into the wizard's local price list.
 */
export function useOnboardingPriceImport() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<OnboardingPriceImportDraftRow[]>([])
  const [provider, setProvider] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)

  const applyJob = (job: OnboardingPriceImportJob) => {
    setProvider(job.provider)
    setDrafts(normalizeDrafts(job.draft_items))
  }

  const pollJob = async (id: string) => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const job = await getOnboardingPriceImportJob(id)
      if (ONBOARDING_PRICE_IMPORT_TERMINAL_STATUSES.has(job.status)) {
        if (job.status === 'FAILED') throw new Error(job.error || 'Price list import failed.')
        applyJob(job)
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
    setDrafts([])
    setJobId(null)
    try {
      const job = await uploadOnboardingPriceImport(file)
      setJobId(job.id)
      setProvider(job.provider)
      if (job.status === 'READY') applyJob(job)
      else await pollJob(job.id)
    } catch (uploadError: unknown) {
      setError(uploadError instanceof Error ? uploadError.message : 'Could not import price list.')
    } finally {
      setIsUploading(false)
    }
  }

  const updateDraft = (index: number, patch: Partial<OnboardingPriceImportDraftRow>) => {
    setDrafts((previous) => previous.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)))
  }

  const reset = () => {
    setDrafts([])
    setJobId(null)
    setProvider('')
    setError(null)
  }

  return { isUploading, error, drafts, provider, jobId, selectFile, updateDraft, reset }
}
