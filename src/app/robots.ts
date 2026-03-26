import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://connectlaundry.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Disallow crawling private or API routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
