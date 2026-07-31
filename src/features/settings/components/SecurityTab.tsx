'use client'

import { useState } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  requestPasswordReset,
  revokeAllSessions,
} from '@/features/account/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

interface SecurityTabProps {
  sessions: any[]
}

export const SecurityTab = ({ sessions }: SecurityTabProps) => {
  const { user } = useAuth()
  const [resetEmail, setResetEmail] = useState(user?.email ?? '')
  const [resetSent, setResetSent] = useState(false)

  return (
    <div className="space-y-6">
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
    </div>
  )
}
