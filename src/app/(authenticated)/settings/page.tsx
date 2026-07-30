'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Switch } from '@/shared/ui/switch'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  getActiveSessions,
  requestPasswordReset,
  revokeAllSessions,
} from '@/features/account/api'
import {
  getNotificationPreferences,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPreferences,
} from '@/features/support/api'

export default function SettingsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [prefs, setPrefs] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resetEmail, setResetEmail] = useState(user?.email ?? '')
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [sessionList, notifPage, preferences] = await Promise.all([
          getActiveSessions().catch(() => []),
          getNotifications().catch(() => ({ results: [], unread_count: 0 })),
          getNotificationPreferences().catch(() => null),
        ])
        setSessions(sessionList)
        setNotifications(notifPage.results ?? [])
        setPrefs(preferences)
      } catch (err: any) {
        setError(err.message || 'Failed to load settings.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full flex overflow-x-auto justify-start sm:justify-center border-b pb-1 custom-scrollbar">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-muted-foreground">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="text-muted-foreground">{user?.role}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Reset</CardTitle>
              <CardDescription>Request a reset link by email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Email"
              />
              <Button
                onClick={async () => {
                  await requestPasswordReset(resetEmail)
                  setResetSent(true)
                }}
              >
                Send reset link
              </Button>
              {resetSent && (
                <p className="text-sm text-green-700">If that email exists, a reset link was sent.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Devices signed into your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No session details returned.</p>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="rounded border p-3 text-sm">
                    <p>{session.device_name || 'Unknown device'}</p>
                    <p className="text-muted-foreground">{session.ip_address || '—'}</p>
                  </div>
                ))
              )}
              <Button variant="outline" onClick={() => revokeAllSessions()}>
                Sign out all other devices
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
