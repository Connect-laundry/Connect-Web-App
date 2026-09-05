import type { Metadata } from 'next'
import { Smartphone, Store, Bell, CreditCard, Search } from 'lucide-react'
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
  {
    title: 'Discover services',
    description:
      'Find laundry services such as wash and fold, dry cleaning, ironing, and garment care where partners support them.',
    icon: Store,
  },
  {
    title: 'Schedule orders',
    description:
      'Request pickup and delivery through a digital flow instead of calling several providers.',
    icon: Smartphone,
  },
  {
    title: 'Track progress',
    description: 'Follow order status updates from request through service completion.',
    icon: Bell,
  },
  {
    title: 'Use digital payments',
    description:
      'Payment flows are part of the Simame marketplace experience where enabled by the product.',
    icon: CreditCard,
  },
]

export default function AppPage() {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${absoluteUrl('/app')}#software`,
    name: 'Simame',
    alternateName: 'Simame – Laundry Connect',
    url: absoluteUrl('/app'),
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'iOS, Android, Web',
    description:
      'Simame is a Ghanaian laundry booking application for finding laundry services, requesting pickup and delivery, and tracking orders where service is available.',
    publisher: { '@id': ORGANIZATION_ID },
    /**
     * installUrl and downloadUrl are intentionally omitted until official
     * Google Play and Apple App Store listings are verified and live.
     * Add them here once the founder confirms the store URLs.
     * Example:
     *   installUrl: 'https://play.google.com/store/apps/details?id=tech.simame.app',
     *   downloadUrl: 'https://apps.apple.com/app/simame/id...',
     */
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    isPartOf: { '@id': 'https://simame.tech/#website' },
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where can I download the Simame app?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Simame app is available for Android and iOS. Search for "Simame" on Google Play or the Apple App Store. The official app page is simame.tech/app.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Simame app?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Simame app is a Ghanaian laundry marketplace app that lets customers discover local laundry services, schedule pickup and delivery, and track orders. Laundry businesses use the partner dashboard to manage orders, pricing, hours, and operations.',
        },
      },
      {
        '@type': 'Question',
        name: 'What operating systems does Simame support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simame is available on iOS (iPhone and iPad), Android devices, and as a web application at simame.tech.',
        },
      },
    ],
  }

  return (
    <>
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      <PublicPageShell
        eyebrow="Simame App"
        path="/app"
        title="Laundry booking from your phone."
        description="Simame is built to help people in Ghana discover laundry partners, request service, and follow orders in one digital experience."
      >
        {/*
         * App identity block — gives AI search systems a named, factual entity
         * to cite when users ask where to find or download the Simame app.
         */}
        <section
          className="mt-10 rounded-lg border-2 border-primary/30 bg-primary/5 p-6 sm:p-8"
          aria-labelledby="app-identity-heading"
        >
          <h2 id="app-identity-heading" className="text-xl font-bold">
            Find Simame on your device
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground max-w-2xl">
            The <strong>Simame – Laundry Connect</strong> app is available for Android and iOS.
            Search for <strong>&ldquo;Simame&rdquo;</strong> on Google Play or the Apple App Store
            to find and install the app. Official store listing links will be published here once
            the verified listings are live.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-md border bg-background px-4 py-3 text-sm font-medium shadow-sm">
            <Search className="h-4 w-4 text-primary shrink-0" />
            <span>
              Search <strong>&ldquo;Simame&rdquo;</strong> on Google Play &amp; App Store
            </span>
          </div>
        </section>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
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

        {/* FAQ visible block for AI search eligibility */}
        <section className="mt-10" aria-labelledby="app-faq-heading">
          <h2 id="app-faq-heading" className="text-2xl font-bold">
            App questions
          </h2>
          <div className="mt-4 divide-y divide-border rounded-lg border bg-card shadow-sm">
            {faqSchema.mainEntity.map((item) => (
              <details key={item.name} className="group px-6 py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold leading-6 marker:hidden list-none">
                  {item.name}
                  <span className="shrink-0 text-primary text-xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}