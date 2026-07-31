'use client'

import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { useAuth } from '@/features/auth/context/AuthContext'
import { getOnboardingApplication } from '@/features/onboarding/lib/storage'
import { useRouter } from 'next/navigation'
import { Loader2, Clock, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PendingPage() {
  const { laundry, refreshLaundry, isLaundryLoading } = useAuth()
  const router = useRouter()
   const [applicationName] = useState<string | null>(() => getOnboardingApplication()?.name ?? null)

  useEffect(() => {
    if (laundry?.status === 'APPROVED') {
      router.push('/dashboard')
    }
  }, [laundry, router])

  const displayName = laundry?.name || applicationName || 'your laundry'

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center landing-mesh p-4">
        <Card className="max-w-md w-full text-center surface-card border-0">
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black">Application received</CardTitle>
            <CardDescription className="font-medium">
              We&apos;re reviewing <strong>{displayName}</strong>. This usually takes less than 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your application is on file. You can use the dashboard now — some shop settings
              will unlock once your laundry is linked and approved on the server.
            </p>

            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full rounded-xl font-bold"
            >
              Go to dashboard
            </Button>

            <Button
              variant="outline"
              onClick={() => refreshLaundry()}
              disabled={isLaundryLoading}
              className="w-full rounded-xl font-bold"
            >
              {isLaundryLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh status
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Questions? support@connectlaundry.app
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
