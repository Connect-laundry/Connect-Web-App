import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { Button } from '@/shared/ui/button'
import { marketingImages } from '../constants/images'
import { reasons } from '../data/landingContent'
import { SectionLabel } from './SectionLabel'

export function MarketingWhyChooseUs() {
  return (
    <section id="why-us" className="py-24 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <AnimateOnScroll animation="fade-right">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 rounded-2xl overflow-hidden shadow-lg ring-1 ring-border/40"><Image src={marketingImages.doorstepPickup} alt="Laundry bags ready for pickup at your door" width={800} height={480} className="w-full h-52 object-cover" unoptimized /></div>
              <div className="relative rounded-2xl overflow-hidden shadow-md ring-1 ring-border/40"><Image src={marketingImages.qualityGarments} alt="Professionally pressed garments" width={400} height={280} className="w-full h-40 object-cover" unoptimized /></div>
              <div className="relative rounded-2xl overflow-hidden shadow-md ring-1 ring-border/40"><Image src={marketingImages.heroLaundryDetail} alt="Fresh folded laundry" width={400} height={280} className="w-full h-40 object-cover" unoptimized /></div>
            </div>
          </AnimateOnScroll>
          <div>
            <AnimateOnScroll animation="fade-left">
              <SectionLabel>Why Connect</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">Built for customers. <span className="text-primary">Powered for owners.</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-medium">Local laundries get a real dashboard to manage orders and revenue. Customers get pickup, pro cleaning, and delivery — one connected experience.</p>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {reasons.map((reason, index) => (
                <AnimateOnScroll key={reason.title} delay={index * 80}>
                  <div className="p-5 rounded-2xl surface-card border-0 hover:border-primary/20 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><reason.icon className="h-5 w-5 text-primary" /></div>
                    <h3 className="font-bold mb-1.5">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
            <AnimateOnScroll delay={300}><Button size="lg" asChild className="h-12 px-7 font-bold rounded-xl shadow-glow-sm"><Link href="/auth/register">Create your account<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}
