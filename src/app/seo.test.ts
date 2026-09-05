import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import robots from './robots'
import sitemap from './sitemap'
import { COVERAGE_ENTRIES, getIndexableLocationSlugs, isLocationIndexable } from '@/shared/lib/coverage'
import { resolveBackendBaseUrl, PRODUCTION_BACKEND_BASE_URL, STAGING_BACKEND_BASE_URL } from '@/shared/lib/backend-url'
import { SEO_CONTENT_INVENTORY, getIndexableInventoryPaths } from '@/shared/lib/seo-content'
import { ORGANIZATION_SAME_AS, isValidCanonicalSocialUrl } from '@/shared/lib/social'
import { isSearchIndexingDisabled } from '@/shared/lib/seo'

const originalEnv = { ...process.env }

function resetSeoEnv() {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_DISABLE_INDEXING: 'false',
    DISABLE_INDEXING: '',
    NEXT_PUBLIC_SITE_URL: '',
    SITE_URL: '',
    VERCEL_ENV: '',
    NEXT_PUBLIC_VERCEL_ENV: '',
    VERCEL_TARGET_ENV: '',
    NEXT_PUBLIC_VERCEL_TARGET_ENV: '',
    VERCEL_GIT_COMMIT_REF: '',
  }
}

beforeEach(resetSeoEnv)
afterEach(resetSeoEnv)

describe('SEO route configuration', () => {
  it('keeps public trust and authority pages in the sitemap and auth utility pages out', () => {
    const urls = sitemap().map((entry) => entry.url)

    expect(urls).toContain('https://simame.tech/')
    expect(urls).toContain('https://simame.tech/about')
    expect(urls).toContain('https://simame.tech/app')
    expect(urls).toContain('https://simame.tech/services')
    expect(urls).toContain('https://simame.tech/how-it-works')
    expect(urls).toContain('https://simame.tech/for-laundries')
    expect(urls).toContain('https://simame.tech/locations')
    expect(urls).toContain('https://simame.tech/campuses')
    expect(urls).toContain('https://simame.tech/technology')
    expect(urls).toContain('https://simame.tech/press')
    expect(urls).toContain('https://simame.tech/contact')
    expect(urls).toContain('https://simame.tech/privacy')
    expect(urls).toContain('https://simame.tech/terms')
    expect(urls).toContain('https://simame.tech/account-deletion')
    expect(urls).not.toContain('https://simame.tech/auth/login')
    expect(urls).not.toContain('https://simame.tech/auth/register')
    expect(urls).not.toContain('https://simame.tech/locations/accra')
    expect(urls).not.toContain('https://simame.tech/campuses/knust')
  })

  it('keeps develop and staging environments out of the sitemap and flags indexing as disabled', () => {
    // Production default: indexing is enabled
    expect(isSearchIndexingDisabled()).toBe(false)

    // Develop branch: indexing disabled
    process.env.VERCEL_GIT_COMMIT_REF = 'develop'
    expect(isSearchIndexingDisabled()).toBe(true)
    expect(sitemap()).toEqual([])

    // Staging site URL: indexing disabled
    process.env.VERCEL_GIT_COMMIT_REF = ''
    process.env.NEXT_PUBLIC_SITE_URL = 'https://staging.simame.tech'
    expect(isSearchIndexingDisabled()).toBe(true)
    expect(sitemap()).toEqual([])

    // Preview environment: indexing disabled
    process.env.NEXT_PUBLIC_SITE_URL = ''
    process.env.VERCEL_ENV = 'preview'
    expect(isSearchIndexingDisabled()).toBe(true)
    expect(sitemap()).toEqual([])
  })

  it('never emits staging, preview, localhost, or vercel app URLs as production canonicals', () => {
    const urls = sitemap().map((entry) => entry.url)

    expect(urls.every((url) => url.startsWith('https://simame.tech'))).toBe(true)
    expect(urls.join('\n')).not.toMatch(/staging\.simame\.tech|localhost|vercel\.app/i)
  })

  it('disallows private app surfaces while leaving public pages crawlable', () => {
    const config = robots()
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules

    expect(rules.allow).toBe('/')
    expect(rules.disallow).toEqual(
      expect.arrayContaining([
        '/api/',
        '/auth/',
        '/dashboard/',
        '/orders/',
        '/business/',
        '/notifications/',
        '/earnings/',
        '/staff/',
        '/settings/',
        '/onboarding/',
      ]),
    )
  })
})

