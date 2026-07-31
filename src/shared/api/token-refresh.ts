/**
 * Single in-flight refresh — backend rotates refresh tokens, so parallel
 * 401 handlers must not call /api/auth/refresh at the same time.
 */
let refreshPromise: Promise<boolean> | null = null

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      return res.ok
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/** Refresh access token before JWT expiry (backend default: 10 minutes). */
export const PROACTIVE_REFRESH_MS = 8 * 60 * 1000
