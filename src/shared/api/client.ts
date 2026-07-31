import { type ApiError as _ApiError } from '@/shared/interfaces'
import { notifySessionExpired } from '@/features/auth/lib/session-expired'
import { refreshAccessToken } from '@/shared/api/token-refresh'

// For client-side requests, hit the internal proxy
const BASE_URL = '/api/proxy'

export class SessionExpiredError extends Error {
  constructor(message = 'Session expired. Please log in again.') {
    super(message)
    this.name = 'SessionExpiredError'
  }
}

export type ApiRequestOptions = RequestInit & {
  /** No toast/redirect when refresh fails (e.g. hydrate on public pages). */
  silentAuth?: boolean
}

/**
 * Main API client function routing through BFF proxy
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { silentAuth, ...fetchOptions } = options
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
      ...fetchOptions,
      headers,
    })

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[connectlaundry.app] API Connectivity Error:', error.message)
    }
    throw new Error(`Connection failed. Please check your internet or try again later.`)
  }

  if (response.status === 401) {
    // Attempt auto-refresh using the secure HttpOnly refresh token. All
    // concurrent 401s share ONE refresh (see refreshAccessToken) to avoid
    // racing the backend's single-use rotating refresh tokens.
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      // Retry the original request with the freshly rotated access cookie.
      const retryResponse = await fetch(url, { ...fetchOptions, headers })
      if (retryResponse.status === 401) {
        if (!silentAuth) notifySessionExpired()
        throw new SessionExpiredError()
      }
      return handleResponse<T>(retryResponse)
    }
    if (!silentAuth) notifySessionExpired()
    throw new SessionExpiredError()
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
export async function apiGet<T = any>(
  endpoint: string,
  options?: Pick<ApiRequestOptions, 'silentAuth'>,
): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET', ...options })
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
