/**
 * Onboarding photo → price-list import.
 *
 * Reuses the backend's OCR price-import endpoints (`/laundries/dashboard/
 * price-imports/`) to *extract* draft items from a photo, but — unlike the
 * business dashboard flow — it never calls the `confirm` action. Onboarding
 * persists its price list itself at the final step (see `savePriceItems`), so
 * here we only need the extracted drafts to prefill the wizard's local state.
 *
 * NOTE: the endpoints currently require an already-registered laundry, which
 * doesn't exist yet during onboarding. This module is gated behind
 * `ONBOARDING_PRICE_IMPORT_ENABLED` until the backend allows upload + poll
 * without a laundry.
 */
import { apiGet, apiPost } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'
import { COMMON_ITEMS } from '../constants'
import type { PriceItem } from '../types'

export interface OnboardingPriceImportDraft {
  id: string
  item_name: string
  suggested_price: string | number | null
  /** OCR garment-type category (e.g. "Shirts") — NOT an onboarding service category. */
  category: string
  confidence: number | null
  is_selected: boolean
}

export interface OnboardingPriceImportJob {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'CONFIRMED' | 'FAILED'
  provider: string
  error: string
  draft_items: OnboardingPriceImportDraft[]
}

/** A draft with an editable string price bound to the review table input. */
export interface OnboardingPriceImportDraftRow extends OnboardingPriceImportDraft {
  unit_price: string
}

/** Poll until the job reaches one of these; anything else means "keep polling". */
export const ONBOARDING_PRICE_IMPORT_TERMINAL_STATUSES = new Set<OnboardingPriceImportJob['status']>([
  'READY',
  'CONFIRMED',
  'FAILED',
])

export async function uploadOnboardingPriceImport(sourceImage: File): Promise<OnboardingPriceImportJob> {
  const formData = new FormData()
  formData.append('source_image', sourceImage)
  return unwrap<OnboardingPriceImportJob>(
    await apiPost<unknown>('/laundries/dashboard/price-imports/', formData),
  )
}

export async function getOnboardingPriceImportJob(jobId: string): Promise<OnboardingPriceImportJob> {
  return unwrap<OnboardingPriceImportJob>(
    await apiGet<unknown>(`/laundries/dashboard/price-imports/${jobId}/`),
  )
}

/** Turn backend drafts into editable rows (price rendered as a string input). */
export function normalizeDrafts(
  items: OnboardingPriceImportDraft[] = [],
): OnboardingPriceImportDraftRow[] {
  return items.map((item) => ({
    ...item,
    unit_price: item.suggested_price == null ? '' : String(item.suggested_price),
  }))
}

/**
 * Map reviewed drafts into onboarding `PriceItem`s under the given SERVICE
 * category (Wash Only / Wash & Iron / Iron Only). The OCR garment-category is
 * intentionally discarded: onboarding groups items by service, and the owner
 * chose the active service tab. `is_custom` mirrors the manual picker so an
 * unrecognised name renders as free text rather than an empty <select>.
 */
export function draftsToPriceItems(
  drafts: OnboardingPriceImportDraftRow[],
  serviceCategory: string,
): PriceItem[] {
  return drafts
    .filter((row) => row.is_selected && row.item_name.trim() && row.unit_price.trim())
    .map((row) => {
      const name = row.item_name.trim()
      const isCommon = COMMON_ITEMS.some((item) => item.toLowerCase() === name.toLowerCase())
      return {
        item_name: name,
        category: serviceCategory,
        unit_price: row.unit_price.trim(),
        is_custom: !isCommon,
      }
    })
}
