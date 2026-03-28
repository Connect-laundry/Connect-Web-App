import { ApiError } from '@/shared/types'

// For client-side requests, hit the internal proxy
const BASE_URL = '/api/proxy'

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
    // Attempt auto-refresh using the secure HttpOnly refresh token
    try {
      const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' })
      if (refreshRes.ok) {
        // Retry the original request
        const retryResponse = await fetch(url, { ...options, headers })
        return handleResponse<T>(retryResponse)
      } else {
        throw new Error('Refresh failed')
      }
    } catch (refError) {
      // Don't force redirect here, as it causes loops on auth pages.
      // The middleware or protected routes will handle redirection if needed.
      throw new Error('Session expired. Please log in again.')
    }
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
