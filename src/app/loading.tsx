'use client'

import { WashingMachine } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-bounce-subtle">
          <WashingMachine className="w-8 h-8 text-primary animate-spin-slow" />
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight">Connect<span className="text-primary"> Laundry</span></h2>
        <p className="text-sm text-muted-foreground animate-pulse">Loading fresh experience...</p>
      </div>
    </div>
  )
}
