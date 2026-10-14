export const unifiedPricingEnabled = process.env.NEXT_PUBLIC_UNIFIED_PRICING_ENABLED === 'true'
export const PRICING_BASES = { PER_ITEM: 'Per item', PER_KG: 'Per kilogram', WEIGHT_TIER: 'Flat weight bracket', PER_BASKET: 'Per laundry basket', FIXED_PACKAGE: 'Fixed package' } as const
export type PricingBasis = keyof typeof PRICING_BASES
export const SERVICES = { WASH_ONLY: 'Wash Only', IRON_ONLY: 'Iron Only', WASH_AND_IRON: 'Wash & Iron', WASH_AND_FOLD: 'Wash & Fold', DRY_CLEAN: 'Dry Clean', CUSTOM: 'Other service' } as const
export type CatalogService = keyof typeof SERVICES
export type PricingRules = { min_weight_kg?: string; minimum_charge?: string; weight_precision?: string; rounding_strategy?: string; weight_min?: string; weight_max?: string; min_quantity?: string; max_quantity?: string; inclusions?: string[]; exclusions?: string[]; package_description?: string }
export interface BasketDefinition {
  id?: string
  name: string
  description?: string
  capacity_description: string
  max_weight_kg?: string | null
  max_pieces?: number | null
  dimensions?: string
  inclusions?: string[]
  exclusions?: string[]
  overfill_policy: string
  container_requirements?: string
  is_active?: boolean
}
export interface CatalogFields {
  service_type?: CatalogService
  pricing_basis?: PricingBasis
  pricing_rules?: PricingRules
  description?: string
  currency?: string
  basket?: string | null
  basket_details?: BasketDefinition | null
  /** Owner draft only; saved separately and replaced with a basket reference. */
  basket_draft?: BasketDefinition
  revision?: number
}
export function serviceCode(label: string): CatalogService {
  return (Object.keys(SERVICES) as CatalogService[]).find((key) => SERVICES[key] === label) ?? 'CUSTOM'
}
export function catalogProblem(row: CatalogFields): string | null {
  const rules = row.pricing_rules ?? {}
  if (row.pricing_basis === 'PER_BASKET') {
    const basket = row.basket_draft ?? row.basket_details
    if (!basket?.name?.trim() || !basket.capacity_description?.trim()) return 'Describe this basket and its capacity before saving.'
    if (!basket.overfill_policy?.trim()) return 'Explain what happens when laundry exceeds this basket’s capacity.'
    if (basket.max_weight_kg && (!Number.isFinite(Number(basket.max_weight_kg)) || Number(basket.max_weight_kg) <= 0)) return 'Basket maximum weight must be greater than zero.'
    if (basket.max_pieces != null && (!Number.isInteger(basket.max_pieces) || basket.max_pieces <= 0)) return 'Basket piece limit must be a positive whole number.'
  }
  if (row.pricing_basis === 'WEIGHT_TIER' && (rules.weight_min == null || !rules.weight_max || !Number.isFinite(Number(rules.weight_min)) || Number(rules.weight_min) < 0 || Number(rules.weight_max) <= Number(rules.weight_min))) return 'Enter a weight bracket with an upper limit greater than the lower limit.'
  if (row.pricing_basis === 'FIXED_PACKAGE' && !rules.package_description?.trim()) return 'Describe what this package includes.'
  for (const key of ['min_weight_kg', 'minimum_charge', 'min_quantity', 'max_quantity'] as const) {
    if (rules[key] && (!/^\d+(\.\d{1,2})?$/.test(rules[key]) || Number(rules[key]) < 0)) return 'Enter valid positive limits and charges.'
  }
  if (rules.min_quantity && rules.max_quantity && Number(rules.max_quantity) < Number(rules.min_quantity)) return 'Maximum quantity must not be below the minimum.'
  return null
}
export function priceUnit(row: CatalogFields): string {
  switch (row.pricing_basis) {
    case 'PER_KG': return 'per kg'
    case 'PER_BASKET': return 'per laundry basket'
    case 'WEIGHT_TIER': return `for over ${row.pricing_rules?.weight_min ?? '0'}–${row.pricing_rules?.weight_max ?? '?'} kg`
    case 'FIXED_PACKAGE': return 'per package'
    default: return 'per item'
  }
}
