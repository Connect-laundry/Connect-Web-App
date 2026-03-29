'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/shared/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    Sentry.captureException(error)
    console.error('Landing Page Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-destructive/10 blur-3xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-destructive/5 border border-destructive/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Something went wrong</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We encountered an unexpected error. Don&apos;t worry, your laundry is safe! 
          Try refreshing the page or head back to home.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border text-left overflow-auto max-h-48">
            <p className="text-xs font-mono text-destructive break-words">
              {error.message || 'Unknown error'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} size="lg" className="h-12 px-8 group">
          <RotateCcw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
          Try Again
        </Button>
        <Button variant="outline" asChild size="lg" className="h-12 px-8">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="mt-16 text-sm text-muted-foreground">
        If the problem persists, please <Link href="/support" className="text-primary hover:underline">contact support</Link>.
      </div>
    </div>
  )
}
