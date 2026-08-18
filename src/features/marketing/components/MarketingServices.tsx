import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { Card, CardContent } from '@/shared/ui/card'
import { services } from '../data/landingContent'
import { SectionLabel } from './SectionLabel'

export const MarketingServices = () => {
  return (
    <section id="services" className="py-24 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel>What we offer</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Wash & fold, dry cleaning, and more</h2>
          <p className="text-muted-foreground text-lg font-medium">One platform for customers and owners — same quality, end to end.</p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <AnimateOnScroll key={service.title} delay={index * 100}>
              <Card className="group surface-card border-0 h-full hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${service.tone === 'primary' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/15 text-accent border-accent/25'}`}><service.icon className="h-6 w-6" /></div>
                  <h3 className="text-lg font-bold">{service.title}</h3>
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
