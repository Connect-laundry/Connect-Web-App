'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { User } from '@/shared/types'
import { clearAuthCookies, getCurrentUser, logout as logoutUser } from '@/features/auth/api'
import { isProtectedAppPath, isPublicPath } from '@/features/auth/lib/public-routes'
import { resetSessionExpiryNotify, SESSION_EXPIRED_EVENT } from '@/features/auth/lib/session-expired'
import { SessionExpiredError } from '@/shared/api/client'
import { getLaundryProfile } from '@/features/business/api'
import { PROACTIVE_REFRESH_MS, refreshAccessToken } from '@/shared/api/token-refresh'

interface AuthContextType {
  user: User | null
  laundry: any | null
  isLoading: boolean
  isLaundryLoading: boolean
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => Promise<void>
  hydrate: () => Promise<void>
  refreshLaundry: (options?: { silent?: boolean }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [laundry, setLaundry] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLaundryLoading, setIsLaundryLoading] = useState(false)

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser()
    } finally {
      setUser(null)
      setLaundry(null)
    }
  }, [])

  const hydrate = async () => {
    try {
      setIsLoading(true)
      // Directly fetch user, apiGet wrapper will handle 401 via refresh token route automatically
      const currentUser = await getCurrentUser()
      
      const userRole = (currentUser.role || (currentUser as any).user_type || '').toString().toUpperCase()
      if (!currentUser || (userRole !== 'OWNER' && userRole !== 'ADMIN')) {
        throw new Error('Unauthorized or not OWNER/ADMIN')
      }

      setUser(currentUser)
      
      setIsLaundryLoading(true)
      const laundryProfile = await getLaundryProfile()
      setLaundry(laundryProfile)
    } catch (error) {
      setUser(null)
      setLaundry(null)
      // Stale cookies: clear once without toast (common on landing when not logged in)
      if (error instanceof SessionExpiredError) {
        await clearAuthCookies()
      }
    } finally {
      setIsLoading(false)
      setIsLaundryLoading(false)
    }
  }

  const refreshLaundry = async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLaundryLoading(true)
    try {
      const profile = await getLaundryProfile()
      setLaundry(profile)
    } finally {
      if (!options?.silent) setIsLaundryLoading(false)
    }
  }

  useEffect(() => {
    hydrate()
  }, [])

  // Access JWT expires ~10m on backend; refresh before expiry to avoid 401 storms
  useEffect(() => {
    if (!user) return

    const refreshSession = () => {
      void refreshAccessToken()
    }

    const interval = setInterval(refreshSession, PROACTIVE_REFRESH_MS)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    const onSessionExpired = async () => {
      const path = window.location.pathname
      await handleLogout()

      if (!isProtectedAppPath(path) || isPublicPath(path)) return
      if (path.startsWith('/auth/login')) return

      toast.error('Your session expired. Please sign in again.')
      router.replace('/auth/login?session=expired')
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
  }, [handleLogout, router])

  const login = (userData: User) => {
    resetSessionExpiryNotify()
    setUser(userData)
    refreshLaundry()
  }

  const value: AuthContextType = {
    user,
    laundry,
    isLoading,
    isLaundryLoading,
    isAuthenticated: !!user,
    login,
    logout: handleLogout,
    hydrate,
    refreshLaundry,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
