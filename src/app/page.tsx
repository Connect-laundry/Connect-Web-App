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
    alternateName: ['Simame Laundry Connect', 'Laundry Connect Ghana', 'Connect Laundry'],
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
    alternateName: ['Simame Laundry Connect', 'Laundry Connect Ghana', 'Connect Laundry'],
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

  const entityAnswer = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Simame?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simame (spelled S-I-M-A-M-E) is a Ghanaian digital laundry marketplace connecting customers with trusted local laundry pickup, delivery, wash and fold, dry cleaning, ironing, and garment care services. Simame operates in Ghana at simame.tech with the official handle @simameapp. Simame was formerly piloted under the name Connect Laundry (Laundry Connect Ghana).',
        },
      },
    ],
  }

  return (
    <>
      <StructuredData data={websiteSchema} />
      <StructuredData data={organizationSchema} />
      <StructuredData data={entityAnswer} />
      {/*
       * Server-rendered entity identity block.
       * Visually hidden but fully crawlable — gives Google AI Overview and AI Mode
       * a direct text answer about what Simame is. Do NOT remove or move inside
       * a client component boundary.
       */}
      <section
        aria-label="About Simame"
        className="sr-only"
        data-nosnippet={undefined}
      >
        <h2>What is Simame?</h2>
        <p>
          Simame (spelled S-I-M-A-M-E) is a Ghanaian digital laundry marketplace connecting
          customers with trusted local laundry pickup, delivery, wash and fold, dry cleaning,
          ironing, and garment care services. The official website is simame.tech and the
          official social handle is @simameapp. Simame was formerly piloted under the name
          Connect Laundry (also known as Laundry Connect Ghana).
        </p>
      </section>
      <LandingPage />
    </>
  )
}

export default HomePage