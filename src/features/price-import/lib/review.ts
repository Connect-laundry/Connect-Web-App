/**
 * Turn backend drafts into owner-reviewable rows, and reviewed rows into
 * either wizard form values (onboarding) or a confirm payload (dashboard).
 *
 * Rules (never invent data to fill a form):
 *  - A row's service type comes from what the list says ("Wash & Iron",
 *    "Ironing"...). Rows that name no service go under the service the OWNER
 *    picks for them — an explicit, visible choice, not a guess.
 *  - Dry cleaning and express lines have no Simame service type: they are
 *    left out and flagged; the owner decides.
 *  - A row that doesn't fit the laundry's configuration (per-kg on a per-item
 *    laundry, ironing when ironing is off, ...) is left out and explained.
 *  - Per-kg and per-item prices are kept apart; neither overwrites the other.
 *  - Existing values are never overwritten silently: the owner picks
 *    "Keep existing" (default) or "Use detected".
 */
import { SERVICE_TYPES, type ImportDraftItem, type LaundryPricingModel, type ServiceType } from '../types'
import { uniqueWarningTexts } from './messages'
import { isValidMoney, normalizeMoney, sameMoney } from './money'

export type RowMethod = 'PER_ITEM' | 'PER_KG' | ''
export type ServiceChoice = ServiceType | 'UNSTATED' | ''

export interface ExistingValue {
  /** Existing LaundryPricingItem id (dashboard only). */
  id?: string
  name: string
  price: string
}

export interface ReviewRow {
  key: string
  draftId: string | null
  include: boolean
  /** Garment/service name without the service-type suffix, e.g. "Shirt". */
  name: string
  /** "Wash & Iron" etc., 'UNSTATED' = use the owner's default, '' = owner must choose. */
  service: ServiceChoice
  /** What the list literally said, e.g. "Dry Clean" (shown as a hint). */
  detectedService: string
  method: RowMethod
  price: string
  reviewState: 'LOOKS_GOOD' | 'CHECK' | 'UNREADABLE'
  /** Plain-language notes (backend warnings + fit checks). */
  notes: string[]
  sourceText: string
  existing: ExistingValue | null
  /** Where `existing` came from: the server's duplicate matcher or the form. */
  existingSource: 'server' | 'local' | null
  /** For rows matching an existing value. */
  choice: 'KEEP' | 'USE_DETECTED' | 'CREATE_NEW'
  /** Backend match type, for the dashboard's Update/Create/Ignore. */
  matchType: 'NONE' | 'EXACT' | 'POSSIBLE'
}

export interface ReviewContext {
  pricingModel: LaundryPricingModel
  /** Laundry offers ironing. `undefined` = unknown, don't enforce. */
  ironingAvailable?: boolean
  /** Existing per-item prices (wizard state or saved catalogue). */
  existingItems: Array<{ id?: string; name: string; category: string; price: string }>
  /** Existing per-kg price, if any. */
  existingPerKg: string | null
}

// ---------------------------------------------------------------- service type

const DRY_CLEAN = /dry[\s-]*clean/i
const EXPRESS = /\b(express|same[\s-]*day|urgent)\b/i
const WASH_AND_IRON = /\b(wash(ed|ing)?|laundry|launder(ed)?)\s*(&|and|\+|n|\/)\s*(iron(ed|ing)?|press(ed|ing)?)\b/i
const IRON_ONLY = /\b(iron(ing)?|press(ing)?|steam(ing)?)(\s*only)?\b/i
const WASH_ONLY = /\b(wash(ing)?|fold(ing)?)\b/i
const SIZE_WORD = /\b(single|double|queen|king|small|medium|large|big|extra\s*large|xl|\d+\s*(piece|pc|pcs)|child|adult)\b/i

export type DetectedService = ServiceType | 'DRY_CLEAN' | 'EXPRESS' | 'SIZE' | null

/** Classify the service a draft's variant/name describes. Pure, deterministic. */
export function detectService(variant: string, name = '', section = ''): DetectedService {
  // Most specific first: the row's own variant, then its name ("Shirt
  // ironing"), then the heading it sits under ("IRONING / PRESSING").
  const fromVariant = classify(variant, true)
  if (fromVariant) return fromVariant
  const fromName = classify(name, false)
  if (fromName) return fromName
  return classify(section, false)
}

