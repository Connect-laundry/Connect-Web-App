import { apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { unwrap, unwrapList, unwrapPaginated } from '@/shared/api/unwrap'

export interface AppNotification {
  id: string
  title: string
  body: string
  is_read: boolean
  created_at: string
  notification_type?: string
}

export interface NotificationPreferences {
  email_enabled: boolean
  push_enabled: boolean
  sms_enabled: boolean
}

export async function getNotifications(params?: { is_read?: boolean }) {
  const query = new URLSearchParams()
  if (params?.is_read != null) query.set('is_read', String(params.is_read))
  const response = await apiGet<any>(`/support/notifications/${query.toString() ? `?${query}` : ''}`)
  const page = unwrapPaginated<AppNotification>(response)
  const data = unwrap<any>(response)
  return {
    ...page,
    unread_count: data?.unread_count ?? 0,
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await apiGet<any>('/support/notifications/unread-count/')
  return unwrap<any>(response)?.unread_count ?? response?.unread_count ?? 0
}

export async function markNotificationRead(id: string): Promise<AppNotification> {
  const response = await apiPatch<any>(`/support/notifications/${id}/mark-read/`)
  return unwrap<AppNotification>(response)
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiPost('/support/notifications/mark-all-read/')
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await apiGet<any>('/support/notifications/preferences/')
  return unwrap<NotificationPreferences>(response)
}

export async function updateNotificationPreferences(
  data: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const response = await apiPatch<any>('/support/notifications/preferences/', data)
  return unwrap<NotificationPreferences>(response)
}

export async function submitFeedback(data: {
  subject: string
  message: string
  category?: string
}): Promise<void> {
  await apiPost('/support/help/feedback/', data)
}

export async function getFaqs() {
  const response = await apiGet<any>('/support/faqs/')
  return unwrapList<any>(response)
}

export async function getLegalDocuments() {
  const response = await apiGet<any>('/support/legal/')
  return unwrapList<any>(response)
}

export async function getLegalDocument(type: string) {
  const response = await apiGet<any>(`/support/legal/${type}/`)
  return unwrap<any>(response)
}
