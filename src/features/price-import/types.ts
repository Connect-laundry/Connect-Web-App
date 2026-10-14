import type { PricingBasis, CatalogFields, BasketDefinition } from '@/features/business/lib/unified-pricing'
/**
 * Types mirroring the backend price-list import API
 * (connect_new_backend: docs/PRICE_LIST_IMPORT_API.md, laundries/serializers/price_import.py).
 * Money is always a decimal string; never do arithmetic on it with floats.
 */

export type ImportJobStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'CONFIRMED' | 'FAILED' | 'CANCELLED'
export type PricingMethod = PricingBasis | 'UNKNOWN'
export type ReviewState = 'LOOKS_GOOD' | 'CHECK' | 'UNREADABLE'
export type MatchType = 'NONE' | 'EXACT' | 'POSSIBLE'

export interface MatchedItem {
  id: string
  item_name: string
  unit_price: string
  category: string
}

export interface ImportDraftItem {
  id: string
  position: number
  item_name: string
  raw_name: string
  variant: string
  category: string
  pricing_details?: { service_type?: string; basket_name?: string; basket_capacity?: string; weight_min?: string; weight_max?: string; inclusions?: string[]; restrictions?: string[]; source_reference?: string }
  pricing_method: PricingMethod
  suggested_price: string | null
  price_per_kg: string | null
  surcharge_type: string
  surcharge_amount: string | null
  source_text: string
  review_state: ReviewState
  warnings: string[]
  confidence: number | null
  match_type: MatchType
  matched_item: MatchedItem | null
  is_selected: boolean
}

export interface ImportJob {
  review_draft?: { items: ConfirmRow[]; currency_confirmed: boolean; updated_at?: string }
  source_pages?: number
  source_available?: boolean
  id: string
  status: ImportJobStatus
  review_required: boolean
  provider: string
  error: string
  error_code: string
  currency: string
  document_warnings: string[]
  summary: { total: number; looks_good: number; please_check: number; could_not_read: number; possible_matches: number }
  served_from_cache: boolean
  deduplicated?: boolean
  draft_items: ImportDraftItem[]
  created_at: string
  completed_at: string | null
  confirmed_at: string | null
}

export interface ImportAvailability {
  available: boolean
  reason: string | null
  daily_limit: number
  used_last_24h: number
  max_upload_mb: number
  accepted_types: string[]
  max_pages?: number
  manual_entry_available: boolean
}

export interface ConfirmRow extends CatalogFields {
  basket_definition?: BasketDefinition
  draft_id?: string | null
  action: 'CREATE' | 'UPDATE' | 'IGNORE'
  pricing_method?: PricingBasis
  item_name?: string
  category?: string
  unit_price?: string
  price_per_kg?: string
  existing_item_id?: string | null
}

export interface ConfirmResult {
  created: string[]
  updated: string[]
  skipped: string[]
  already_confirmed: boolean
  job: ImportJob
}

/** Simame service types (stored in LaundryPricingItem.category). */
export const SERVICE_TYPES = ['Wash Only', 'Wash & Iron', 'Iron Only'] as const
export type ServiceType = (typeof SERVICE_TYPES)[number] | 'Wash & Fold' | 'Dry Clean' | 'Other service'

export type LaundryPricingModel = 'BY_ITEM' | 'BY_WEIGHT' | 'HYBRID'
