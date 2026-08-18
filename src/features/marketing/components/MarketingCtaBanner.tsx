import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { Button } from '@/shared/ui/button'

export const MarketingCtaBanner = () => {
  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="zoom-in">
          <div className="relative overflow-hidden rounded-3xl landing-cta-panel p-10 sm:p-14 text-center">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-accent/20 blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-primary-foreground tracking-tight">Ready for laundry that fits your week?</h2>
              <p className="text-primary-foreground/85 text-lg font-medium">Sign up in minutes. Schedule your first pickup when you&apos;re ready.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button size="lg" asChild className="h-12 px-8 text-base font-bold rounded-xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"><Link href="/auth/register">Get started free<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base font-semibold rounded-xl border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-white/10"><Link href="/auth/login">Log in</Link></Button>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
