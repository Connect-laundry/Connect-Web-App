'use client'

import { useNotificationSettings } from '../hooks/useNotificationSettings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'

interface NotificationsTabProps {
  initialPrefs: any
  initialNotifications: any[]
}

const PREF_LABELS: Record<string, string> = {
  push_enabled: 'Push notifications (master switch)',
  order_updates: 'Order updates',
  payment_updates: 'Payment updates',
  promotions: 'Promotions',
  campaigns: 'Marketing campaigns',
  referrals: 'Referral rewards',
  weekly_tips: 'Weekly tips',
}

const PUSH_PREF_KEYS = [
  'push_enabled',
  'order_updates',
  'payment_updates',
  'promotions',
  'campaigns',
  'referrals',
  'weekly_tips',
] as const

export const NotificationsTab = ({ initialPrefs, initialNotifications }: NotificationsTabProps) => {
  const { prefs, notifications, updatePreference, markRead, markAllRead } =
    useNotificationSettings(initialPrefs, initialNotifications)

  return (
    <div className="space-y-6">
      {prefs && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Control which notifications you receive as push alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {PUSH_PREF_KEYS.map((key) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <Label htmlFor={`pref-${key}`} className="text-sm cursor-pointer">
                  {PREF_LABELS[key] ?? key}
                </Label>
                <Switch
                  id={`pref-${key}`}
                  checked={!!prefs[key]}
                  onCheckedChange={(checked) => updatePreference(key, checked)}
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
          <Button variant="outline" size="sm" onClick={markAllRead}>
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
                    onClick={() => markRead(n.id)}
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
