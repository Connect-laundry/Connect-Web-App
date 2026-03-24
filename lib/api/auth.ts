import { apiPost, apiGet, setToken, setRefreshToken, clearTokens } from './client'
import { LoginRequest, LoginResponse, User, RegisterRequest } from '@/lib/types'

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiPost<LoginResponse>('/auth/login', credentials)

  // Store tokens
  setToken(response.access)
  setRefreshToken(response.refresh)

  return response
}

/**
 * Register a new owner account
 */
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const response = await apiPost<LoginResponse>('/auth/register', data)

  // Store tokens
  setToken(response.access)
  setRefreshToken(response.refresh)

  return response
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  return apiGet<User>('/auth/me')
}

/**
 * Logout - clear tokens and call backend if needed
 */
export async function logout(): Promise<void> {
  try {
    await apiPost('/auth/logout')
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    clearTokens()
  }
}

/**
 * Check if user has OWNER role
 */
export async function hasOwnerRole(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user.role === 'OWNER'
  } catch (error) {
    return false
  }
}
