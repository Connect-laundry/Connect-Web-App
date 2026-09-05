import type { Metadata } from 'next'
import { Shirt, Sparkles, Truck, Wand2 } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Laundry Services on Simame',
  description:
    'Explore the laundry service categories Simame can support through local laundry partners in Ghana, including wash and fold, dry cleaning, ironing, pickup, and delivery.',
  path: '/services',
})

const services = [
  { title: 'Wash and Fold', description: 'Everyday clothing cleaned, dried, and folded by participating laundry partners.', icon: Shirt },
  { title: 'Dry Cleaning', description: 'Partner-supported care for suits, dresses, delicate garments, and fabric-specific cleaning needs.', icon: Sparkles },
  { title: 'Ironing and Pressing', description: 'Pressed garments for workwear, uniforms, shirts, trousers, and everyday clothing where offered.', icon: Wand2 },
  { title: 'Pickup and Delivery', description: 'Location-dependent collection and return handled through the Simame order flow where available.', icon: Truck },
]

export default function ServicesPage() {
  return (
    <PublicPageShell
      eyebrow="Laundry Services"
      path="/services"
      title="A clear service taxonomy for laundry in Ghana."
      description="Simame presents services according to what real laundry partners support. Pricing, turnaround, and delivery availability can vary by provider, area, garment type, and order details."
    >
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <article key={service.title} className="rounded-lg border bg-card p-6 shadow-sm">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 text-lg font-bold">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.description}</p>
            </article>
          )
        })}
      </div>
    </PublicPageShell>
  )
}