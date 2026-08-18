import { apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { Notification } from '@/shared/types'

export interface NotificationsListResponse {
  count: number
  unread_count: number
  results: Notification[]
  next?: string | null
  previous?: string | null
}

function normalizeList(response: unknown): NotificationsListResponse {
  const raw = response as Record<string, unknown>
  if (raw?.results && Array.isArray(raw.results)) {
    return {
      count: (raw.count as number) ?? raw.results.length,
      unread_count: (raw.unread_count as number) ?? 0,
      results: raw.results as Notification[],
      next: raw.next as string | null,
      previous: raw.previous as string | null,
    }
  }
  const data = raw?.data as NotificationsListResponse | undefined
  if (data?.results) {
    return {
      count: data.count ?? data.results.length,
      unread_count: data.unread_count ?? (raw.unread_count as number) ?? 0,
      results: data.results,
      next: data.next,
      previous: data.previous,
    }
  }
  return { count: 0, unread_count: 0, results: [] }
}

export async function getNotifications(params?: {
  page?: number
  page_size?: number
  is_read?: boolean
}): Promise<NotificationsListResponse> {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', String(params.page))
  if (params?.page_size) query.append('page_size', String(params.page_size))
  if (params?.is_read !== undefined) query.append('is_read', String(params.is_read))

  const qs = query.toString()
  const endpoint = qs ? `/support/notifications/?${qs}` : '/support/notifications/'
  const res = await apiGet(endpoint)
  return normalizeList(res)
}

export async function getUnreadNotificationCount(): Promise<number> {
  const res = await apiGet<{ unread_count?: number; data?: { unread_count?: number } }>(
    '/support/notifications/unread-count/',
  )
  return res.unread_count ?? res.data?.unread_count ?? 0
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiPatch(`/support/notifications/${id}/mark-read/`, {})
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiPost('/support/notifications/mark-all-read/', {})
}

export async function trackNotification(
  id: string,
  event: 'opened' | 'clicked',
): Promise<void> {
  await apiPost(`/support/notifications/${id}/track/`, { event })
}
