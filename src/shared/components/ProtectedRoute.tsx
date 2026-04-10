'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/shared/ui/spinner'
import { useAuth } from '@/features/auth/context/AuthContext'

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
      } else if (
        // Case-insensitive check to prevent login failure if backend sends lowercase 'owner'.
        // Also supports fallback to 'user_type' depending on API schema variations.
        user &&
        (() => {
          const role = (user.role || (user as any).user_type || '').toString().toUpperCase()
          return role !== 'OWNER' && role !== 'ADMIN'
        })()
      ) {
        // Strict enforcement: log out if not an OWNER or ADMIN
        console.error('[Security] Unauthorized. User object:', user)
        logout()
        router.push('/auth/login?error=unauthorized')
      } else if (isAuthenticated && (!laundry || laundry.status === 'PENDING')) {
        const _path = window.location.pathname

        if (!laundry && _path !== '/onboarding/setup') {
          router.push('/onboarding/setup')
        } else if (laundry?.status === 'PENDING' && _path !== '/onboarding/pending') {
          router.push('/onboarding/pending')
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
