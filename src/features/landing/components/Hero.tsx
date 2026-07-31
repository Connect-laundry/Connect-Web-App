'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { useAuth } from '@/features/auth/context/AuthContext'
import { FloatingParticles } from './FloatingParticles'

export function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] animate-pulse delay-1000" />
      </div>
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-8">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Professional Laundry Services
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={150}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Fresh, Clean &{' '}
                <span className="bg-linear-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  Delivered
                </span>{' '}
                to Your Door
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300}>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Connect Laundry offers premium laundry and dry cleaning services with free pickup and delivery.
                Let us handle the dirty work while you focus on what matters.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={450}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button size="lg" asChild className="h-13 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group">
                  <Link href={isAuthenticated ? '/dashboard' : '/auth/register'}>
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-13 px-8 text-base font-medium group">
                  <a href="#services">
                    View Services
                    <ChevronRight className="ml-1.5 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={600}>
              <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span><strong>1,000+</strong> Happy Customers</span>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right - Hero Image */}
          <AnimateOnScroll animation="fade-left" delay={300} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl scale-95" />
              <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <Image
                  src="/images/hero-laundry.jpg"
                  alt="Stack of freshly laundered, neatly folded clothes"
                  width={600}
                  height={500}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                  priority
                  unoptimized
                />
              </div>             
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
