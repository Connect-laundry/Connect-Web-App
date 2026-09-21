import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ExternalLink, ShieldCheck, Store, Truck } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { StructuredData } from '@/shared/components/StructuredData'
import { ORGANIZATION_ID, absoluteUrl, publicPageMetadata } from '@/shared/lib/seo'
import { VERIFIED_SOCIAL_PROFILES } from '@/shared/lib/social'

export const metadata: Metadata = publicPageMetadata({
  title: 'About Simame - Laundry Connect in Ghana',
  description:
    'Learn how Simame connects customers with laundry pickup, delivery, dry cleaning, ironing, and garment care services in Ghana.',
  path: '/about',
})

const values = [
  {
    title: 'Built for everyday laundry needs',
    description:
      'Simame helps customers arrange pickup, cleaning, tracking, and delivery without calling several providers.',
    icon: Truck,
  },
  {
    title: 'Designed with laundry partners',
    description:
      'Partner laundries get tools for orders, pricing, hours, staff coordination, and operational visibility.',
    icon: Store,
  },
  {
    title: 'Focused on trust and clarity',
    description:
      'The platform is shaped around clear service information, visible support channels, and accountable order handling.',
    icon: ShieldCheck,
  },
]

const factRows = [
  ['Official brand', 'Simame'],
  ['Spelling', 'S-I-M-A-M-E'],
  ['Descriptor', 'Laundry Connect'],
  ['Country focus', 'Ghana'],
  ['Website', 'https://simame.tech'],
  ['Official handle', '@simameapp'],
  ['Brand continuity', 'Originally developed and piloted as Connect Laundry (Laundry Connect Ghana)'],
]

const faqItems = [
  {
    question: 'What is Simame?',
    answer:
      'Simame is a Ghanaian digital laundry marketplace that connects customers with trusted local laundry pickup, delivery, wash and fold, dry cleaning, ironing, and garment care services.',
  },
  {
    question: 'How is Simame spelled?',
    answer:
      'Simame is spelled S-I-M-A-M-E. The official website is simame.tech and the official social handle is @simameapp.',
  },
  {
    question: 'Is Simame a laundry company or a marketplace?',
    answer:
      'Simame is a digital laundry marketplace. It connects customers with independent partner laundry businesses rather than operating its own laundry facilities.',
  },
  {
    question: 'Where is Simame based and where does it operate?',
    answer:
      'Simame is a Ghanaian platform. It operates in supported Ghana service areas including Accra, Kumasi, and near university campuses. Coverage depends on active partner availability in each area.',
  },
  {
    question: 'What was Connect Laundry?',
    answer:
      'Connect Laundry (also known as Laundry Connect Ghana) was the founding project name under which Simame was originally developed and piloted. As the provider network and product matured, the platform unified under the official brand Simame. Connect Laundry is now Simame.',
  },
  {
    question: 'What is @simameapp?',
    answer:
      '@simameapp is the official social media handle for Simame across Instagram, X, YouTube, TikTok, and other platforms.',
  },
  {
    question: 'Where can I find the Simame app?',
    answer:
      'The Simame app is available for Android and iOS. Search for "Simame" on Google Play or the Apple App Store. Official store listing links are published at simame.tech/app.',
  },
  {
    question: 'How can I contact Simame or the press team?',
    answer:
      'Media and general enquiries can be sent to info@simame.tech. Full contact and press kit information is available at simame.tech/press.',
  },
]

export default function AboutPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    isPartOf: { '@id': `https://simame.tech/#website` },
    about: { '@id': ORGANIZATION_ID },
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://simame.tech' },
      { '@type': 'ListItem', position: 2, name: 'About', item: absoluteUrl('/about') },
    ],
  }

  return (
    <>
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <PublicPageShell
        eyebrow="About Simame"
        path="/about"
        title="A laundry connect platform for customers and laundry businesses in Ghana."
        description="Simame brings laundry pickup, delivery, wash and fold, dry cleaning, ironing, and garment care into one digital experience. Customers get a simpler way to arrange laundry services, while partner businesses get a dashboard for managing the work behind every order."
      >
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-lg border bg-card p-6 shadow-sm">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="mt-5 text-lg font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </article>
            )
          })}
        </div>

        {/* AI-citation-ready FAQ section — visible HTML, not just schema */}
        <section className="mt-16" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold">
            Frequently asked questions about Simame
          </h2>
          <div className="mt-6 divide-y divide-border rounded-lg border bg-card shadow-sm">
            {faqItems.map((item) => (
              <details key={item.question} className="group px-6 py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold leading-6 marker:hidden list-none">
                  {item.question}
                  <span className="shrink-0 text-primary text-xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border bg-muted/30 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">What Simame does</h2>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              'Helps customers request laundry pickup and delivery.',
              'Supports wash and fold, dry cleaning, ironing, and garment care workflows.',
              'Gives laundry owners tools for orders, pricing, hours, and staff.',
              'Keeps public trust information easy to find before someone signs in.',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Brand heritage &amp; continuity</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Simame was originally developed and piloted under the project name{' '}
            <strong>Connect Laundry</strong> (and <strong>Laundry Connect Ghana</strong>). As the
            product and provider network grew to support customers and laundry businesses
            nationwide, the platform unified under the official brand <strong>Simame</strong>.
            Historical links and references to Connect Laundry remain part of our founding story
            while active operations continue under Simame.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Company facts</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {factRows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <dt className="font-semibold shrink-0">{label}</dt>
                  <dd className="text-right text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Official social profiles</h2>
            <div className="mt-5 grid gap-3">
              {VERIFIED_SOCIAL_PROFILES.map((profile) => (
                <Link
                  key={profile.platform}
                  href={profile.url}
                  className="flex items-center justify-between rounded-md border p-4 text-sm hover:border-primary"
                >
                  <span>
                    <span className="block font-semibold">{profile.platform}</span>
                    <span className="text-muted-foreground">{profile.handle}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}