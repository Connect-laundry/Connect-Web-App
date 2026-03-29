import { apiPost, apiGet } from '@/shared/api/client'
import { LoginRequest, LoginResponse, User, RegisterRequest } from '@/shared/types'

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
 * Register a new owner account via Secure Next.js API
 */
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  await apiPost<any>('/auth/register/', {
    ...data,
    role: data.role || 'OWNER',
  })
  
  // After successful registration, log them in automatically using the secure route
  return await login({ email: data.email, password: data.password })
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
    // Optional: Call actual backend logout via proxy first
    await apiPost('/auth/logout/').catch(console.error)
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
