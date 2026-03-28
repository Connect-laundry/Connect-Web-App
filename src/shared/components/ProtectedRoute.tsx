'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Spinner } from '@/shared/ui/spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, laundry, isLaundryLoading } = useAuth()
  const { logout } = useAuth() 

  useEffect(() => {
    if (!isLoading && !isLaundryLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
      } else if (user && user.role !== 'OWNER') {
        // Strict enforcement: log out if not an OWNER
        console.error('[Security] Unauthorized access attempt by non-OWNER account.')
        logout()
        router.push('/auth/login?error=unauthorized')
      } else if (isAuthenticated && !laundry) {
        // SetupGuard: redirect to onboarding if no laundry profile
        const isAlreadyOnOnboarding = window.location.pathname.startsWith('/onboarding')
        if (!isAlreadyOnOnboarding) {
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
