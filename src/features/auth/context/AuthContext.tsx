'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/shared/types'
import { getCurrentUser, logout as logoutUser } from '@/features/auth/api'
import { getToken, clearTokens } from '@/shared/api/client'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const hydrate = async () => {
    try {
      const token = getToken()
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const currentUser = await getCurrentUser()

      // Check if user has OWNER role
      if (currentUser.role !== 'OWNER') {
        clearTokens()
        setUser(null)
        setIsLoading(false)
        return
      }

      setUser(currentUser)
    } catch (error) {
      console.error('Failed to hydrate auth:', error)
      clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    hydrate()
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout error:', error)
      clearTokens()
    } finally {
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: setUser,
    logout: handleLogout,
    hydrate,
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
