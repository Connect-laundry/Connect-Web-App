import type { Metadata, MetadataRoute } from 'next'
import { SEO_CONTENT_INVENTORY } from './seo-content'
import { GUIDES } from '@/features/guides/data/guides'

export const SITE_NAME = 'Simame'
export const SITE_URL = 'https://simame.tech'
export const STAGING_SITE_URL = 'https://staging.simame.tech'
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const GOOGLE_PLAY_PACKAGE_NAME = 'com.connectlaundry.app'
export const GOOGLE_PLAY_URL = `https://play.google.com/store/apps/details?id=${GOOGLE_PLAY_PACKAGE_NAME}`
// Play Console attributes installs that arrive with a `referrer` UTM string.
export const GOOGLE_PLAY_WEBSITE_URL = `${GOOGLE_PLAY_URL}&referrer=${encodeURIComponent(
  'utm_source=simame.tech&utm_medium=website&utm_campaign=download',
)}`
export const DOWNLOAD_PATH = '/download'
export const APP_NAME = 'Simame - Laundry Connect'
export const APP_ID = `${SITE_URL}/app#software`

export const SEO_DESCRIPTION =
  'Simame helps customers in Ghana arrange laundry pickup, delivery, wash and fold, dry cleaning, ironing, and garment care with trusted laundry partners.'

export const PUBLIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly', lastModified: '2026-09-29' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/app', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-09-29' },
  { path: '/connect-laundry', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-09-29' },
  { path: '/guides', priority: 0.7, changeFrequency: 'weekly', lastModified: '2026-09-29' },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/for-laundries', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/locations', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/campuses', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/technology', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/press', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/account-deletion', priority: 0.4, changeFrequency: 'yearly' },
] as const satisfies ReadonlyArray<{
  path: string
  priority: number
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
  lastModified?: string
}>

const DEFAULT_LAST_MODIFIED = '2026-09-05'

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, SITE_URL).toString()
}

export function isSearchIndexingDisabled() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || ''
  const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV || ''
  const targetEnv = process.env.VERCEL_TARGET_ENV || process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV || ''
  const gitBranch = process.env.VERCEL_GIT_COMMIT_REF || ''

  return (
    process.env.NEXT_PUBLIC_DISABLE_INDEXING === 'true' ||
    process.env.DISABLE_INDEXING === 'true' ||
    siteUrl.includes('staging.simame.tech') ||
    vercelEnv === 'preview' ||
    targetEnv === 'preview' ||
    targetEnv === 'staging' ||
    gitBranch === 'develop'
  )
}

export function publicPageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = absoluteUrl(path)

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_GH',
      images: [
        {
          url: absoluteUrl('/images/SIMAME_BRAND_LOGO-01.png'),
          width: 1200,
          height: 630,
          alt: 'Simame laundry pickup and delivery in Ghana',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/images/SIMAME_BRAND_LOGO-01.png')],
    },
  }
}

export function noindexMetadata(title = SITE_NAME): Metadata {
  return {
    title: { absolute: title },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  }
}

export function getPublicSitemapEntries(): MetadataRoute.Sitemap {
  const indexablePaths = new Set(
    SEO_CONTENT_INVENTORY.filter((item) => item.indexable).map((item) => item.path),
  )

  const routes = PUBLIC_ROUTES.filter((route) => indexablePaths.has(route.path)).map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date('lastModified' in route ? route.lastModified : DEFAULT_LAST_MODIFIED),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const guides = GUIDES.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: new Date(guide.dateModified),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...guides]
}

/**
 * The one MobileApplication entity for the Android app. Every page that
 * describes the app emits this same @id so search engines see a single app.
 * No aggregateRating: add one only from real Google Play ratings.
 */
export function mobileApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    '@id': APP_ID,
    name: APP_NAME,
    alternateName: ['Simame', 'Simame Laundry App', 'Simame App', 'Connect Laundry app', 'Laundry Connect app'],
    url: absoluteUrl('/app'),
    image: absoluteUrl('/images/SIMAME_EVOLVED_APPICON-01.png'),
    installUrl: GOOGLE_PLAY_URL,
    downloadUrl: GOOGLE_PLAY_URL,
    sameAs: [GOOGLE_PLAY_URL],
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Android',
    countriesSupported: 'GH',
    inLanguage: 'en',
    description:
      'Simame - Laundry Connect is a laundry app for Ghana. Find laundry services near you, book pickup and delivery, choose wash and fold, dry cleaning or ironing, pay with Mobile Money or card, and track your order.',
    publisher: { '@id': ORGANIZATION_ID },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GHS',
    },
  }
}