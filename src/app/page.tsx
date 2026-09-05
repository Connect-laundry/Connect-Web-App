import type { Metadata } from 'next'
import { LandingPage } from '@/features/landing/components/LandingPage'
import { StructuredData } from '@/shared/components/StructuredData'
import {
  ORGANIZATION_ID,
  SEO_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
  publicPageMetadata,
} from '@/shared/lib/seo'
import { ORGANIZATION_SAME_AS } from '@/shared/lib/social'

export const metadata: Metadata = publicPageMetadata({
  title: 'Simame - Laundry Pickup and Delivery in Ghana',
  description: SEO_DESCRIPTION,
  path: '/',
})

const HomePage = () => {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    alternateName: 'Simame Laundry Connect',
    url: SITE_URL,
    inLanguage: 'en-GH',
    description: SEO_DESCRIPTION,
    publisher: { '@id': ORGANIZATION_ID },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: 'Simame Laundry Connect',
    url: SITE_URL,
    logo: absoluteUrl('/images/SIMAME_BRAND_LOGO-01.png'),
    image: absoluteUrl('/images/SIMAME_BRAND_LOGO-01.png'),
    description: SEO_DESCRIPTION,
    email: 'info@simame.tech',
    sameAs: ORGANIZATION_SAME_AS,
    areaServed: {
      '@type': 'Country',
      name: 'Ghana',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+233200909897',
        contactType: 'customer support',
        areaServed: 'GH',
        availableLanguage: ['English'],
      },
    ],
  }

  return (
    <>
      <StructuredData data={websiteSchema} />
      <StructuredData data={organizationSchema} />
      <LandingPage />
    </>
  )
}

export default HomePage