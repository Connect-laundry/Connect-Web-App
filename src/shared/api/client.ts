import { type ApiError as _ApiError } from '@/shared/types'
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
    const refreshed = await refreshAccessToken()
    if (refreshed) {
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
    
    if (data && typeof data === 'object') {
      if (data.message && data.message !== 'Validation failed.') {
        message = data.message
      } else if (data.error) {
        message = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
      } else if (data.detail) {
        message = data.detail
      } else if (data.data) {
        const firstErrorKey = Object.keys(data.data)[0]
        if (firstErrorKey && Array.isArray(data.data[firstErrorKey])) {
          message = `${firstErrorKey}: ${data.data[firstErrorKey][0]}`
        }
      } else {
        const firstErrorKey = Object.keys(data)[0]
        if (firstErrorKey && Array.isArray(data[firstErrorKey])) {
          message = `${firstErrorKey}: ${data[firstErrorKey][0]}`
        }
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
