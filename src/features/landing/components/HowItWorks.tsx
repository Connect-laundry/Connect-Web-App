'use client'

import Image from 'next/image'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { HOW_IT_WORKS_STEPS } from '../data/landingData'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Getting your laundry done has never been easier. Just three simple steps.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {HOW_IT_WORKS_STEPS.map((item, i) => (
            <AnimateOnScroll key={item.step} animation="fade-up" delay={i * 200}>
              <div className="relative text-center group">
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-linear-to-r from-primary/30 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 mb-6 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-105 relative">
                  <item.icon className="h-10 w-10 text-primary transition-transform duration-500 group-hover:rotate-12" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Featured Image */}
        <AnimateOnScroll animation="zoom-in" delay={400} className="mt-16">
          <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border/50">
            <Image
              src="/images/laundry-room.jpg"
              alt="Bright, clean modern laundry room"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
