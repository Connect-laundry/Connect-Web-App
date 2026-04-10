import { apiPost, apiGet } from '@/shared/api/client'
import { User, LoginRequest, LoginResponse, RegisterRequest } from '@/shared/interfaces'

/**
 * Login with email and password via Secure Next.js API
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // Hit internal Next.js auth endpoint, NOT the backend directly
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  const data = await res.json().catch(() => ({ message: 'Invalid response from server' }))
  
  if (!res.ok) {
    throw new Error(data.message || data.detail || `Login failed (HTTP ${res.status})`)
  }

  // The backend now wraps responses in a { status, message, data } object
  return data.data || data
}

/**
 * Register a new owner account via Secure Next.js API.
 *
 * The register endpoint already returns auth tokens, so this is a single
 * round-trip: the Next route sets the session cookies and returns the user.
 * (Previously this did register + a second login call, which doubled latency.)
 */
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, role: data.role || 'OWNER' }),
  })

  const body = await res.json().catch(() => ({ message: 'Invalid response from server' }))

  if (!res.ok) {
    // Surface the backend's field-level error (e.g. duplicate email) when present.
    const detail = body?.data && typeof body.data === 'object'
      ? (() => {
          const key = Object.keys(body.data)[0]
          const val = key ? body.data[key] : null
          return Array.isArray(val) ? `${key}: ${val[0]}` : null
        })()
      : null
    const apiError = new Error(
      detail || body.message || body.detail || `Registration failed (HTTP ${res.status})`
    ) as Error & { status?: number; data?: any }
    apiError.status = res.status
    apiError.data = body
    throw apiError
  }

  return body.data || body
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const result = await apiGet<any>('/auth/me/')
  // Handle the backend's data wrapper
  const actualData = result.data || result
  return actualData.user || actualData
}

/**
 * Logout - clears server-side HttpOnly cookies and calls backend
 */
export async function logout(): Promise<void> {
  try {
    // Optional: Call actual backend logout via proxy first.
    // A failure here is non-fatal (cookies are cleared below regardless), so we
    // swallow it quietly rather than console.error — which would trip the
    // Next.js dev error overlay for an expected, harmless case.
    await apiPost('/auth/logout/').catch(() => {})
  } finally {
    // Clear local HttpOnly cookies
    await fetch('/api/auth/logout', { method: 'POST' })
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }
}

/**
 * Check if user has OWNER role
 */
export async function hasOwnerRole(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user.role === 'OWNER'
  } catch (_error) {
    return false
  }
}
