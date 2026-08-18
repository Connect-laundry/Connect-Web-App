'use client'

import { useLogin } from '@/features/auth/hooks/useLogin'
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

export const LoginForm = () => {
  const login = useLogin()

  return (
    <Card className="w-full surface-card border-0 shadow-[0_20px_50px_-12px_oklch(0.42_0.15_260/0.2)]">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Form {...login.form}>
          <form onSubmit={login.form.handleSubmit(login.submit)} className="space-y-4">
            {login.resetSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  Password updated. You can sign in now.
                </AlertDescription>
              </Alert>
            )}
            {login.sessionExpired && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertDescription className="text-amber-900">
                  Your session expired. Please sign in again.
                </AlertDescription>
              </Alert>
            )}
            {login.error && (
              <Alert variant="destructive" className="animate-in fade-in zoom-in-95 duration-300">
                <AlertDescription>{login.error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={login.form.control}
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
                        disabled={login.isLoading}
                        className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={login.form.control}
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
                        type={login.showPassword ? 'text' : 'password'}
                        {...field}
                        disabled={login.isLoading}
                        className="pl-10 pr-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => login.setShowPassword(!login.showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={login.isLoading}
                      >
                        {login.showPassword ? (
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
              disabled={login.isLoading}
            >
              {login.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <p className="text-center text-sm">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </p>
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
