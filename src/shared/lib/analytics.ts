import { track } from '@vercel/analytics'

/**
 * Privacy-Safe Conversion Event Tracking
 * Enforces zero-PII data transmission. No customer names, emails,
 * phone numbers, or exact residential addresses are ever passed to analytics.
 */

export type ConversionEvent =
  | 'organic_landing'
  | 'search_laundry'
  | 'view_provider'
  | 'download_app'
  | 'start_booking'
  | 'provider_signup_interest'
  | 'contact_submit'

interface EventPayloadMap {
  organic_landing: {
    path: string
    referrerCategory?: 'search' | 'social' | 'direct' | 'referral'
  }
  search_laundry: {
    queryCategory: string
    city?: string
  }
  view_provider: {
    providerSlug: string
    city: string
  }
  download_app: {
    platform: 'ios' | 'android' | 'pwa'
  }
  start_booking: {
    serviceType: string
    sourcePage: string
  }
  provider_signup_interest: {
    sourceSection: string
  }
  contact_submit: {
    inquiryType: string
  }
}

export function trackEvent<E extends ConversionEvent>(
  event: E,
  properties?: EventPayloadMap[E],
) {
  try {
    if (typeof window !== 'undefined') {
      // Safe dispatch to Vercel Analytics
      track(event, properties as Record<string, string | number | boolean | null>)
    }
  } catch (err) {
    // Analytics failures must never crash client UX
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Analytics] Failed to track ${event}:`, err)
    }
  }
}

export function trackOrganicLanding(path: string) {
  let referrerCategory: 'search' | 'social' | 'direct' | 'referral' = 'direct'
  if (typeof document !== 'undefined' && document.referrer) {
    const ref = document.referrer.toLowerCase()
    if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo') || ref.includes('duckduckgo')) {
      referrerCategory = 'search'
    } else if (ref.includes('instagram') || ref.includes('tiktok') || ref.includes('facebook') || ref.includes('t.co') || ref.includes('twitter') || ref.includes('x.com')) {
      referrerCategory = 'social'
    } else {
      referrerCategory = 'referral'
    }
  }

  trackEvent('organic_landing', { path, referrerCategory })
}

export function trackAppDownload(platform: 'ios' | 'android' | 'pwa') {
  trackEvent('download_app', { platform })
}

export function trackBookingStart(serviceType: string, sourcePage: string) {
  trackEvent('start_booking', { serviceType, sourcePage })
}

export function trackProviderSignupInterest(sourceSection: string) {
  trackEvent('provider_signup_interest', { sourceSection })
}
