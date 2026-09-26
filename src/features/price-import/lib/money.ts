/**
 * Decimal-safe money helpers. Prices travel as strings ("15", "15.50") and are
 * compared as integer pesewas, never through float arithmetic, so "15" can
 * never become "1500" and "15.50" stays exact.
 */

const MONEY_RE = /^\d{1,6}(\.\d{1,2})?$/

export const isValidMoney = (value: string): boolean => MONEY_RE.test(value.trim())

/** "15" → 1500, "15.5" → 1550, "15.50" → 1550. Null if not a valid amount. */
export function toPesewas(value: string | null | undefined): number | null {
  if (value == null) return null
  const v = String(value).trim()
  if (!MONEY_RE.test(v)) return null
  const [whole, frac = ''] = v.split('.')
  return Number(whole) * 100 + Number((frac + '00').slice(0, 2))
}

/** Canonical two-decimal string for display/submission: "15" → "15.00". */
export function normalizeMoney(value: string | null | undefined): string {
  const p = toPesewas(value ?? null)
  if (p == null) return (value ?? '').toString().trim()
  return `${Math.floor(p / 100)}.${String(p % 100).padStart(2, '0')}`
}

export const sameMoney = (a: string | null | undefined, b: string | null | undefined) => {
  const pa = toPesewas(a ?? null)
  const pb = toPesewas(b ?? null)
  return pa != null && pa === pb
}

export const formatGhs = (value: string | null | undefined) =>
  value == null || value === '' ? '—' : `GH₵${normalizeMoney(value)}`
