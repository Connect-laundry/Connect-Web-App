'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { useAuth } from '@/features/auth/context/AuthContext'
import { FloatingParticles } from './FloatingParticles'

export const Hero = () => {
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
          <div className="space-y-8">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Laundry Connect in Ghana
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={150}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Laundry pickup and delivery in Ghana
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300}>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Simame helps customers arrange wash and fold, dry cleaning, ironing, garment care,
                pickup, and delivery with laundry partners in supported Ghana service areas.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={450}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button size="lg" asChild className="h-13 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group">
                  <Link href={isAuthenticated ? '/dashboard' : '/auth/register'}>
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
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
              <div className="grid gap-3 pt-2 text-sm text-muted-foreground sm:grid-cols-2">
                {['Wash and fold', 'Dry cleaning', 'Ironing', 'Pickup and delivery'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fade-left" delay={300} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl scale-95" />
              <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <Image
                  src="/images/hero-laundry.jpg"
                  alt="Freshly folded laundry ready for pickup and delivery"
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
