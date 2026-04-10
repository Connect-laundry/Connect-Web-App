import { apiPost, apiPut } from '@/shared/api/client'
import type { SetupFormValues } from './schema'
import type { DayHours, PriceItem, WeightTier } from './types'
import { MONEY_RE } from './validation'

const MY_LAUNDRY_URL = '/laundries/dashboard/my-laundry/'
const WEIGHT_PRICING_URL = '/laundries/dashboard/weight-pricing/'
const PRICING_ITEMS_URL = '/laundries/dashboard/pricing-items/'
const GEOCODE_URL = '/api/geocode'

export interface AddressSuggestion {
  latitude: number
  longitude: number
  formatted_address: string
  city?: string
}

/**
 * Address autocomplete: returns ranked place suggestions for a partial query.
 * Each suggestion already carries coordinates, so selecting one needs no
 * further lookup. Backed by the /api/geocode (Photon) proxy.
 */
export async function searchAddresses(query: string, limit = 6): Promise<AddressSuggestion[]> {
  const q = query.trim()
  if (q.length < 3) return []

  const res = await fetch(`${GEOCODE_URL}?q=${encodeURIComponent(q)}&limit=${limit}`)
  if (!res.ok) {
    throw new Error('Could not reach the address search service. Check your connection and try again.')
  }
  return parseSuggestions(await res.json())
}

/**
 * Reverse geocode coordinates to an address (used after "use current location"
 * to fill the Address/City fields). Returns null when nothing is found.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<AddressSuggestion | null> {
  const res = await fetch(`${GEOCODE_URL}?lat=${latitude}&lon=${longitude}`)
  if (!res.ok) return null
  return parseSuggestions(await res.json())[0] ?? null
}

function parseSuggestions(data: any): AddressSuggestion[] {
  const results = Array.isArray(data?.results) ? data.results : []
  return results
    .filter((r: any) => r && r.latitude != null && r.longitude != null)
    .map((r: any) => ({
      latitude: Number(r.latitude),
      longitude: Number(r.longitude),
      formatted_address: r.formatted_address ?? '',
      city: r.city ?? '',
    }))
}

/** Shape operating hours for the backend, deriving the overnight flag. */
export function buildOperatingHours(hours: DayHours[]) {
  return hours.map((d) => ({
    day: d.day,
    is_closed: d.is_closed,
    opening_time: d.is_closed ? '00:00' : d.opening_time,
    closing_time: d.is_closed ? '00:00' : d.closing_time,
    // Crosses midnight when the close time is earlier than the open time.
    is_overnight: !d.is_closed && d.closing_time < d.opening_time,
  }))
}

/** Build the multipart payload for creating the laundry profile. */
export function buildLaundryFormData(
  values: SetupFormValues,
  hours: DayHours[],
  image: File | null,
): FormData {
  const fd = new FormData()
  fd.append('name', values.name)
  fd.append('description', values.description)
  fd.append('phone_number', values.phone_number)
  fd.append('address', values.address)
  fd.append('city', values.city)
  fd.append('latitude', values.latitude)
  fd.append('longitude', values.longitude)
  fd.append('pricing_model', values.pricing_model)
  fd.append('price_range', values.price_range)
  fd.append('estimated_delivery_hours', values.estimated_delivery_hours)
  fd.append('delivery_fee', values.delivery_fee)
  fd.append('pickup_fee', values.pickup_fee)
  fd.append('min_order', values.min_order)
  fd.append('service_radius_km', values.service_radius_km)
  fd.append('is_eco_friendly', String(values.is_eco_friendly))
  fd.append('ironing_available', String(values.ironing_available))
  if (image) fd.append('image', image)
  fd.append('operating_hours', JSON.stringify(buildOperatingHours(hours)))
  return fd
}

export async function createLaundry(formData: FormData): Promise<void> {
  await apiPost(MY_LAUNDRY_URL, formData)
}

/**
 * Upsert the weight-based tariff (singleton resource; requires the laundry).
 *
 * The onboarding UI collects weight tiers ("20 kg → GH₵ 160"), but the backend
 * currently stores a single per-kg rate. Until it supports tiers natively, we
 * derive: per-kg rate from the smallest tier, minimum charge / minimum weight
 * from that same tier.
 */
export async function saveWeightPricing(
  values: SetupFormValues,
  tiers: WeightTier[],
): Promise<void> {
  const validTiers = tiers
    .map((t) => ({ kg: Number(t.weight_kg), price: Number(t.price) }))
    .filter((t) => t.kg > 0 && t.price > 0)
    .sort((a, b) => a.kg - b.kg)

  const smallest = validTiers[0]
  if (!smallest) throw new Error('Add at least one weight tier with a price.')

  await apiPut(WEIGHT_PRICING_URL, {
    base_price_per_kg: (smallest.price / smallest.kg).toFixed(2),
    minimum_charge: smallest.price.toFixed(2),
    minimum_order_weight_kg: smallest.kg.toFixed(2),
    rounding_strategy: values.rounding_strategy || 'NONE',
    is_active: true,
  })
}

/**
 * Create per-item catalog entries. Each item is POSTed once; keys already in
 * `alreadyCreated` are skipped so a retry after a mid-batch failure doesn't
 * duplicate them. Mutates `alreadyCreated` as items succeed.
 *
 * The backend enforces unique item names per laundry, but the same garment may
 * be priced under several service types (e.g. "Shirt" wash-only vs wash+iron),
 * so names repeated across categories get the service appended.
 */
export async function savePriceItems(
  items: PriceItem[],
  alreadyCreated: Set<string>,
): Promise<void> {
  const validItems = items
    .map((it, i) => ({ ...it, display_order: i }))
    .filter((it) => it.item_name.trim() && MONEY_RE.test(it.unit_price))

  // Names used by more than one service type need disambiguation.
  const nameCounts = new Map<string, number>()
  for (const it of validItems) {
    const name = it.item_name.trim().toLowerCase()
    nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1)
  }

  for (const it of validItems) {
    const baseName = it.item_name.trim()
    const isDuplicated = (nameCounts.get(baseName.toLowerCase()) ?? 0) > 1
    const itemName =
      isDuplicated && it.category ? `${baseName} (${it.category})` : baseName
    const key = itemName.toLowerCase()
    if (alreadyCreated.has(key)) continue
    await apiPost(PRICING_ITEMS_URL, {
      item_name: itemName,
      category: it.category || '',
      unit_price: it.unit_price,
      display_order: it.display_order,
      is_active: true,
    })
    alreadyCreated.add(key)
  }
}

/** Turn an API error into a user-facing message, with retry context. */
export function formatSubmitError(err: any, laundryCreated: boolean): string {
  let msg = err?.message || 'Failed to create business profile.'
  if (err?.data && typeof err.data === 'object') {
    const firstKey = Object.keys(err.data)[0]
    if (firstKey && Array.isArray(err.data[firstKey])) {
      msg = `${firstKey}: ${err.data[firstKey][0]}`
    }
  }
  if (laundryCreated) {
    msg = `Your business was saved, but some pricing details didn't go through: ${msg} Press “Complete Registration” to retry.`
  }
  return msg
}
