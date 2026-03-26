import { ApiError } from '@/shared/types'

// External backend API base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connect-full-backend.onrender.com/api/v1'

/**
 * Get the JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

/**
 * Set the JWT token in localStorage
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('access_token', token)
}

/**
 * Set the refresh token in localStorage
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('refresh_token', token)
}

/**
 * Get the refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

/**
 * Clear all auth tokens
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

/**
 * Main API client function with JWT interceptor
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  // Add JWT token to Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }



  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })

  } catch (error: any) {
    console.error('[connectlaundry.app] Fetch Error:', error.message)
    throw new Error(`Failed to connect to API: ${error.message}. Please check if the backend is running and CORS is enabled.`)
  }

  // Handle token expiration (401)
  if (response.status === 401) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        const newToken = await refreshAccessToken(refreshToken)
        if (newToken) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${newToken}`
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          })
          return handleResponse<T>(retryResponse)
        }
      } catch (error) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          clearTokens()
          window.location.href = '/auth/login'
        }
        throw new Error('Session expired. Please log in again.')
      }
    } else {
      // No refresh token available, redirect to login
      if (typeof window !== 'undefined') {
        clearTokens()
        window.location.href = '/auth/login'
      }
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
    const error: ApiError = data || {}
    const message = error.detail || error.error || `HTTP ${response.status}`
    const apiError = new Error(message) as Error & { status?: number }
    apiError.status = response.status
    throw apiError
  }

  return data as T
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      setToken(data.access)
      return data.access
    }

    return null
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
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
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * Type-safe PATCH request
 */
export async function apiPatch<T = any>(endpoint: string, data?: any): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * Type-safe PUT request
 */
export async function apiPut<T = any>(endpoint: string, data?: any): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * Type-safe DELETE request
 */
export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' })
}
