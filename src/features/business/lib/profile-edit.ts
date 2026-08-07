import type { Laundry } from '@/shared/interfaces'

export interface ProfileDraft {
  name: string
  description: string
  phone_number: string
  address: string
  city: string
  estimated_delivery_hours: string
  service_radius_km: string
  min_order: string
  express_available: boolean
  express_delivery_hours: string
  express_surcharge_percent: string
  is_eco_friendly: boolean
  ironing_available: boolean
}

export function toProfileDraft(laundry: Laundry): ProfileDraft {
  return {
    name: laundry.name ?? '',
    description: laundry.description ?? '',
    phone_number: laundry.phone_number ?? '',
    address: laundry.address ?? '',
    city: laundry.city ?? '',
    estimated_delivery_hours: String(laundry.estimated_delivery_hours ?? ''),
    service_radius_km: String(laundry.service_radius_km ?? ''),
    min_order: String(laundry.min_order ?? ''),
    express_available: Boolean(laundry.express_available),
    express_delivery_hours: laundry.express_delivery_hours == null ? '' : String(laundry.express_delivery_hours),
    express_surcharge_percent: laundry.express_surcharge_percent == null ? '' : String(laundry.express_surcharge_percent),
    is_eco_friendly: Boolean(laundry.is_eco_friendly),
    ironing_available: Boolean(laundry.ironing_available),
  }
}

export function validateProfileDraft(draft: ProfileDraft): string | null {
  if (!draft.name.trim()) return 'Business name is required.'
  if (!draft.phone_number.trim()) return 'Phone number is required.'
  if (draft.express_available && (!draft.express_delivery_hours || Number(draft.express_delivery_hours) <= 0)) {
    return 'Enter the express turnaround in hours.'
  }
  if (draft.express_available && (!draft.express_surcharge_percent || Number(draft.express_surcharge_percent) <= 0)) {
    return 'Enter the express extra charge as a percentage.'
  }
  return null
}

export function buildProfilePayload(draft: ProfileDraft): Record<string, unknown> {
  return {
    ...draft,
    express_delivery_hours: draft.express_available ? draft.express_delivery_hours : null,
    express_surcharge_percent: draft.express_available ? draft.express_surcharge_percent : null,
  }
}
