import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { absoluteUrl, noindexMetadata } from '@/shared/lib/seo'

interface ProviderPageProps {
  params: Promise<{ slug: string }>
}

/**
 * Verified Provider Data Model
 * A provider profile is strictly indexable ONLY when:
 * 1. isVerified is true
 * 2. isActive is true
 * 3. status is 'APPROVED'
 * 4. Has genuine unique service description and services
 */
export interface VerifiedProviderProfile {
  slug: string
  name: string
  city: string
  region: string
  address: string
  phone: string
  priceRange: '$' | '$$' | '$$$'
  pricingModel: 'BY_ITEM' | 'BY_WEIGHT' | 'HYBRID'
  rating: number
  reviewCount: number
  isVerified: boolean
  isActive: boolean
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  description: string
  supportedServices: string[]
  operatingHours: string
  serviceRadiusKm: number
}

// In-memory registry of approved partner profiles
// As providers are approved on the production backend, they register here or via backend hydration.
const VERIFIED_PROVIDERS_REGISTRY: Record<string, VerifiedProviderProfile> = {
  // Empty baseline: Production currently has 0 approved laundries.
  // Any unapproved or nonexistent slug triggers notFound() / 404.
}

async function getProviderBySlug(slug: string): Promise<VerifiedProviderProfile | null> {
  const normalizedSlug = slug.toLowerCase().trim()
  const provider = VERIFIED_PROVIDERS_REGISTRY[normalizedSlug]

  if (!provider) {
    return null
  }

  // Strict anti-spam quality gate: Must be verified, active, and approved
  if (!provider.isVerified || !provider.isActive || provider.status !== 'APPROVED') {
    return null
  }

  return provider
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)

  if (!provider) {
    return noindexMetadata('Laundry Partner Not Found')
  }

  const title = `${provider.name} - Laundry & Dry Cleaning in ${provider.city}, Ghana`
  const description = `${provider.name} offers verified laundry services, pickup, wash and fold, and dry cleaning in ${provider.city}. Book securely on Simame.`
  const url = absoluteUrl(`/laundries/${provider.slug}`)

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      siteName: 'Simame',
    },
  }
}

export default async function ProviderProfilePage({ params }: ProviderPageProps) {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)

  // Hard gate: Unverified or non-existent providers return genuine 404
  if (!provider) {
    notFound()
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'DryCleaningOrLaundry',
    '@id': absoluteUrl(`/laundries/${provider.slug}#business`),
    name: provider.name,
    description: provider.description,
    url: absoluteUrl(`/laundries/${provider.slug}`),
    telephone: provider.phone,
    priceRange: provider.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: provider.address,
      addressLocality: provider.city,
      addressRegion: provider.region,
      addressCountry: 'GH',
    },
    ...(provider.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: provider.rating.toFixed(1),
            reviewCount: provider.reviewCount,
          },
        }
      : {}),
  }

  return (
    <PublicPageShell
      eyebrow="Verified Laundry Partner"
      path={`/laundries/${provider.slug}`}
      title={provider.name}
      description={`${provider.name} is an approved laundry partner on the Simame network providing garment care and pickup in ${provider.city}.`}
      ctaHref={`/orders/new?laundry=${provider.slug}`}
      ctaLabel="Book with this Laundry"
    >
      {/* Schema.org LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Partner
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {provider.city}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{provider.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({provider.reviewCount} verified reviews)</span>
              </div>
            </div>

            <h2 className="mt-5 text-xl font-bold">About {provider.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{provider.description}</p>

            <h3 className="mt-8 text-base font-bold">Available Services</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {provider.supportedServices.map((service) => (
                <div key={service} className="flex items-center gap-2 rounded-lg border bg-muted/20 p-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-base font-bold">Business Information</h3>
            <dl className="mt-4 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <dt className="font-semibold text-foreground">Location</dt>
                  <dd className="text-muted-foreground">{provider.address}, {provider.city}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <dt className="font-semibold text-foreground">Operating Hours</dt>
                  <dd className="text-muted-foreground">{provider.operatingHours}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <dt className="font-semibold text-foreground">Pricing Model</dt>
                  <dd className="text-muted-foreground">
                    {provider.pricingModel === 'BY_WEIGHT' ? 'Priced per kg' : 'Priced per garment item'} ({provider.priceRange})
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 border-t pt-6">
              <Link
                href={`/orders/new?laundry=${provider.slug}`}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
              >
                Book with {provider.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}
