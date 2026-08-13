'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { useAuth } from '@/features/auth/context/AuthContext'
import { WHY_CHOOSE_US_REASONS } from '../data/landingData'

export function WhyChooseUs() {
  const { isAuthenticated } = useAuth()

  return (
    <section id="why-us" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <AnimateOnScroll animation="fade-right">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl scale-95" />
              <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <Image
                  src="/images/folded-care.jpg"
                  alt="Neatly folded garments held with care"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right - Content */}
          <div>
            <AnimateOnScroll animation="fade-left">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why Simame</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                We Don&apos;t Just Clean Clothes.{' '}
                <span className="text-primary">We Care for Them.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                With years of experience and thousands of happy customers, Simame brings
                professional-grade cleaning to your doorstep with unmatched convenience.
              </p>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {WHY_CHOOSE_US_REASONS.map((reason, i) => (
                <AnimateOnScroll key={reason.title} animation="fade-up" delay={i * 100}>
                  <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 hover:bg-muted/60 transition-all duration-500 group hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                      <reason.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll animation="fade-up" delay={400}>
              <Button size="lg" asChild className="h-12 px-6 font-semibold group">
                <Link href={isAuthenticated ? '/dashboard' : '/auth/register'}>
                  {isAuthenticated ? 'Go to Dashboard' : 'Join Simame'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}
