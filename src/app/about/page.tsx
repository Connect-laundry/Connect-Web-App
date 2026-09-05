import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ExternalLink, ShieldCheck, Store, Truck } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'
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
  ['Descriptor', 'Laundry Connect'],
  ['Country focus', 'Ghana'],
  ['Website', 'https://simame.tech'],
  ['Official handle', '@simameapp'],
  ['Brand continuity', 'Originally developed and piloted as Connect Laundry (Laundry Connect Ghana)'],
]

export default function AboutPage() {
  return (
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

      <section className="mt-16 rounded-lg border bg-muted/30 p-6 sm:p-8">
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
          Simame was originally developed and piloted under the project name <strong>Connect Laundry</strong> (and <strong>Laundry Connect Ghana</strong>). As the product and provider network grew to support customers and laundry businesses nationwide, the platform unified under the official brand <strong>Simame</strong>. Historical links and references to Connect Laundry remain part of our founding story while active operations continue under Simame.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Company facts</h2>
          <dl className="mt-5 space-y-3 text-sm">
            {factRows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                <dt className="font-semibold">{label}</dt>
                <dd className="text-right text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Official social profiles</h2>
          <div className="mt-5 grid gap-3">
            {VERIFIED_SOCIAL_PROFILES.map((profile) => (
              <Link key={profile.platform} href={profile.url} className="flex items-center justify-between rounded-md border p-4 text-sm hover:border-primary">
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
  )
}