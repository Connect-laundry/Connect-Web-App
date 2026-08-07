import type { PriceImportDraftItem, PriceImportJob } from '../api'

export interface PriceImportDraftRow extends PriceImportDraftItem {
  unit_price: string
}

export interface ConfirmPriceImportItem {
  item_name: string
  unit_price: string
  category: string
}

export const PRICE_IMPORT_TERMINAL_STATUSES = new Set<PriceImportJob['status']>([
  'READY',
  'CONFIRMED',
  'FAILED',
])

export function normalizePriceImportDrafts(items: PriceImportDraftItem[] = []): PriceImportDraftRow[] {
  return items.map((item) => ({
    ...item,
    unit_price: item.suggested_price == null ? '' : String(item.suggested_price),
  }))
}

export function buildPriceImportItems(drafts: PriceImportDraftRow[]): ConfirmPriceImportItem[] {
  return drafts
    .filter((row) => row.is_selected && row.item_name.trim() && row.unit_price.trim())
    .map((row) => ({
      item_name: row.item_name.trim(),
      unit_price: row.unit_price.trim(),
      category: row.category || '',
    }))
}
