'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/context/AuthContext'
import { hasPendingOnboardingApplication } from '@/features/onboarding/lib/storage'
import { Spinner } from '@/shared/ui/spinner'

const ONBOARDING_PATHS = ['/onboarding/setup', '/onboarding/pending']

function isOnboardingPath(path: string) {
  return ONBOARDING_PATHS.some((p) => path === p || path.startsWith(`${p}/`))
}

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, laundry, isLaundryLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !isLaundryLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
      } else if (
        user &&
        (() => {
          const role = (user.role || (user as { user_type?: string }).user_type || '')
            .toString()
            .toUpperCase()
          return role !== 'OWNER' && role !== 'ADMIN'
        })()
      ) {
        console.error('[Security] Unauthorized. User object:', user)
        logout()
        router.push('/auth/login?error=unauthorized')
      } else if (isAuthenticated) {
        const path = window.location.pathname
        const pendingApplication = hasPendingOnboardingApplication()

        // Only send to setup if they never finished onboarding (no laundry, no local application).
        // Pending approval does NOT block dashboard — backend may not have my-laundry yet.
        if (
          !laundry &&
          !pendingApplication &&
          !isOnboardingPath(path)
        ) {
          router.push('/onboarding/setup')
        }
      }
    }
  }, [isAuthenticated, isLoading, isLaundryLoading, user, laundry, router, logout])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
