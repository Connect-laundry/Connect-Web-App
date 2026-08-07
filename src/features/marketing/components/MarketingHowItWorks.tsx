import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { processSteps } from '../data/landingContent'
import { DeliveryShowcase } from './DeliveryShowcase'
import { SectionLabel } from './SectionLabel'

export function MarketingHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center max-w-2xl mx-auto mb-10">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Three steps. Zero laundry stress.</h2>
          <p className="text-muted-foreground text-lg font-medium">Schedule online — we handle pickup, cleaning, and delivery.</p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100} className="mb-12 max-w-4xl mx-auto"><DeliveryShowcase /></AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps.map((item, index) => (
            <AnimateOnScroll key={item.step} delay={index * 150}>
              <div className="text-center p-6 rounded-2xl surface-card border-0">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-black mb-5">{item.step}</div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4"><item.icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
