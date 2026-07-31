import { apiPost, apiGet, apiPatch } from '@/shared/api/client'
import { User, LoginRequest, LoginResponse, RegisterRequest } from '@/shared/interfaces'

/**
 * Login with email and password via Secure Next.js API
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  const data = await res.json().catch(() => ({ message: 'Invalid response from server' }))

  if (!res.ok) {
    throw new Error(data.message || data.detail || `Login failed (HTTP ${res.status})`)
  }

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
 * Get current user profile (silent — no session-expired toast on public pages).
 */
export async function getCurrentUser(): Promise<User> {
  const result = await apiGet<any>('/auth/me/', { silentAuth: true })
  const actualData = result.data || result
  return actualData.user || actualData
}

/** Clear HttpOnly auth cookies via BFF (does not require backend). */
export async function clearAuthCookies(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch {
    // ignore
  }
}

/**
 * Logout — clear cookies first; backend logout is best-effort.
 * A backend failure here is non-fatal (cookies are already cleared), so we
 * swallow it quietly rather than console.error — which would trip the
 * Next.js dev error overlay for an expected, harmless case.
 */
export async function logout(): Promise<void> {
  await clearAuthCookies()
  try {
    await apiPost('/auth/logout/')
  } catch {
    // Tokens may already be invalid
  }
}

export async function hasOwnerRole(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user.role === 'OWNER'
  } catch {
    return false
  }
}

export async function forgotPassword(email: string): Promise<void> {
  await apiPost('/auth/forgot-password/', { email })
}

export async function resetPassword(
  token: string,
  new_password: string,
): Promise<void> {
  await apiPost('/auth/reset-password/', { token, new_password })
}

export async function updateProfile(data: {
  first_name?: string
  last_name?: string
  phone?: string
}): Promise<User> {
  const result = await apiPatch<{ user: User } | User>('/auth/me/', data)
  const actualData = (result as { user?: User }).user ?? result
  return actualData as User
}
