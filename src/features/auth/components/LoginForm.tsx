'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { login } from '@/features/auth/api'
import { useAuth } from '@/features/auth/context/AuthContext'
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
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const { login: setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await login(values)

      if (response?.user) {
        // Use the auth context login which now triggers laundry hydration
        setUser(response.user)
        
        // Give a tiny moment for the laundry state to be initiated, 
        // OR better yet, fetch it right here to decide the immediate redirect
        try {
          const { getLaundryProfile } = await import('@/features/business/api')
          const laundry = await getLaundryProfile()
          
          if (!laundry) {
            router.push('/onboarding/setup')
          } else if (laundry.status === 'PENDING') {
            router.push('/onboarding/pending')
          } else {
            router.push('/dashboard')
          }
        } catch (_e) {
          // If laundry fetch fails, default to dashboard and let ProtectedRoute handle it
          router.push('/dashboard')
        }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-background/60 backdrop-blur-xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in zoom-in-95 duration-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Email</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="owner@example.com"
                        type="email"
                        {...field}
                        disabled={isLoading}
                        className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        disabled={isLoading}
                        className="pl-10 pr-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold transition-all active:scale-[0.98] disabled:opacity-70" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>



        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-all">
            Get started
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
