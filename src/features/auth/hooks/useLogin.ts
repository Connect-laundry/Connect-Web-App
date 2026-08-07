import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getLaundryProfile } from '@/features/business/api'
import { hasPendingOnboardingApplication } from '@/features/onboarding/lib/storage'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'

const loginSchema = z.object({ email: z.string().email('Invalid email address'), password: z.string().min(6, 'Password must be at least 6 characters') })
type LoginFormValues = z.infer<typeof loginSchema>

export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login: setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resetSuccess = searchParams.get('reset') === 'success'
  const sessionExpired = searchParams.get('session') === 'expired'
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  useEffect(() => { if (sessionExpired) router.replace('/auth/login') }, [sessionExpired, router])

  const submit = async (values: LoginFormValues) => {
    setIsLoading(true); setError(null)
    try {
      const response = await login(values)
      if (!response?.user) throw new Error('Invalid response from server')
      setUser(response.user)
      try {
        const laundry = await getLaundryProfile()
        router.push(!laundry && !hasPendingOnboardingApplication() ? '/onboarding/setup' : '/dashboard')
      } catch { router.push('/dashboard') }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to log in. Please check your credentials.')
      console.warn('[login] failed', error)
    } finally { setIsLoading(false) }
  }

  return { form, isLoading, showPassword, setShowPassword, error, resetSuccess, sessionExpired, submit }
}
