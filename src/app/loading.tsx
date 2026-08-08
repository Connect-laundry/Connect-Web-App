'use client'

import { SimameLogo } from '@/shared/components/branding/SimameLogo'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <SimameLogo variant="icon" className="relative animate-bounce-subtle" />
      </div>
      <div className="mt-6 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight">SIMAME<span className="text-primary">.</span></h2>
        <p className="text-sm text-muted-foreground animate-pulse">Loading fresh experience...</p>
      </div>
    </div>
  )
}