function classify(raw: string, allowSize: boolean): DetectedService {
  const text = raw.trim()
  if (!text) return null
  if (DRY_CLEAN.test(text)) return 'DRY_CLEAN'
  if (EXPRESS.test(text)) return 'EXPRESS'
  if (WASH_AND_IRON.test(text)) return 'Wash & Iron'
  if (IRON_ONLY.test(text) && !WASH_ONLY.test(text)) return 'Iron Only'
  if (WASH_ONLY.test(text) && !IRON_ONLY.test(text)) return 'Wash Only'
  if (allowSize && SIZE_WORD.test(text)) return 'SIZE'
  return null
}

/** "Shirt ironing" → "Shirt" once the service has been taken from the name. */
function withoutServiceWord(name: string): string {
  const stripped = name
    .replace(WASH_AND_IRON, ' ')
    .replace(new RegExp(IRON_ONLY.source, 'gi'), ' ')
    .replace(new RegExp(WASH_ONLY.source, 'gi'), ' ')
    .replace(/\(\s*\)/g, ' ')
    .replace(/\s*[-–—:,]\s*$/, '')
    .replace(/^\s*[-–—:,]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped || name
}

/** Strip the " – Variant" suffix the backend adds to item names. */
export function baseName(draft: Pick<ImportDraftItem, 'item_name' | 'variant'>): string {
  const name = (draft.item_name || '').trim()
  const variant = (draft.variant || '').trim()
  if (variant) {
    for (const sep of [' – ', ' - ', ' — ']) {
      const suffix = `${sep}${variant}`
      if (name.toLowerCase().endsWith(suffix.toLowerCase())) return name.slice(0, -suffix.length).trim()
    }
  }
  return name
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// ---------------------------------------------------------------- build rows

export function buildReviewRows(drafts: ImportDraftItem[], ctx: ReviewContext): ReviewRow[] {
  const rows = drafts.map((d, index) => draftToRow(d, index))
  applyFitRules(rows, ctx)
  return rows
}

function draftToRow(d: ImportDraftItem, index: number): ReviewRow {
  const detected = detectService(d.variant, d.raw_name, d.category)
  let name = baseName(d)
  const serviceInName = !classify(d.variant, true) && !!classify(d.raw_name, false)
  let service: ServiceChoice = 'UNSTATED'
  const notes = uniqueWarningTexts(d.warnings || [])
  let include = d.is_selected && d.review_state !== 'UNREADABLE'

  if (detected === 'Wash Only' || detected === 'Wash & Iron' || detected === 'Iron Only') {
    service = detected
    if (serviceInName && d.pricing_method === 'PER_ITEM') name = withoutServiceWord(name)
    // "King - Wash only": the service is the type, the size stays with the item.
    const size = d.variant.match(SIZE_WORD)?.[0]
    if (size && !name.toLowerCase().includes(size.toLowerCase())) name = `${name} (${capitalize(size)})`
  } else if (detected === 'DRY_CLEAN') {
    service = ''
    include = false
    notes.push("Dry cleaning isn't one of your service types. Choose one, or leave it out.")
  } else if (detected === 'EXPRESS') {
    service = ''
    include = false
    notes.push('This is an express price. Set express options in your express settings instead.')
  } else if (detected === 'SIZE' && d.variant) {
    // A size is part of what the customer orders, not a service.
    name = `${name} (${d.variant.trim()})`
  }

  const method: RowMethod = d.pricing_method === 'PER_KG' ? 'PER_KG' : d.pricing_method === 'PER_ITEM' ? 'PER_ITEM' : ''
  const rawPrice = method === 'PER_KG' ? d.price_per_kg : d.suggested_price ?? d.price_per_kg
  const price = rawPrice == null ? '' : normalizeMoney(rawPrice)
  if (!method) {
    include = false
  }
  if (d.surcharge_type && d.surcharge_amount) {
    notes.push(`An extra ${d.surcharge_type.toLowerCase()} charge of GH₵${normalizeMoney(d.surcharge_amount)} was listed. Add it in your express settings if you offer it.`)
  }

  return {
    key: d.id || `row-${index}`,
    draftId: d.id || null,
    include,
    name,
    service,
    detectedService: d.variant || '',
    method,
    price,
    reviewState: d.review_state,
    notes,
    sourceText: d.source_text || '',
    existing: d.matched_item && d.match_type !== 'NONE'
      ? { id: d.matched_item.id, name: d.matched_item.item_name, price: normalizeMoney(d.matched_item.unit_price) }
      : null,
    existingSource: d.matched_item && d.match_type !== 'NONE' ? 'server' : null,
    // Never overwrite silently: a matched row starts on "Keep existing".
    choice: d.matched_item && d.match_type !== 'NONE' ? 'KEEP' : 'USE_DETECTED',
    matchType: d.match_type || 'NONE',
  }
}

/** Mark rows that don't fit the laundry, and match against existing values. */
function applyFitRules(rows: ReviewRow[], ctx: ReviewContext) {
  const perKgRows: ReviewRow[] = []
  for (const row of rows) {
    if (row.method === 'PER_KG') {
      perKgRows.push(row)
      if (ctx.pricingModel === 'BY_ITEM') {
        row.include = false
        row.notes.push('Your laundry prices per item. Switch to Hybrid in your pricing settings to use a per-kg price.')
      }
      if (ctx.existingPerKg && !sameMoney(ctx.existingPerKg, row.price)) {
        row.existing = { name: 'Per-kg price', price: normalizeMoney(ctx.existingPerKg) }
        row.existingSource = 'local'
        row.choice = 'KEEP'
      } else if (ctx.existingPerKg) {
        row.include = false
        row.notes.push('You already have this per-kg price.')
      }
      continue
    }
    if (row.method === 'PER_ITEM' && ctx.pricingModel === 'BY_WEIGHT') {
      row.include = false
      row.notes.push('Your laundry prices by weight. Switch to Hybrid to add per-item prices.')
    }
    if (ctx.ironingAvailable === false && (row.service === 'Wash & Iron' || row.service === 'Iron Only')) {
      row.include = false
      row.notes.push("Your laundry doesn't offer ironing yet. Turn ironing on, or leave this out.")
    }
  }
  if (perKgRows.filter((r) => r.include).length > 1) {
    perKgRows.forEach((r, i) => {
      if (i > 0) r.include = false
    })
  }
}

/**
 * Attach existing values for the service each row will land in. Called again
 * whenever the owner changes a row's service or the default service.
 */
export function matchExisting(rows: ReviewRow[], ctx: ReviewContext, defaultService: ServiceType): ReviewRow[] {
  return rows.map((row) => {
    if (row.method !== 'PER_ITEM') return row
    const service = resolveService(row, defaultService)
    const hit = ctx.existingItems.find(
      (it) => norm(it.name) === norm(row.name) && (!service || norm(it.category) === norm(service)),
    )
    if (!hit) {
      // Only clear a match we made ourselves; server matches stay.
      return row.existingSource === 'local'
        ? { ...row, existing: null, existingSource: null, choice: 'USE_DETECTED' }
        : row
    }
    const existing = { id: hit.id, name: hit.name, price: normalizeMoney(hit.price) }
    if (sameMoney(hit.price, row.price)) {
      return { ...row, existing, existingSource: 'local', choice: 'KEEP', include: false }
    }
    const sameTarget = row.existingSource === 'local' && row.existing?.name === hit.name
    return { ...row, existing, existingSource: 'local', choice: sameTarget ? row.choice : 'KEEP' }
  })
}

export const resolveService = (row: ReviewRow, defaultService: ServiceType): ServiceType | null =>
  row.service === 'UNSTATED' ? defaultService : row.service === '' ? null : row.service

// ---------------------------------------------------------------- validation

/** Why a row can't be applied as-is (null = ok). Only checked for included rows. */
export function rowProblem(row: ReviewRow, defaultService: ServiceType): string | null {
  if (!row.include) return null
  if (!row.name.trim() && row.method !== 'PER_KG') return 'Enter the service name.'
  if (!row.method) return 'Choose per item or per kg.'
  if (row.method === 'PER_ITEM' && !resolveService(row, defaultService)) return 'Choose a service type.'
  if (!isValidMoney(row.price)) return 'Enter a price, for example 15 or 15.50.'
  return null
}

export function reviewProblems(rows: ReviewRow[], defaultService: ServiceType): string[] {
  const problems: string[] = []
  const perKg = rows.filter((r) => r.include && r.method === 'PER_KG' && !(r.existing && r.choice === 'KEEP'))
  if (perKg.length > 1) problems.push('Your laundry can have one per-kg price. Keep only one per-kg row.')
  const seen = new Set<string>()
  for (const r of rows) {
    if (!r.include || r.method !== 'PER_ITEM') continue
    const key = `${norm(r.name)}|${resolveService(r, defaultService)}`
    if (seen.has(key)) {
      problems.push(`"${r.name}" appears twice under the same service. Remove one.`)
      break
    }
    seen.add(key)
  }
  return problems
}

// ---------------------------------------------------------------- outputs

export interface AppliedPrices {
  /** Per-item rows to add/update in the form: service type + name + price. */
  items: Array<{ name: string; service: ServiceType; price: string; replaces: boolean }>
  /** Per-kg price to put in the weight pricing, if the owner kept one. */
  perKg: { price: string; replaces: boolean } | null
}

/** Rows the owner kept, ready to merge into the onboarding wizard's form. */
export function toAppliedPrices(rows: ReviewRow[], defaultService: ServiceType): AppliedPrices {
  const out: AppliedPrices = { items: [], perKg: null }
  for (const r of rows) {
    if (!r.include || rowProblem(r, defaultService)) continue
    if (r.existing && r.choice === 'KEEP') continue
    if (r.method === 'PER_KG') {
      if (!out.perKg) out.perKg = { price: normalizeMoney(r.price), replaces: !!r.existing }
      continue
    }
    const service = resolveService(r, defaultService)
    if (!service) continue
    out.items.push({ name: r.name.trim(), service, price: normalizeMoney(r.price), replaces: !!r.existing })
  }
  return out
}

/** Server confirm payload (dashboard). Every row is sent, so the server can
 * record what the owner ignored; the server revalidates everything. */
export function toConfirmRows(rows: ReviewRow[], defaultService: ServiceType, hasWeightPricing: boolean) {
  const included = rows.filter((r) => r.include && !rowProblem(r, defaultService) && r.method === 'PER_ITEM')
  const nameCount = new Map<string, number>()
  for (const r of included) nameCount.set(norm(r.name), (nameCount.get(norm(r.name)) ?? 0) + 1)

  return rows.map((r) => {
    const ignore = { draft_id: r.draftId, action: 'IGNORE' as const }
    if (!r.include || rowProblem(r, defaultService)) return ignore
    if (r.existing && r.choice === 'KEEP') return ignore
    if (r.method === 'PER_KG') {
      return {
        draft_id: r.draftId,
        action: (hasWeightPricing ? 'UPDATE' : 'CREATE') as 'UPDATE' | 'CREATE',
        pricing_method: 'PER_KG' as const,
        price_per_kg: normalizeMoney(r.price),
      }
    }
    const service = resolveService(r, defaultService)!
    if (r.existing?.id && r.choice === 'USE_DETECTED') {
      return {
        draft_id: r.draftId,
        action: 'UPDATE' as const,
        pricing_method: 'PER_ITEM' as const,
        item_name: r.existing.name,
        category: service,
        unit_price: normalizeMoney(r.price),
        existing_item_id: r.existing.id,
      }
    }
    // The same garment priced under several services needs distinct names
    // (names are unique per laundry) — same convention as onboarding.
    const clash = (nameCount.get(norm(r.name)) ?? 0) > 1 || r.choice === 'CREATE_NEW'
    return {
      draft_id: r.draftId,
      action: 'CREATE' as const,
      pricing_method: 'PER_ITEM' as const,
      item_name: clash ? `${r.name.trim()} (${service})` : r.name.trim(),
      category: service,
      unit_price: normalizeMoney(r.price),
    }
  })
}

export const DEFAULT_SERVICE: ServiceType = SERVICE_TYPES[0]
