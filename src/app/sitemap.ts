import { MetadataRoute } from 'next'
import { getPublicSitemapEntries, isSearchIndexingDisabled } from '@/shared/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  if (isSearchIndexingDisabled()) return []
  return getPublicSitemapEntries()
}
