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
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <a href="#" className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors w-[160px] h-[52px]">
                  <svg viewBox="0 0 384 512" className="w-6 h-6 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight">Download on the</div>
                    <div className="text-sm font-semibold leading-tight">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors w-[160px] h-[52px]">
                  <svg viewBox="0 0 512 512" className="w-6 h-6 fill-current"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight">GET IT ON</div>
                    <div className="text-sm font-semibold leading-tight">Google Play</div>
                  </div>
                </a>
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
