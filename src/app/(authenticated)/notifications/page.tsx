'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/features/notifications/api'
import { Notification } from '@/shared/interfaces'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Spinner } from '@/shared/ui/spinner'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle, Bell } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { PageShell } from '@/shared/components/layout/PageShell'
import { PageHeader } from '@/shared/components/layout/PageHeader'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getNotifications({ page_size: 50 })
      setNotifications(data.results)
      setUnreadCount(data.unread_count)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  return (
    <PageShell contentClassName="max-w-3xl">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up'}
        actions={
          unreadCount > 0
            ? [{ label: 'Mark all read', onClick: handleMarkAllRead, variant: 'outline' }]
            : undefined
        }
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="surface-card border-0">
          <CardContent className="flex flex-col items-center py-16 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="h-7 w-7 text-primary/60" />
            </div>
            <p className="font-semibold">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn(
                'surface-card border-0 transition-all hover:-translate-y-px',
                !n.is_read && 'ring-2 ring-primary/20 bg-primary/[0.04]',
              )}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{n.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm">{n.body}</CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!n.is_read && (
                    <Button size="sm" variant="ghost" onClick={() => handleMarkRead(n.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  )
}
