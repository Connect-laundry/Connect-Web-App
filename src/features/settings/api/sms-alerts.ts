import { apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'

export interface SmsDeliveryItem {
  id: string
  order_id: string
  order_no: string
  kind: string
  status: string
  reason?: string
  created_at: string
  delivered_at?: string | null
}

export interface MerchantSmsSettings {
  available: boolean
  sms_enabled: boolean
  phone_masked: string
  phone_verified: boolean
  verification_method: string
  verified_at: string | null
  pending_phone_masked: string
  pending_expires_at: string | null
  account_phone_masked: string
  recent: SmsDeliveryItem[]
}

export async function getMerchantSmsSettings(): Promise<MerchantSmsSettings> {
  const response = await apiGet<any>('/laundries/dashboard/sms-alerts/')
  return unwrap<MerchantSmsSettings>(response)
}

export async function updateMerchantSmsSettings(data: {
  sms_enabled: boolean
}): Promise<MerchantSmsSettings> {
  const response = await apiPatch<any>('/laundries/dashboard/sms-alerts/', data)
  return unwrap<MerchantSmsSettings>(response)
}

export async function startPhoneVerification(data: {
  phone: string
}): Promise<MerchantSmsSettings> {
  const response = await apiPost<any>('/laundries/dashboard/sms-alerts/verify/start/', data)
  return unwrap<MerchantSmsSettings>(response)
}

export async function confirmPhoneVerification(data: {
  code: string
}): Promise<MerchantSmsSettings> {
  const response = await apiPost<any>('/laundries/dashboard/sms-alerts/verify/confirm/', data)
  return unwrap<MerchantSmsSettings>(response)
}

export async function adoptAccountPhone(): Promise<MerchantSmsSettings> {
  const response = await apiPost<any>('/laundries/dashboard/sms-alerts/use-account-phone/')
  return unwrap<MerchantSmsSettings>(response)
}

export const useAccountPhone = adoptAccountPhone

export async function sendTestSms(): Promise<MerchantSmsSettings> {
  const response = await apiPost<any>('/laundries/dashboard/sms-alerts/test/')
  return unwrap<MerchantSmsSettings>(response)
}
