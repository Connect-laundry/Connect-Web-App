import * as z from 'zod'
import type { DefaultValues } from 'react-hook-form'
import { MONEY_RE } from './validation'

export const setupSchema = z
  .object({
    name: z.string().min(3, 'Business name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    phone_number: z.string().min(10, 'Valid phone number is required'),
    address: z.string().min(5, 'Full address is required'),
    city: z.string().min(2, 'City is required'),
    latitude: z
      .string()
      .min(1, 'Latitude is required')
      .refine((v) => {
        const n = Number(v)
        return !Number.isNaN(n) && n >= -90 && n <= 90
      }, 'Enter a valid latitude between -90 and 90'),
    longitude: z
      .string()
      .min(1, 'Longitude is required')
      .refine((v) => {
        const n = Number(v)
        return !Number.isNaN(n) && n >= -180 && n <= 180
      }, 'Enter a valid longitude between -180 and 180'),
    pricing_model: z.enum(['BY_ITEM', 'BY_WEIGHT', 'HYBRID'], {
      required_error: 'Please select how you price',
    }),
    price_range: z.enum(['$', '$$', '$$$'], {
      required_error: 'Please select a price range',
    }),
    estimated_delivery_hours: z.string().regex(/^\d+$/, 'Please select a delivery time'),
    // Delivery/pickup fees removed from the onboarding UI; kept in the payload
    // (default '0') because the backend still expects them.
    delivery_fee: z.string().regex(MONEY_RE, 'Invalid amount'),
    pickup_fee: z.string().regex(MONEY_RE, 'Invalid amount'),
    min_order: z.string().regex(MONEY_RE, 'Invalid amount'),
    service_radius_km: z.string().regex(MONEY_RE, 'Invalid radius'),
    is_eco_friendly: z.boolean(),
    ironing_available: z.boolean(),
    // Weight-based tariff. Tiers ("20 kg → GH₵ 160") live in wizard local state
    // (validated via validateWeightTiers); only the rounding strategy is a form
    // field. The legacy fields below are kept for API compatibility.
    base_price_per_kg: z.string().optional().or(z.literal('')),
    minimum_charge: z.string().optional().or(z.literal('')),
    minimum_order_weight_kg: z.string().optional().or(z.literal('')),
    rounding_strategy: z.enum(['NONE', 'UP_0_5_KG', 'UP_1_KG']).optional(),
    image: z.any().optional(),
  })

export type SetupFormValues = z.infer<typeof setupSchema>

export const formDefaults: DefaultValues<SetupFormValues> = {
  name: '',
  description: '',
  phone_number: '',
  address: '',
  city: '',
  latitude: '',
  longitude: '',
  pricing_model: 'BY_ITEM',
  price_range: '$$',
  estimated_delivery_hours: '24',
  delivery_fee: '0',
  pickup_fee: '0',
  min_order: '0',
  service_radius_km: '5',
  is_eco_friendly: false,
  ironing_available: false,
  base_price_per_kg: '',
  minimum_charge: '0',
  minimum_order_weight_kg: '',
  rounding_strategy: 'NONE',
}
