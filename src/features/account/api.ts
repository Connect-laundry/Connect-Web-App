import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap, unwrapList } from '@/shared/api/unwrap'
import { User } from '@/shared/types'

export interface ActiveSession {
  id: string
  device_name?: string
  ip_address?: string
  last_active?: string
  is_current?: boolean
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await apiPatch<any>('/auth/me/', data)
  const payload = unwrap<any>(response)
  return payload.user ?? payload
}

export async function deleteAccount(): Promise<void> {
  await apiDelete('/auth/account/')
}

export async function getActiveSessions(): Promise<ActiveSession[]> {
  const response = await apiGet<any>('/auth/sessions/')
  return unwrapList<ActiveSession>(response)
}

export async function revokeCurrentSession(): Promise<void> {
  await apiPost('/auth/sessions/revoke-current/')
}

export async function revokeAllSessions(): Promise<void> {
  await apiPost('/auth/sessions/revoke-all/')
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiPost('/auth/forgot-password/', { email })
}

export async function resetPassword(data: {
  token: string
  password: string
  password_confirm: string
}): Promise<void> {
  await apiPost('/auth/reset-password/', data)
}

export async function uploadMedia(file: File, purpose?: string): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  if (purpose) formData.append('purpose', purpose)
  const response = await apiPost<any>('/media/upload/', formData)
  return unwrap<{ url: string }>(response)
}

export async function getReferralStats() {
  const response = await apiGet<any>('/referral/stats/')
  return unwrap<any>(response)
}

export async function applyReferralCode(code: string) {
  const response = await apiPost<any>('/referral/apply/', { code })
  return unwrap<any>(response)
}
