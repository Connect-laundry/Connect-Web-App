'use client'

import Link from 'next/link'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Clock } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  getOnboardingApplication,
  hasPendingOnboardingApplication,
} from '@/features/onboarding/lib/storage'

export function OnboardingStatusBanner() {
  const { laundry } = useAuth()
  const localPending = hasPendingOnboardingApplication()
  const localApp = getOnboardingApplication()
  const apiPending = laundry?.status === 'PENDING'
  const noLaundry = !laundry

  if (!localPending && !apiPending && !noLaundry) return null

  const name = laundry?.name || localApp?.name || 'your shop'
  const isLocalOnly = noLaundry && localPending

  return (
    <Alert className="mb-6 border-primary/20 bg-primary/5 rounded-xl">
      <Clock className="h-4 w-4 text-primary" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ml-2">
        <span className="text-sm font-medium leading-relaxed">
          {isLocalOnly ? (
            <>
              <strong>{name}</strong> is saved locally — your shop isn&apos;t linked on the server yet.
              You can use the dashboard; some business settings will work after approval.
            </>
          ) : apiPending ? (
            <>
              <strong>{name}</strong> is pending approval. You can keep using the dashboard while we review.
            </>
          ) : (
            <>Complete owner setup to link your laundry to this account.</>
          )}
        </span>
        {(localPending || apiPending) && (
          <Button variant="outline" size="sm" className="shrink-0 rounded-lg" asChild>
            <Link href="/onboarding/pending">View status</Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
