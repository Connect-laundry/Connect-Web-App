'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/shared/types'
import { getCurrentUser, logout as logoutUser } from '@/features/auth/api'
import { getLaundryProfile } from '@/features/business/api'

interface AuthContextType {
  user: User | null
  laundry: any | null
  isLoading: boolean
  isLaundryLoading: boolean
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => Promise<void>
  hydrate: () => Promise<void>
  refreshLaundry: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [laundry, setLaundry] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLaundryLoading, setIsLaundryLoading] = useState(false)

  const hydrate = async () => {
    try {
      setIsLoading(true)
      // Directly fetch user, apiGet wrapper will handle 401 via refresh token route automatically
      const currentUser = await getCurrentUser()
      
      if (!currentUser || currentUser.role !== 'OWNER') {
        throw new Error('Unauthorized or not OWNER')
      }

      setUser(currentUser)
      
      setIsLaundryLoading(true)
      const laundryProfile = await getLaundryProfile()
      setLaundry(laundryProfile)
    } catch (error) {
      console.warn('Silent hydration failure (unauthenticated):', error)
      setUser(null)
      setLaundry(null)
    } finally {
      setIsLoading(false)
      setIsLaundryLoading(false)
    }
  }

  const refreshLaundry = async () => {
    setIsLaundryLoading(true)
    try {
      const profile = await getLaundryProfile()
      setLaundry(profile)
    } finally {
      setIsLaundryLoading(false)
    }
  }

  useEffect(() => {
    hydrate()
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
    } finally {
      setUser(null)
      setLaundry(null)
    }
  }

  const login = (userData: User) => {
    setUser(userData)
    // Trigger laundry fetch immediately after login
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
