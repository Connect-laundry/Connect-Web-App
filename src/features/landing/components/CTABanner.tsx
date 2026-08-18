// CTABanner.tsx
'use client'

import dynamic from 'next/dynamic'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'

const AnimatedDots = dynamic(() => import('./AnimatedDots').then(m => m.AnimatedDots), {
  ssr: false,
})

export const CTABanner = () => {

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="zoom-in">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/80 p-10 sm:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-700" />

            <AnimatedDots />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              {/* ...rest unchanged... */}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}