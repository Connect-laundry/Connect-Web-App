'use client'

import { Card, CardContent } from '@/shared/ui/card'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { FloatingParticles } from './FloatingParticles'
import { SERVICES } from '../data/landingData'

export const Services = () => {
  return (
    <section id="services" className="py-24 sm:py-32 relative">
      <FloatingParticles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Services Tailored for You
          </h2>
          <p className="text-muted-foreground text-lg">
            From everyday laundry to specialty garment care, we&apos;ve got every fabric covered.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => (
            <AnimateOnScroll key={service.title} animation="fade-up" delay={i * 120}>
              <Card className={`group border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm ${service.border} h-full`}>
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${service.bg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <service.icon className={`h-7 w-7 ${service.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
