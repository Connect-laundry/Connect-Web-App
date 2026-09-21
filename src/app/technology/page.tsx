import type { Metadata } from 'next'
import { BellRing, Database, Route, Smartphone, Store } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Simame Technology and Marketplace Model',
  description:
    'Learn how Simame uses marketplace technology to connect customers, laundry providers, ordering, pricing, tracking, payments, and notifications in Ghana.',
  path: '/technology',
})

const pillars = [
  { title: 'Marketplace discovery', description: 'Customers discover services while laundry partners manage the operational side of each order.', icon: Store },
  { title: 'Mobile ordering', description: 'The product is shaped around requesting and managing laundry from a phone.', icon: Smartphone },
  { title: 'Structured operations', description: 'Profiles, hours, pricing, delivery zones, staff, and order statuses create cleaner operational data.', icon: Database },
  { title: 'Tracking and notifications', description: 'Order and notification workflows help keep customers and providers aligned.', icon: BellRing },
  { title: 'Location-aware expansion', description: 'City and campus SEO should follow real provider supply and booking readiness.', icon: Route },
]

export default function TechnologyPage() {
  return (
    <PublicPageShell
      eyebrow="Technology"
      path="/technology"
      title="Digitizing laundry services through marketplace infrastructure."
      description="Simame is not just a brochure site. The web app already contains business-profile, pricing, order, staff, earnings, notification, and onboarding workflows that can support a real Ghanaian laundry marketplace as operations expand."
    >
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          return (
            <article key={pillar.title} className="rounded-lg border bg-card p-6 shadow-sm">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 text-lg font-bold">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{pillar.description}</p>
            </article>
          )
        })}
      </div>
    </PublicPageShell>
  )
}