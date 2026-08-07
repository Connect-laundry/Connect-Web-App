import { useCallback, useEffect, useRef, useState } from 'react'
import type { Notification } from '@/shared/interfaces'
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  trackNotification,
} from '../api'

const POLL_INTERVAL_MS = 30_000

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const load = useCallback(async (silent = false) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      const data = await getNotifications({ page_size: 50 })
      if (!mountedRef.current) return
      setNotifications(data.results)
      setUnreadCount(data.unread_count)
      setError(null)
    } catch (error: unknown) {
      if (!silent && mountedRef.current) {
        setError(error instanceof Error ? error.message : 'Failed to load notifications')
      }
    } finally {
      if (mountedRef.current) {
        if (silent) setIsRefreshing(false)
        else setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    void load()
    const pollId = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load(true)
    }, POLL_INTERVAL_MS)
    return () => {
      mountedRef.current = false
      window.clearInterval(pollId)
    }
  }, [load])

  const markRead = async (id: string) => {
    const item = notifications.find((notification) => notification.id === id)
    await markNotificationRead(id)
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification,
      ),
    )
    if (item && !item.is_read) setUnreadCount((count) => Math.max(0, count - 1))
  }

  const markAllRead = async () => {
    await markAllNotificationsRead()
    setNotifications((previous) => previous.map((item) => ({ ...item, is_read: true })))
    setUnreadCount(0)
  }

  const openNotification = async (notification: Notification) => {
    const event = notification.action_url ? 'clicked' : 'opened'
    await trackNotification(notification.id, event).catch(() => undefined)
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              is_read: true,
              opened_at: item.opened_at || new Date().toISOString(),
              clicked_at: event === 'clicked' ? item.clicked_at || new Date().toISOString() : item.clicked_at,
            }
          : item,
      ),
    )
    if (!notification.is_read) setUnreadCount((count) => Math.max(0, count - 1))

    if (notification.action_url) {
      window.location.assign(notification.action_url)
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    error,
    reload: () => load(true),
    markRead,
    markAllRead,
    openNotification,
  }
}
