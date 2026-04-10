import {
  Check,
  Store,
  MapPin,
  CalendarClock,
  Tag,
  ListChecks,
  type LucideIcon,
} from 'lucide-react'
import type { SetupFormValues } from './schema'
import type { DayHours } from './types'

export type StepId = 'business' | 'location' | 'hours' | 'pricing' | 'pricelist' | 'review'

export interface StepMeta {
  id: StepId
  title: string
  icon: LucideIcon
  description: string
}

export const STEP_META: Record<StepId, StepMeta> = {
  business: { id: 'business', title: 'Business Info', icon: Store, description: 'Tell us about your laundry business.' },
  location: { id: 'location', title: 'Location', icon: MapPin, description: 'Where is your laundry located?' },
  hours: { id: 'hours', title: 'Working Hours', icon: CalendarClock, description: 'Set the days and times you operate.' },
  pricing: { id: 'pricing', title: 'Pricing & Delivery', icon: Tag, description: 'Set your pricing and delivery options.' },
  pricelist: { id: 'pricelist', title: 'Price List', icon: ListChecks, description: 'Add the items customers can order.' },
  review: { id: 'review', title: 'Review', icon: Check, description: 'Review your details before submitting.' },
}

/** Form fields validated (via RHF) when leaving a given step. */
export const stepFieldsById: Partial<Record<StepId, (keyof SetupFormValues)[]>> = {
  business: ['name', 'description', 'phone_number'],
  location: ['address', 'city', 'latitude', 'longitude'],
  pricing: [
    'pricing_model', 'price_range', 'estimated_delivery_hours',
    'min_order', 'service_radius_km',
  ],
}

/** The Price List step only applies to item-based pricing models. */
export function buildSteps(showPriceList: boolean): StepMeta[] {
  const ids: StepId[] = ['business', 'location', 'hours', 'pricing']
  if (showPriceList) ids.push('pricelist')
  ids.push('review')
  return ids.map((id) => STEP_META[id])
}

export const usesWeightPricing = (model: string) => model === 'BY_WEIGHT' || model === 'HYBRID'
export const usesItemPricing = (model: string) => model === 'BY_ITEM' || model === 'HYBRID'

export const defaultHours: DayHours[] = [
  { day: 1, label: 'Monday', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
  { day: 2, label: 'Tuesday', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
  { day: 3, label: 'Wednesday', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
  { day: 4, label: 'Thursday', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
  { day: 5, label: 'Friday', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
  { day: 6, label: 'Saturday', is_closed: false, opening_time: '09:00', closing_time: '16:00' },
  { day: 7, label: 'Sunday', is_closed: true, opening_time: '00:00', closing_time: '00:00' },
]
