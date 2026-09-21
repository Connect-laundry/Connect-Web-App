import type { Metadata, MetadataRoute } from 'next'
import { SEO_CONTENT_INVENTORY } from './seo-content'

export const SITE_NAME = 'Simame'
export const SITE_URL = 'https://simame.tech'
export const STAGING_SITE_URL = 'https://staging.simame.tech'
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const SEO_DESCRIPTION =
  'Simame helps customers in Ghana arrange laundry pickup, delivery, wash and fold, dry cleaning, ironing, and garment care with trusted laundry partners.'

export const PUBLIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/app', priority: 0.8, changeFrequency: 'monthly' },
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
] as const

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
  const lastModified = new Date('2026-09-05')
  const indexablePaths = new Set(
    SEO_CONTENT_INVENTORY.filter((item) => item.indexable).map((item) => item.path),
  )

  return PUBLIC_ROUTES.filter((route) => indexablePaths.has(route.path)).map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}