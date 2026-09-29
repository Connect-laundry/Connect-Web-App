import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { StructuredData } from '@/shared/components/StructuredData'
import { AppDownloadCallout } from '@/shared/components/AppDownloadCallout'
import { GUIDES, getGuideBySlug } from '@/features/guides/data/guides'
import { ORGANIZATION_ID, WEBSITE_ID, absoluteUrl, publicPageMetadata } from '@/shared/lib/seo'

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) return {}

  const metadata = publicPageMetadata({
    title: `${guide.metaTitle} | Simame`,
    description: guide.description,
    path: `/guides/${guide.slug}`,
  })

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
    },
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) notFound()

  const url = absoluteUrl(`/guides/${guide.slug}`)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: guide.title,
    description: guide.description,
    url,
    mainEntityOfPage: url,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    inLanguage: 'en-GH',
    image: absoluteUrl('/images/SIMAME_BRAND_LOGO-01.png'),
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': WEBSITE_ID },
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
  const related = GUIDES.filter((other) => other.slug !== guide.slug).slice(0, 3)

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={faqSchema} />
      <PublicPageShell
        eyebrow="Laundry Guide"
        breadcrumbLabel={guide.metaTitle}
        parent={{ label: 'Guides', path: '/guides' }}
        path={`/guides/${guide.slug}`}
        title={guide.title}
        description={guide.description}
        ctaHref="/app"
        ctaLabel="Get the app"
      >
        <p className="mt-4 text-xs text-muted-foreground">
          By the Simame team · Updated{' '}
          <time dateTime={guide.dateModified}>
            {new Date(guide.dateModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>{' '}
          · {guide.readingMinutes} min read
        </p>

        <article className="mt-10 max-w-3xl space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 text-base leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 40)}>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.steps && (
                <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                  {section.steps.map((step) => (
                    <li key={step.slice(0, 40)}>{step}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}

          <section aria-labelledby="guide-faq-heading">
            <h2 id="guide-faq-heading" className="text-2xl font-bold tracking-tight">
              Common questions
            </h2>
            <div className="mt-4 divide-y divide-border rounded-lg border bg-card shadow-sm">
              {guide.faqs.map((faq) => (
                <div key={faq.question} className="px-6 py-5">
                  <h3 className="text-base font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <AppDownloadCallout />

        <nav aria-labelledby="related-guides-heading" className="mt-12">
          <h2 id="related-guides-heading" className="text-lg font-bold">
            More laundry guides
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/guides/${other.slug}`}
                  className="block h-full rounded-lg border bg-card p-4 text-sm font-semibold leading-6 transition hover:border-primary/40 hover:text-primary"
                >
                  {other.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PublicPageShell>
    </>
  )
}
