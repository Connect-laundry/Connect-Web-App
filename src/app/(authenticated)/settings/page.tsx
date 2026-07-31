'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { PageShell } from '@/shared/components/layout/PageShell'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { getActiveSessions } from '@/features/account/api'
import {
  getNotificationPreferences,
  getNotifications,
} from '@/features/support/api'
import { AccountTab } from '@/features/settings/components/AccountTab'
import { SecurityTab } from '@/features/settings/components/SecurityTab'
import { NotificationsTab } from '@/features/settings/components/NotificationsTab'

export default function SettingsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [prefs, setPrefs] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <PageShell contentClassName="max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and preferences." />

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
          <AccountTab />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecurityTab sessions={sessions} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationsTab initialPrefs={prefs} initialNotifications={notifications} />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}
