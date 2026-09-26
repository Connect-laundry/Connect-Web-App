/**
 * Owner-facing copy. Never mention AI providers, models, status codes or
 * technical terms. Unknown codes fall back to a generic "please check".
 */

const WARNING_TEXT: Record<string, string> = {
  MISSING_PRICE: "We couldn't read this price.",
  PRICE_UNREADABLE: "We couldn't read this price.",
  MISSING_NAME: "We couldn't read this service name.",
  PRICING_METHOD_UNKNOWN: 'Is this priced per item or per kg?',
  PRICING_METHOD_CONFLICT: 'Is this priced per item or per kg?',
  PRICE_PROVIDER_DISAGREEMENT: 'Please double-check this price against your list.',
  PRICE_NOT_CONFIRMED: 'Please double-check this price against your list.',
  PRICE_NOT_IN_SOURCE_TEXT: 'Please double-check this price against your list.',
  AMBIGUOUS_PAIRING: "We weren't sure which price belongs to this service.",
  SERVICE_NAME_MISMATCH: 'Please check the service name.',
  SUSPICIOUS_PRICE: 'This price is unusually high.',
  ZERO_PRICE: 'The price is 0. Is that right?',
  AMBIGUOUS_DECIMAL_SEPARATOR: 'Check the decimal point (for example 15.50).',
  CROSSED_OUT_PRICE: 'A crossed-out price was ignored. Check the new one.',
  DISCOUNTED_PRICE: 'A promo price was shown. We used the regular price.',
  PACKAGE_PRICE: 'This looks like a bundle price.',
  DUPLICATE_ROW: 'This service appears more than once.',
  CONFLICTING_DUPLICATE: 'This service appears more than once with different prices.',
  MULTIPLE_PER_KG_RATES: 'Your laundry can have one per-kg price. Keep one.',
  EXISTING_ITEM_MATCH: 'You may already have this service.',
  POSSIBLE_MATCH: 'You may already have this service.',
  SUSPICIOUS_TEXT: "This doesn't look like a laundry service.",
  FOREIGN_CURRENCY: 'This price may not be in cedis.',
  HANDWRITTEN: 'Handwritten. Please check.',
  PARTIALLY_OBSCURED: 'Part of this line was hard to see.',
}

/** Internal codes that carry no owner-useful meaning of their own. */
const SILENT = new Set(['PARSED_FROM_OCR_TEXT', 'PRICING_METHOD_INFERRED', 'LOW_CONFIDENCE', 'PRICE_FIELD_MOVED'])

export function warningText(code: string): string | null {
  if (SILENT.has(code)) return null
  return WARNING_TEXT[code] ?? 'Please check this row.'
}

export function uniqueWarningTexts(codes: string[]): string[] {
  const out: string[] = []
  for (const code of codes) {
    const text = warningText(code)
    if (text && !out.includes(text)) out.push(text)
  }
  return out
}

export const DOC_NOTES: Record<string, string> = {
  EXTRA_PRICE: 'Some prices on your list may not have been matched to a service. Please check nothing is missing.',
  FALLBACK_TEXT_PARSER_USED: 'This list was hard to read, so please check every row.',
  BLURRY: 'The photo looks blurry. Please check carefully.',
  GLARE: 'There is glare on the photo. Please check carefully.',
  CROPPED: 'Part of the list may be cut off. Please check nothing is missing.',
  NOT_A_PRICE_LIST: "This doesn't look like a price list.",
}

export const READER_UNAVAILABLE =
  'The price-list reader is temporarily unavailable. You can continue entering prices manually.'
export const COULD_NOT_READ = "We couldn't read this image clearly. Try another photo."

/** Map any scan failure code to plain owner copy. */
export function scanErrorText(code: string, serverMessage?: string): string {
  switch (code) {
    case 'COULD_NOT_READ_IMAGE':
    case 'NO_PRICES_FOUND':
    case 'INVALID_IMAGE':
    case 'IMAGE_TOO_SMALL':
      return COULD_NOT_READ
    case 'UNSUPPORTED_FILE':
    case 'EMPTY_FILE':
      return serverMessage && !/http|\d{3}/i.test(serverMessage)
        ? serverMessage
        : 'Please choose a photo (JPEG, PNG or WebP).'
    case 'FILE_TOO_LARGE':
    case 'HTTP_413':
    case 'IMAGE_DIMENSIONS_TOO_LARGE':
      return 'This photo is too large. Please choose a smaller one.'
    case 'DAILY_LIMIT_REACHED':
      return "You've reached today's limit for scanning price lists. You can continue entering prices manually."
    case 'IMPORT_IN_PROGRESS':
      return 'A price list is already being read. Please wait a moment and try again.'
    case 'SERVER_BUSY':
      return 'The price-list reader is busy. Please try again in a minute, or continue entering prices manually.'
    case 'CANCELLED':
      return ''
    default:
      return READER_UNAVAILABLE
  }
}
