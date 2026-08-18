'use client'

import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Spinner } from '@/shared/ui/spinner'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Badge } from '@/shared/ui/badge'
import { AlertCircle, Bell, ExternalLink, RefreshCw } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { PageShell } from '@/shared/components/layout/PageShell'
import { PageHeader } from '@/shared/components/layout/PageHeader'

const priorityStyles: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-700',
  NORMAL: 'bg-blue-50 text-blue-700',
  HIGH: 'bg-amber-50 text-amber-800',
  URGENT: 'bg-red-50 text-red-700',
}

function formatCategory(category?: string) {
  if (!category) return 'System'
  return category.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    error,
    reload,
    markRead,
    markAllRead,
    openNotification,
  } = useNotifications()

  return (
    <PageShell contentClassName="max-w-3xl">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up'}
        actions={[
          {
            label: isRefreshing ? 'Refreshing...' : 'Refresh',
            onClick: reload,
            variant: 'outline',
            disabled: isRefreshing,
          },
          ...(unreadCount > 0
            ? [{ label: 'Mark all read', onClick: markAllRead, variant: 'outline' as const }]
            : []),
        ]}
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
            <p className="mt-1 text-center text-sm">
              New orders, customer messages, payments, campaigns, and system updates will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                'surface-card border-0 transition-all hover:-translate-y-px',
                !notification.is_read && 'ring-2 ring-primary/20 bg-primary/[0.04]',
              )}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => openNotification(notification)}
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{formatCategory(notification.category || notification.type)}</Badge>
                      {notification.priority && notification.priority !== 'NORMAL' && (
                        <Badge className={priorityStyles[notification.priority] || priorityStyles.NORMAL}>
                          {notification.priority}
                        </Badge>
                      )}
                      {!notification.is_read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {notification.title}
                      {notification.action_url && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm">{notification.body}</CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </button>
                  {!notification.is_read && (
                    <Button size="sm" variant="ghost" onClick={() => markRead(notification.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {isRefreshing && !isLoading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Checking for new notifications
        </div>
      )}
    </PageShell>
  )
}

export default NotificationsPage
