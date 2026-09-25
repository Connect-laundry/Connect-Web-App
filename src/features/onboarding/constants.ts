import { WashingMachine, Sparkles, Layers } from 'lucide-react'

/**
 * Service categories — each is a tab holding its own item list. An item's
 * service type is stored in the free-form `category` field on
 * LaundryPricingItem, so the same garment can be priced per service
 * (e.g. Shirt: wash-only GH₵8, wash+iron GH₵12).
 */
export const SERVICE_CATEGORIES = [
  { value: 'Wash Only', label: 'Wash only', icon: WashingMachine },
  { value: 'Wash & Iron', label: 'Wash + ironing', icon: Layers },
  { value: 'Iron Only', label: 'Ironing only', icon: Sparkles },
] as const

/** Common garments offered in the picker so owners don't type each name. */
export const COMMON_ITEMS = [
  'Shirt',
  'T-Shirt',
  'Trousers',
  'Jeans',
  'Shorts',
  'Dress',
  'Skirt',
  'Suit (2-piece)',
  'Suit (3-piece)',
  'Kaba & Slit',
  'Smock',
  'Jacket',
  'Sweater',
  'Bedsheet',
  'Duvet',
  'Pillowcase',
  'Blanket',
  'Curtains',
  'Towel',
  'Underwear',
  'Socks',
  'Sneakers',
] as const

/** Sentinel value for the "Other… (type your own)" option in the item picker. */
export const OTHER = '__other__'
