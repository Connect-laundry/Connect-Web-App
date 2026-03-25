import { apiPost, apiGet, setToken, setRefreshToken, clearTokens } from '@/shared/api/client'
import { LoginRequest, LoginResponse, User, RegisterRequest } from '@/shared/types'

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiPost<any>('/auth/login/', credentials)

  // Handle both key formats: access/refresh and accessToken/refreshToken
  const accessToken = response.access || response.accessToken
  const refreshToken = response.refresh || response.refreshToken

  // Store tokens
  setToken(accessToken)
  setRefreshToken(refreshToken)

  return { access: accessToken, refresh: refreshToken, user: response.user }
}

/**
 * Register a new owner account
 */
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const response = await apiPost<any>('/auth/register/', data)

  // Handle both key formats: access/refresh and accessToken/refreshToken
  const accessToken = response.access || response.accessToken
  const refreshToken = response.refresh || response.refreshToken

  // Store tokens
  setToken(accessToken)
  setRefreshToken(refreshToken)

  return { access: accessToken, refresh: refreshToken, user: response.user }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiGet<any>('/auth/me/')
  // Backend may wrap user data in a 'user' key or return flat
  return response.user || response
}

/**
 * Logout - clear tokens and call backend if needed
 */
export async function logout(): Promise<void> {
  try {
    await apiPost('/auth/logout/')
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
