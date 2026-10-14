'use client'

import { Input } from '@/shared/ui/input'
import { PRICING_BASES, SERVICES, serviceCode, type CatalogFields, type BasketDefinition, type PricingBasis, type PricingRules } from '../lib/unified-pricing'

const selectClass = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm'
export function CatalogRuleFields({ value, category, unitPrice, onChange, disabled = false, baskets = [] }: {
  value: CatalogFields; category?: string; unitPrice?: string; onChange: (patch: CatalogFields & { category?: string }) => void; disabled?: boolean; baskets?: BasketDefinition[]
}) {
  const basis = value.pricing_basis ?? 'PER_ITEM'
  const rules = value.pricing_rules ?? {}
  const basket = value.basket_draft ?? value.basket_details ?? { name: '', capacity_description: '', overfill_policy: '' }
  const rule = (patch: PricingRules) => onChange({ pricing_rules: { ...rules, ...patch } })
  const basketChange = (patch: Partial<BasketDefinition>) => onChange({ basket_draft: { ...basket, ...patch } })
  const field = (label: string, current: string, change: (text: string) => void, numeric = false) => <label className="space-y-1 text-sm"><span>{label}</span><Input disabled={disabled} aria-label={label} value={current} inputMode={numeric ? 'decimal' : 'text'} onChange={(event) => change(event.target.value)} /></label>
  return <fieldset disabled={disabled} className="space-y-3">
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="space-y-1 text-sm"><span>Service type</span><select aria-label="Service type" className={selectClass} value={value.service_type ?? serviceCode(category ?? 'Wash Only')} onChange={(event) => { const service = event.target.value as keyof typeof SERVICES; onChange({ service_type: service, category: SERVICES[service] }) }}>{Object.entries(SERVICES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label className="space-y-1 text-sm"><span>Charge by</span><select aria-label="Charge by" className={selectClass} value={basis} onChange={(event) => onChange({ pricing_basis: event.target.value as PricingBasis, pricing_rules: {}, basket: null, basket_draft: undefined, basket_details: null })}>{Object.entries(PRICING_BASES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      {field('Description', value.description ?? '', (description) => onChange({ description }))}
      {field('Included items (comma separated)', (rules.inclusions ?? []).join(', '), (text) => rule({ inclusions: text.split(',').map((v) => v.trim()).filter(Boolean) }))}
      {field('Excluded items (comma separated)', (rules.exclusions ?? []).join(', '), (text) => rule({ exclusions: text.split(',').map((v) => v.trim()).filter(Boolean) }))}
      {basis === 'WEIGHT_TIER' && <>{field('Lower weight, exclusive (kg)', rules.weight_min ?? '', (weight_min) => rule({ weight_min }), true)}{field('Upper weight, inclusive (kg)', rules.weight_max ?? '', (weight_max) => rule({ weight_max }), true)}<p className="text-xs text-muted-foreground sm:col-span-2">The entered price is one flat charge for this bracket, not a per-kilogram rate.</p></>}
      {basis === 'PER_KG' && <>{field('Minimum weight (kg)', rules.min_weight_kg ?? '', (min_weight_kg) => rule({ min_weight_kg }), true)}{field('Minimum charge (GHS)', rules.minimum_charge ?? '', (minimum_charge) => rule({ minimum_charge }), true)}{field('Weight precision (kg)', rules.weight_precision ?? '0.01', (weight_precision) => rule({ weight_precision }), true)}<label className="space-y-1 text-sm"><span>Weight rounding</span><select className={selectClass} aria-label="Weight rounding" value={rules.rounding_strategy ?? 'NONE'} onChange={(event) => rule({ rounding_strategy: event.target.value })}><option value="NONE">No rounding up</option><option value="UP_0_5_KG">Up to the next half kg</option><option value="UP_1_KG">Up to the next whole kg</option></select></label></>}
      {basis === 'FIXED_PACKAGE' && field('Package contents and limits', rules.package_description ?? '', (package_description) => rule({ package_description }))}
    </div>
    {basis === 'PER_BASKET' && <div className="space-y-3 rounded-md border p-3"><div><p className="text-sm font-medium">Define this basket tier</p><p className="text-xs text-muted-foreground">Use one price-list row for each tier, such as Half basket, Full basket, or Extra large.</p></div>{baskets.length > 0 && <label className="block text-sm">Reuse a basket<select aria-label="Reuse a basket" className={selectClass} value={value.basket ?? ''} onChange={(event) => { const selected = baskets.find((item) => item.id === event.target.value); onChange({ basket: selected?.id ?? null, basket_details: selected, basket_draft: selected }) }}><option value="">New basket</option>{baskets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}<div className="grid gap-3 sm:grid-cols-2">
      {field('Basket name', basket.name, (name) => basketChange({ name }))}
      {field('Capacity description', basket.capacity_description, (capacity_description) => basketChange({ capacity_description }))}
      {field('Maximum weight (kg, optional)', basket.max_weight_kg ?? '', (max_weight_kg) => basketChange({ max_weight_kg: max_weight_kg || null }), true)}
      {field('Maximum pieces (optional)', basket.max_pieces?.toString() ?? '', (text) => basketChange({ max_pieces: text ? Number(text) : null }), true)}
      {field('Dimensions (optional)', basket.dimensions ?? '', (dimensions) => basketChange({ dimensions }))}
      {field('Container or pickup requirements', basket.container_requirements ?? '', (container_requirements) => basketChange({ container_requirements }))}
      {field('Overfill policy', basket.overfill_policy, (overfill_policy) => basketChange({ overfill_policy }))}
    </div><div className="rounded-md bg-muted/50 p-3 text-xs"><p className="font-medium">Customer preview</p><p className="mt-1">{basket.name || 'This basket tier'} · GH₵{unitPrice || '—'}</p><p className="mt-1">{basket.capacity_description || 'Add a simple capacity description, such as “about 8 shirts”.'}</p><p className="mt-1">{basket.overfill_policy || 'Explain what happens when the basket is over capacity.'}</p></div><p className="text-xs text-muted-foreground">State your actual capacity. If the basket is overfilled, show the extra charge and ask the customer to approve the revised quote.</p></div>}
  </fieldset>
}

export function CatalogPreview({ items }: { items: Array<CatalogFields & { item_name: string; unit_price: string; category?: string }> }) {
  return <details className="rounded-lg border p-3"><summary className="cursor-pointer text-sm font-medium">Preview customer prices</summary><ul className="mt-3 space-y-3">{items.filter((item) => item.item_name.trim()).map((item, index) => { const basket = item.basket_draft ?? item.basket_details; return <li key={index} className="rounded-md bg-muted/40 p-3 text-sm"><strong>{item.item_name}</strong><p>{item.category} · GHS {item.unit_price || '—'} {priceUnit(item)}</p><p>{item.description}</p>{item.pricing_basis === 'PER_BASKET' && <><p>{basket?.capacity_description}</p>{(basket?.max_pieces || basket?.max_weight_kg) && <p>Limit: {[basket.max_pieces && `${basket.max_pieces} pieces`, basket.max_weight_kg && `${basket.max_weight_kg} kg`].filter(Boolean).join(' or ')}</p>}<p>{basket?.overfill_policy}</p></>}{item.pricing_basis === 'PER_KG' && <p className="text-xs text-muted-foreground">Customers can estimate by garment count and receive the final weight and price for approval at pickup.</p>}<p>{item.pricing_rules?.package_description}</p>{!!item.pricing_rules?.exclusions?.length && <p>Excludes: {item.pricing_rules.exclusions.join(', ')}</p>}</li> })}</ul><p className="mt-3 text-xs text-muted-foreground">Delivery and other applicable fees appear separately at checkout. Prices become visible only when your business is approved.</p></details>
}
import { priceUnit } from '../lib/unified-pricing'
