import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Newspaper, Type } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'
import { SOCIAL_PROFILES, VERIFIED_SOCIAL_PROFILES } from '@/shared/lib/social'

export const metadata: Metadata = publicPageMetadata({
  title: 'Simame Press and Media Kit',
  description:
    'Official Simame company facts, brand spelling (S-I-M-A-M-E), logo reference, social profile review status, and press contact information.',
  path: '/press',
})

/**
 * Canonical entity descriptions for journalists, partners, and AI citation.
 * These are the approved descriptions in order of length.
 * Do NOT alter without founder approval.
 */
const ENTITY_DESCRIPTIONS = {
  short:
    'Simame is a Ghanaian digital laundry marketplace that helps customers book pickup, delivery, wash and fold, dry cleaning, and ironing with trusted local partners.',
  medium:
    'Simame is a Ghanaian laundry marketplace connecting customers with verified laundry service providers. Users can schedule pickup, track orders, and request wash and fold, dry cleaning, ironing, and garment care through the Simame app. Laundry businesses join as partners and manage orders, pricing, and operations through a dedicated dashboard.',
  press:
    'Simame (Laundry Connect) is a Ghanaian digital laundry marketplace that connects customers in Accra, Kumasi, and across Ghana with trusted local laundry and dry cleaning providers. Through the Simame platform, customers can schedule doorstep laundry pickup, request wash and fold, dry cleaning, ironing, and garment care services, and track their orders in one digital experience. Laundry businesses partner with Simame to receive digital orders, manage pricing and hours, and coordinate staff and delivery operations. Simame was formerly piloted under the name Connect Laundry. Website: simame.tech | Social: @simameapp',
}

const brandFacts = [
  { label: 'Official name', value: 'Simame' },
  { label: 'Spelling', value: 'S-I-M-A-M-E' },
  { label: 'Descriptor', value: 'Laundry Connect' },
  { label: 'Category', value: 'Ghanaian digital laundry marketplace' },
  { label: 'Website', value: 'simame.tech', href: 'https://simame.tech' },
  { label: 'Official handle', value: '@simameapp' },
  { label: 'Contact', value: 'info@simame.tech', href: 'mailto:info@simame.tech' },
  { label: 'Previously known as', value: 'Connect Laundry (Laundry Connect Ghana)' },
]

export default function PressPage() {
  return (
    <PublicPageShell
      eyebrow="Press"
      path="/press"
      title="Official Simame facts for media, partners, and search engines."
      description="Use this page as the canonical public source for Simame brand spelling, company description, website, contact details, verified social profiles, and future press links."
      ctaHref="/contact"
      ctaLabel="Contact Simame"
    >
      {/*
       * Brand identity card — primary reference for journalists and AI systems.
       * Spelling is explicitly shown to prevent brand confusion and accidental misspellings.
       */}
      <section
        className="mt-12 rounded-lg border-2 border-primary/30 bg-primary/5 p-6 sm:p-8"
        aria-labelledby="brand-identity-heading"
      >
        <div className="flex items-center gap-3 mb-5">
          <Type className="h-5 w-5 text-primary shrink-0" />
          <h2 id="brand-identity-heading" className="text-xl font-bold">
            Official brand identity
          </h2>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2 text-sm">
          {brandFacts.map(({ label, value, href }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </dt>
              <dd className="font-medium">
                {href ? (
                  <Link href={href} className="text-primary hover:underline">
                    {value}
                  </Link>
                ) : label === 'Spelling' ? (
                  <span className="text-2xl font-black tracking-[0.35em] text-primary">{value}</span>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-xs text-muted-foreground border-t pt-4">
          When writing about Simame, please use the spelling above. The correct brand name is{' '}
          <strong>Simame</strong> — use the exact spelling S-I-M-A-M-E to avoid confusion with
          unrelated brands or accidental misspellings.
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        {/* Approved descriptions */}
        <section className="rounded-lg border bg-card p-6 shadow-sm" aria-labelledby="descriptions-heading">
          <h2 id="descriptions-heading" className="text-xl font-bold">
            Approved company descriptions
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Short (1 sentence)
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{ENTITY_DESCRIPTIONS.short}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Medium (2–3 sentences)
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{ENTITY_DESCRIPTIONS.medium}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Press boilerplate (~100 words)
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{ENTITY_DESCRIPTIONS.press}</p>
            </div>
          </div>
        </section>

        {/* Brand asset */}
        <section className="rounded-lg border bg-card p-6 shadow-sm" aria-labelledby="brand-asset-heading">
          <h2 id="brand-asset-heading" className="text-xl font-bold">
            Brand asset
          </h2>
          <div className="mt-5 rounded-lg border bg-background p-6">
            <Image
              src="/images/SIMAME_BRAND_LOGO-01.png"
              alt="Official Simame brand logo — the word Simame in the brand typeface"
              width={520}
              height={260}
              className="h-auto w-full"
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Use the Simame spelling consistently. Additional approved screenshots, founder bios, and
            press milestones should be added only after founder review.
          </p>
        </section>
      </div>

      {/* Verified social graph */}
      <section className="mt-8 rounded-lg border bg-card p-6 shadow-sm" aria-labelledby="social-heading">
        <h2 id="social-heading" className="text-xl font-bold">
          Verified social profiles
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All official Simame social accounts use the handle <strong>@simameapp</strong>.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {VERIFIED_SOCIAL_PROFILES.map((profile) => (
            <Link
              key={profile.platform}
              href={profile.url}
              className="rounded-md border p-4 text-sm hover:border-primary"
            >
              <span className="font-semibold">{profile.platform}</span>
              <span className="mt-1 flex items-center gap-2 text-muted-foreground">
                {profile.handle}
                <ExternalLink className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Founder review queue */}
      <section className="mt-8 rounded-lg border bg-muted/30 p-6" aria-labelledby="review-queue-heading">
        <div className="flex items-center gap-3">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 id="review-queue-heading" className="text-xl font-bold">
            Founder review queue
          </h2>
        </div>
        <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
          {SOCIAL_PROFILES.filter((profile) => profile.status !== 'verified').map((profile) => (
            <li key={profile.platform}>
              {profile.platform}: {profile.action}
            </li>
          ))}
          <li>
            Press links, awards, competitions, and additional Connect Laundry history should not be
            published as facts until externally verified or founder-approved.
          </li>
        </ul>
      </section>
    </PublicPageShell>
  )
}