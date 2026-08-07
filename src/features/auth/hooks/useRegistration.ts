import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { register } from '../api'
import { useAuth } from '../context/AuthContext'
import {
  getRegistrationError,
  registerFormDefaults,
  registerSchema,
  type RegisterFormValues,
} from '../lib/registration'

export function useRegistration() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerFormDefaults,
  })

  const submit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await register(values)
      if (!response?.user) throw new Error('Registration successful, but user data was missing. Please try logging in.')
      login(response.user)
      router.push('/onboarding/setup')
    } catch (error: unknown) {
      const message = getRegistrationError(error as Parameters<typeof getRegistrationError>[0])
      setError(message)
      console.warn('[register] failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { form, isLoading, error, submit }
}
