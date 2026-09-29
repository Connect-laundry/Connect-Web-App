import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { StructuredData } from '@/shared/components/StructuredData'
import { AppDownloadCallout } from '@/shared/components/AppDownloadCallout'
import { GUIDES } from '@/features/guides/data/guides'
import { ORGANIZATION_ID, WEBSITE_ID, absoluteUrl, publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Laundry Guides for Ghana - Stains, Dry Cleaning, Pickup Tips | Simame',
  description:
    'Practical laundry guides for Ghana: choosing a laundry service, dry cleaning vs washing, removing palm oil and red soil stains, hostel laundry for students, and preparing clothes for pickup.',
  path: '/guides',
})

export default function GuidesPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/guides')}#collection`,
    name: 'Simame laundry guides',
    url: absoluteUrl('/guides'),
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: GUIDES.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/guides/${guide.slug}`),
        name: guide.title,
      })),
    },
  }

  return (
    <>
      <StructuredData data={collectionSchema} />
      <PublicPageShell
        eyebrow="Laundry Guides"
        path="/guides"
        title="Laundry guides for Ghana."
        description="Plain, practical answers to everyday laundry questions: stains, dry cleaning, choosing a laundry, hostel laundry and getting ready for pickup."
        ctaHref="/app"
        ctaLabel="Get the app"
      >
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <article key={guide.slug} className="flex flex-col rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
              <h2 className="text-lg font-bold leading-snug">
                <Link href={`/guides/${guide.slug}`} className="hover:text-primary">
                  {guide.title}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{guide.summary}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {guide.readingMinutes} min read
                </span>
                <Link href={`/guides/${guide.slug}`} className="inline-flex items-center gap-1 font-semibold text-primary">
                  Read guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <AppDownloadCallout />
      </PublicPageShell>
    </>
  )
}
