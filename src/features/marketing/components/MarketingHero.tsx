import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { Button } from '@/shared/ui/button'
import { HeroPhoto } from './HeroPhoto'
import { PickupBar } from './PickupBar'
import { SectionLabel } from './SectionLabel'
import { TrustPills } from './TrustPills'

export function MarketingHero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20 landing-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-8">
            <AnimateOnScroll><SectionLabel>Laundry & dry cleaning</SectionLabel></AnimateOnScroll>
            <AnimateOnScroll delay={100}><h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-foreground">We&apos;ll take the laundry. <span className="text-primary">You take the time.</span></h1></AnimateOnScroll>
            <AnimateOnScroll delay={200}><p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-medium">SIMAME picks up, cleans, and delivers — with local partners you can trust and an owner dashboard to run your shop.</p></AnimateOnScroll>
            <AnimateOnScroll delay={300}><PickupBar /></AnimateOnScroll>
            <AnimateOnScroll delay={400}>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" asChild className="h-12 px-7 font-bold rounded-xl shadow-glow-sm"><Link href="/auth/register">Get started<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-7 font-semibold rounded-xl border-primary/25"><a href="#how-it-works">See how it works</a></Button>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={500}><TrustPills /></AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fade-left" delay={200} className="relative pb-8 sm:pb-0">
            <HeroPhoto />
            <div className="absolute bottom-0 left-2 sm:left-4 max-w-[200px] rounded-2xl border border-border/60 bg-card p-4 shadow-xl hidden sm:block z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Clock className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-bold">24h turnaround</p><p className="text-xs text-muted-foreground">Standard service</p></div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
