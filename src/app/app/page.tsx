import type { Metadata } from 'next'
import { Smartphone, Store, Bell, CreditCard } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { StructuredData } from '@/shared/components/StructuredData'
import { ORGANIZATION_ID, absoluteUrl, publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Simame App - Laundry Booking for Ghana',
  description:
    'Learn about the Simame app for laundry pickup, delivery, service discovery, order tracking, and laundry partner booking in Ghana.',
  path: '/app',
})

const features = [
  { title: 'Discover services', description: 'Find laundry services such as wash and fold, dry cleaning, ironing, and garment care where partners support them.', icon: Store },
  { title: 'Schedule orders', description: 'Request pickup and delivery through a digital flow instead of calling several providers.', icon: Smartphone },
  { title: 'Track progress', description: 'Follow order status updates from request through service completion.', icon: Bell },
  { title: 'Use digital payments', description: 'Payment flows are part of the Simame marketplace experience where enabled by the product.', icon: CreditCard },
]

export default function AppPage() {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${absoluteUrl('/app')}#software`,
    name: 'Simame',
    url: absoluteUrl('/app'),
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'iOS, Android, Web',
    description:
      'Simame is a Ghanaian laundry booking application for finding laundry services, requesting pickup and delivery, and tracking orders where service is available.',
    publisher: { '@id': ORGANIZATION_ID },
  }

  return (
    <>
      <StructuredData data={softwareSchema} />
      <PublicPageShell
        eyebrow="Simame App"
        path="/app"
        title="Laundry booking from your phone."
        description="Simame is built to help people in Ghana discover laundry partners, request service, and follow orders in one digital experience. Official App Store and Google Play links will be added only after the verified listings are live."
      >
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article key={feature.title} className="rounded-lg border bg-card p-6 shadow-sm">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="mt-5 text-lg font-bold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </PublicPageShell>
    </>
  )
}