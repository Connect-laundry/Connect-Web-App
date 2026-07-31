'use client'

import { useState } from 'react'
import {
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPreferences,
} from '@/features/support/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'

interface NotificationsTabProps {
  initialPrefs: any
  initialNotifications: any[]
}

export const NotificationsTab = ({ initialPrefs, initialNotifications }: NotificationsTabProps) => {
  const [prefs, setPrefs] = useState<any>(initialPrefs)
  const [notifications, setNotifications] = useState<any[]>(initialNotifications)

  return (
    <div className="space-y-6">
      {prefs && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['email_enabled', 'push_enabled', 'sms_enabled'] as const).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">{key.replace('_enabled', '')}</span>
                <Switch
                  checked={!!prefs[key]}
                  onCheckedChange={async (checked) => {
                    const updated = await updateNotificationPreferences({ [key]: checked })
                    setPrefs(updated)
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>Recent notifications</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => markAllNotificationsRead()}>
            Mark all read
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded border p-3 text-sm ${n.is_read ? 'opacity-70' : ''}`}
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-muted-foreground">{n.body}</p>
                {!n.is_read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={async () => {
                      await markNotificationRead(n.id)
                      setNotifications((prev) =>
                        prev.map((item) =>
                          item.id === n.id ? { ...item, is_read: true } : item,
                        ),
                      )
                    }}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
