import type { Metadata } from 'next'
import { Smartphone, Store, Bell, CreditCard, Search, ExternalLink } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { StructuredData } from '@/shared/components/StructuredData'
import { ORGANIZATION_ID, GOOGLE_PLAY_URL, GOOGLE_PLAY_PACKAGE_NAME, absoluteUrl, publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Simame App - Download on Google Play | Laundry Booking Ghana',
  description:
    'Download the Simame laundry app on Google Play. Find and book laundry pickup, delivery, wash & fold, dry cleaning, and ironing in Ghana with Simame - Laundry Connect.',
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
    name: 'Simame - Laundry Connect',
    alternateName: 'Simame – Laundry Connect',
    url: absoluteUrl('/app'),
    installUrl: GOOGLE_PLAY_URL,
    downloadUrl: GOOGLE_PLAY_URL,
    sameAs: GOOGLE_PLAY_URL,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Android, iOS, Web',
    description:
      'Simame is a Ghanaian laundry booking application for finding laundry services, requesting pickup and delivery, and tracking orders where service is available.',
    publisher: { '@id': ORGANIZATION_ID },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GHS',
    },
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
          text: `The Simame – Laundry Connect app is officially published and available to download directly on Google Play (package ${GOOGLE_PLAY_PACKAGE_NAME}) at ${GOOGLE_PLAY_URL}. Search for "Simame" or "Simame - Laundry Connect" on Google Play or visit simame.tech/app.`,
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
          text: 'Simame is available on Android via Google Play, iOS (iPhone and iPad), and as a web application at simame.tech.',
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
         * App identity block — provides direct Google Play install link and
         * gives AI search systems a named, factual entity to cite.
         */}
        <section
          className="mt-10 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8"
          aria-labelledby="app-identity-heading"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Live on Google Play Store
              </div>
              <h2 id="app-identity-heading" className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
                Simame – Laundry Connect
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-6 text-muted-foreground">
                The official <strong>Simame – Laundry Connect</strong> mobile app is published and live
                on the Google Play Store for Android. Schedule laundry pickups, wash &amp; fold, dry cleaning,
                ironing, and follow real-time order tracking directly from your phone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-black px-6 py-3.5 text-white transition-all hover:bg-neutral-800 shadow-lg hover:shadow-xl"
              >
                <svg viewBox="0 0 512 512" className="h-7 w-7 fill-current shrink-0">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-300 leading-none">Get it on</div>
                  <div className="text-base font-bold leading-tight">Google Play</div>
                </div>
              </a>

              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                <span>View Google Play Listing</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-primary/10 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Search className="h-3.5 w-3.5 text-primary" />
              Search &ldquo;<strong>Simame</strong>&rdquo; or &ldquo;<strong>Simame - Laundry Connect</strong>&rdquo; on Google Play
            </span>
            <span>•</span>
            <span>Package: <code>com.connectlaundry.app</code></span>
            <span>•</span>
            <span>Region: Ghana</span>
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