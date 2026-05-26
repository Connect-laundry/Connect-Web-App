'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { resetPassword } from '@/features/auth/api'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Loader2, Lock } from 'lucide-react'

const schema = z
  .object({
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

type FormValues = z.infer<typeof schema>

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: '', confirm_password: '' },
  })

  async function onSubmit(values: FormValues) {
    if (!token) {
      setError('Reset link is invalid or expired. Request a new one.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await resetPassword(token, values.new_password)
      router.push('/auth/login?reset=success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <Card className="w-full surface-card border-0">
        <CardHeader>
          <CardTitle>Invalid link</CardTitle>
          <CardDescription>This reset link is missing or expired.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/auth/forgot-password" className="text-primary font-medium hover:underline">
            Request a new reset link
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-none shadow-lg">
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Choose a strong password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" type="password" {...field} disabled={isLoading} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" type="password" {...field} disabled={isLoading} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
