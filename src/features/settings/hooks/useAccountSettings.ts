import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateProfile } from '@/features/auth/api'
import { useAuth } from '@/features/auth/context/AuthContext'

const schema = z.object({ first_name: z.string().min(1, 'First name is required'), last_name: z.string().min(1, 'Last name is required'), phone: z.string().min(10, 'Enter a valid phone number') })
type Values = z.infer<typeof schema>

export function useAccountSettings() {
  const { user, login, hydrate } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { first_name: '', last_name: '', phone: '' } })
  useEffect(() => { if (user) form.reset({ first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '' }) }, [user, form])
  const submit = async (values: Values) => {
    setIsSaving(true); setError(null); setSuccess(null)
    try { login(await updateProfile(values)); await hydrate(); setSuccess('Profile updated successfully') }
    catch (error: unknown) { setError(error instanceof Error ? error.message : 'Failed to update profile') }
    finally { setIsSaving(false) }
  }
  return { user, form, isSaving, success, error, submit }
}