describe('backend URL resolution and isolation', () => {
  it('pins production domains to the production backend', () => {
    expect(resolveBackendBaseUrl('simame.tech')).toBe(PRODUCTION_BACKEND_BASE_URL)
    expect(resolveBackendBaseUrl('www.simame.tech')).toBe(PRODUCTION_BACKEND_BASE_URL)
  })

  it('pins staging to the staging backend', () => {
    expect(resolveBackendBaseUrl('staging.simame.tech')).toBe(STAGING_BACKEND_BASE_URL)
  })

  it('pins develop and preview deployments to the staging backend', () => {
    process.env.VERCEL_GIT_COMMIT_REF = 'develop'
    expect(resolveBackendBaseUrl('connect-web-app-zeta.vercel.app')).toBe(STAGING_BACKEND_BASE_URL)

    process.env.VERCEL_GIT_COMMIT_REF = ''
    process.env.VERCEL_ENV = 'preview'
    expect(resolveBackendBaseUrl('connect-web-app-zeta.vercel.app')).toBe(STAGING_BACKEND_BASE_URL)
  })

  it('strictly isolates backend origins in next.config.mjs CSP rules', () => {
    const nextConfigContent = readFileSync(join(process.cwd(), 'next.config.mjs'), 'utf8')
    expect(nextConfigContent).toContain('connect-full-backend-production.onrender.com')
    expect(nextConfigContent).toContain('connect-full-backend.onrender.com')
    expect(nextConfigContent).toContain('const backendOrigin = disableIndexing')
  })
})

describe('entity and content governance', () => {
  it('keeps every indexable inventory route represented in the sitemap', () => {
    const sitemapUrls = new Set(sitemap().map((entry) => entry.url.replace('https://simame.tech', '') || '/'))

    expect(getIndexableInventoryPaths().every((path) => sitemapUrls.has(path))).toBe(true)
  })

  it('keeps verified social sameAs URLs canonical and excludes profiles needing founder review', () => {
    expect(ORGANIZATION_SAME_AS).toEqual([
      'https://www.instagram.com/simameapp/',
      'https://x.com/simameapp',
      'https://www.youtube.com/@simameapp',
    ])
    expect(ORGANIZATION_SAME_AS.every(isValidCanonicalSocialUrl)).toBe(true)
    expect(ORGANIZATION_SAME_AS).not.toContain('https://www.tiktok.com/@simameapp')
  })

  it('gates city and campus pages until provider coverage is verified', () => {
    expect(getIndexableLocationSlugs()).toEqual(['ghana'])
    expect(isLocationIndexable('accra')).toBe(false)
    expect(isLocationIndexable('kumasi')).toBe(false)
    expect(isLocationIndexable('knust')).toBe(false)
    expect(COVERAGE_ENTRIES.every((entry) => entry.reason.length > 40)).toBe(true)
  })

  it('keeps each public content item accountable to an owner and query intent', () => {
    expect(SEO_CONTENT_INVENTORY.every((item) => item.owner && item.intent && item.targetQueries.length > 0)).toBe(true)
  })

  it('preserves historical continuity of Connect Laundry on the About page without keyword stuffing', () => {
    const aboutSource = readFileSync(join(process.cwd(), 'src/app/about/page.tsx'), 'utf8')
    expect(aboutSource).toMatch(/Connect Laundry/i)
    expect(aboutSource).toMatch(/Brand heritage (&amp;|&) continuity/i)
    expect(aboutSource).toMatch(/Official brand', 'Simame'/i)
  })

  it('blocks high-risk unsupported public marketing claims from returning', () => {
    const files = [
      'src/app/page.tsx',
      'src/features/landing/data/landingData.ts',
      'src/features/landing/components/Hero.tsx',
      'src/features/landing/components/Footer.tsx',
      'src/features/marketing/data/landingContent.ts',
      'src/features/marketing/components/MarketingHero.tsx',
      'src/features/marketing/components/MarketingFooter.tsx',
      'src/features/marketing/components/TrustPills.tsx',
    ]
    const publicMarketingSource = files
      .map((file) => readFileSync(join(process.cwd(), file), 'utf8'))
      .join('\n')

    expect(publicMarketingSource).not.toMatch(
      /Ghana'?s first|number one|#1|1000\+|1,000\+|4\.9\/5|nationwide|all Ghana|all campuses|free pickup|free delivery|100% happiness|same-day service/i,
    )
  })
})