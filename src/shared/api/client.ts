import { type ApiError as _ApiError } from '@/shared/interfaces'

// For client-side requests, hit the internal proxy
const BASE_URL = '/api/proxy'

// Single in-flight refresh shared by all concurrent callers.
//
// The backend rotates refresh tokens and blacklists the old one on first use
// (SIMPLE_JWT ROTATE_REFRESH_TOKENS + BLACKLIST_AFTER_ROTATION). If several
// requests 401 at once (e.g. the dashboard loading stats + earnings + orders),
// each firing its own refresh would race: the first rotates the token, the rest
// send the now-blacklisted token and fail — and a failed refresh clears the
// session cookies, destroying the session the first refresh just renewed.
//
// Coalescing every concurrent 401 onto ONE refresh call fixes the race: only a
// single token is ever exchanged, everyone else awaits the same result.
let refreshPromise: Promise<boolean> | null = null

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', { method: 'POST' })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

/**
 * Main API client function routing through BFF proxy
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure endpoint starts with slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${BASE_URL}${normalizedEndpoint}`

  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[connectlaundry.app] API Connectivity Error:', error.message)
    }
    throw new Error(`Connection failed. Please check your internet or try again later.`)
  }

  // Handle token expiration (401)
  if (response.status === 401) {
    // Attempt auto-refresh using the secure HttpOnly refresh token. All
    // concurrent 401s share ONE refresh (see refreshSession) to avoid racing
    // the backend's single-use rotating refresh tokens.
    const refreshed = await refreshSession()
    if (refreshed) {
      // Retry the original request with the freshly rotated access cookie.
      const retryResponse = await fetch(url, { ...options, headers })
      return handleResponse<T>(retryResponse)
    }
    // Refresh genuinely failed (token expired/invalid). Don't force a redirect
    // here — it causes loops on auth pages; middleware/protected routes handle it.
    throw new Error('Session expired. Please log in again.')
  }

  return handleResponse<T>(response)
}

/**
 * Handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  let data: any

  if (contentType?.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    let message = `HTTP ${response.status}`

    // Generic backend wrappers that carry no useful detail on their own. When the
    // message is one of these, prefer the field-level errors in `data.data`.
    const GENERIC_MESSAGES = new Set(['Validation failed.', 'An error occurred.'])

    const fieldError = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null
      const key = Object.keys(obj)[0]
      if (!key) return null
      const val = obj[key]
      if (Array.isArray(val)) return `${key}: ${val[0]}`
      if (typeof val === 'string') return `${key}: ${val}`
      return null
    }

    if (response.status === 502) {
      message = 'Backend server is starting up or temporarily offline. Retrying connection...'
    } else if (data && typeof data === 'object') {
      // Field errors take priority over generic wrapper messages so the user sees
      // the actual reason (e.g. "email: This field must be unique.").
      const detail = fieldError(data.data) || fieldError(data)
      if (data.message && !GENERIC_MESSAGES.has(data.message)) {
        message = data.message
      } else if (detail) {
        message = detail
      } else if (data.error) {
        message = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
      } else if (data.detail) {
        message = data.detail
      } else if (data.message) {
        message = data.message
      }
    }

    const apiError = new Error(message) as Error & { status?: number, data?: any }
    apiError.status = response.status
    apiError.data = data
    throw apiError
  }

  return data as T
}

/**
 * Type-safe GET request
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET' })
}

/**
 * Type-safe POST request
 */
export async function apiPost<T = any>(endpoint: string, data?: any): Promise<T> {
  const isBodyRaw = data instanceof FormData || typeof data === 'string'
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: data ? (isBodyRaw ? data : JSON.stringify(data)) : undefined,
  })
}

/**
 * Type-safe PATCH request
 */
export async function apiPatch<T = any>(endpoint: string, data?: any): Promise<T> {
  const isBodyRaw = data instanceof FormData || typeof data === 'string'
  return apiClient<T>(endpoint, {
    method: 'PATCH',
    body: data ? (isBodyRaw ? data : JSON.stringify(data)) : undefined,
  })
}

/**
 * Type-safe PUT request
 */
export async function apiPut<T = any>(endpoint: string, data?: any): Promise<T> {
  const isBodyRaw = data instanceof FormData || typeof data === 'string'
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: data ? (isBodyRaw ? data : JSON.stringify(data)) : undefined,
  })
}

/**
 * Type-safe DELETE request
 */
export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' })
}
