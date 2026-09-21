import { MetadataRoute } from 'next'
import { SITE_URL } from '@/shared/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
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
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
