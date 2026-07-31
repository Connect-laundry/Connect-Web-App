import { isProtectedAppPath, isPublicPath } from '@/features/auth/lib/public-routes'

export const SESSION_EXPIRED_EVENT = 'connect:session-expired'

let hasNotified = false

export function resetSessionExpiryNotify() {
  hasNotified = false
}

/**
 * Only surface session-expired UX on protected app routes (not landing/login).
 */
export function notifySessionExpired() {
  if (typeof window === 'undefined' || hasNotified) return

  const path = window.location.pathname
  if (isPublicPath(path) || !isProtectedAppPath(path)) return

  hasNotified = true
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
}
