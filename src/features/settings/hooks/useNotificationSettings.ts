import { useState } from 'react'
import { markAllNotificationsRead, markNotificationRead, updateNotificationPreferences } from '@/features/support/api'

export function useNotificationSettings(initialPrefs: any, initialNotifications: any[]) {
  const [prefs, setPrefs] = useState<any>(initialPrefs)
  const [notifications, setNotifications] = useState<any[]>(initialNotifications)
  const updatePreference = async (key: string, checked: boolean) => setPrefs(await updateNotificationPreferences({ [key]: checked }))
  const markRead = async (id: string) => { await markNotificationRead(id); setNotifications((previous) => previous.map((item) => item.id === id ? { ...item, is_read: true } : item)) }
  const markAllRead = async () => { await markAllNotificationsRead(); setNotifications((previous) => previous.map((item) => ({ ...item, is_read: true }))) }
  return { prefs, notifications, updatePreference, markRead, markAllRead }
}
