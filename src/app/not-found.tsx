'use client'

import Link from 'next/link'
import { WashingMachine, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative w-24 h-24 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center rotate-12">
          <WashingMachine className="w-12 h-12 text-muted-foreground/40" />
        </div>
        <div className="absolute -top-2 -right-2 bg-destructive/10 text-destructive text-sm font-bold px-3 py-1 rounded-full border border-destructive/20 shadow-sm">
          404
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="h-12 px-8">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-12 px-8" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>

      <div className="mt-16 pt-8 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Need help? <Link href="/contact" className="font-medium text-primary hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  )
}
