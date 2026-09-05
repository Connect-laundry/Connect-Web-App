export type CoverageType = 'national' | 'city' | 'campus'
export type CoverageIndexStatus = 'indexable_hub' | 'not_indexable_yet'

export interface CoverageEntry {
  type: CoverageType
  name: string
  slug: string
  region?: string
  indexStatus: CoverageIndexStatus
  reason: string
  targetQueries: string[]
}

export const COVERAGE_ENTRIES: CoverageEntry[] = [
  {
    type: 'national',
    name: 'Ghana',
    slug: 'ghana',
    indexStatus: 'indexable_hub',
    reason:
      'Simame is positioned as a Ghanaian laundry marketplace, but city-level availability must still be verified through active provider supply.',
    targetQueries: ['laundry Ghana', 'laundry app Ghana', 'laundry marketplace Ghana'],
  },
  {
    type: 'city',
    name: 'Accra',
    slug: 'accra',
    region: 'Greater Accra',
    indexStatus: 'not_indexable_yet',
    reason:
      'Accra is strategically important, but this web app does not yet expose a public active-provider source of truth for Accra.',
    targetQueries: ['laundry Accra', 'laundry pickup Accra', 'dry cleaning Accra'],
  },
  {
    type: 'city',
    name: 'Kumasi',
    slug: 'kumasi',
    region: 'Ashanti',
    indexStatus: 'not_indexable_yet',
    reason:
      'Kumasi has strong strategic relevance, but an indexable city page requires verified active providers and unique local inventory.',
    targetQueries: ['laundry Kumasi', 'laundry delivery Kumasi', 'dry cleaning Kumasi'],
  },
  {
    type: 'campus',
    name: 'KNUST',
    slug: 'knust',
    region: 'Ashanti',
    indexStatus: 'not_indexable_yet',
    reason:
      'KNUST can support Simame origin and student-laundry relevance only after founder-approved history and active service coverage are verified.',
    targetQueries: ['laundry KNUST', 'student laundry KNUST', 'campus laundry Kumasi'],
  },
]

export const PROVIDER_INDEX_REQUIREMENTS = [
  'Provider is active and approved.',
  'Public profile is approved for indexing.',
  'Services, pricing model, hours, area, and contact/booking flow are meaningful.',
  'Content is unique and not copied from another provider.',
  'Profile is not a test, placeholder, inactive, or spam listing.',
]

export function getIndexableLocationSlugs() {
  return COVERAGE_ENTRIES.filter((entry) => entry.indexStatus === 'indexable_hub').map(
    (entry) => entry.slug,
  )
}

export function isLocationIndexable(slug: string) {
  return COVERAGE_ENTRIES.some(
    (entry) => entry.slug === slug && entry.indexStatus === 'indexable_hub',
  )
}