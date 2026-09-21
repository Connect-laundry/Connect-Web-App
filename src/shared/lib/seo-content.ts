export type SearchIntentGroup =
  | 'brand'
  | 'legacy'
  | 'service'
  | 'local'
  | 'campus'
  | 'app'
  | 'business'
  | 'innovation'
  | 'informational'
  | 'trust'

export interface SeoContentInventoryItem {
  path: string
  intent: SearchIntentGroup
  title: string
  indexable: boolean
  owner: string
  lastReviewed: string
  targetQueries: string[]
  conversionGoal: string
}

export const SEO_CONTENT_INVENTORY: SeoContentInventoryItem[] = [
  {
    path: '/',
    intent: 'brand',
    title: 'Simame - Laundry Pickup and Delivery in Ghana',
    indexable: true,
    owner: 'Growth',
    lastReviewed: '2026-09-05',
    targetQueries: ['Simame', 'Simame laundry', 'Simame Ghana', 'laundry app Ghana'],
    conversionGoal: 'Start customer or laundry-owner registration.',
  },
  {
    path: '/about',
    intent: 'brand',
    title: 'About Simame - Laundry Connect in Ghana',
    indexable: true,
    owner: 'Founder',
    lastReviewed: '2026-09-05',
    targetQueries: ['what is Simame', 'Simame Ghana', 'Simame laundry connect'],
    conversionGoal: 'Establish trust and company/entity clarity.',
  },
  {
    path: '/app',
    intent: 'app',
    title: 'Simame App - Laundry Booking for Ghana',
    indexable: true,
    owner: 'Product',
    lastReviewed: '2026-09-05',
    targetQueries: ['Simame app', 'laundry app Ghana', 'laundry booking app'],
    conversionGoal: 'Prepare users for app discovery and store clicks when listings are live.',
  },
  {
    path: '/services',
    intent: 'service',
    title: 'Laundry Services on Simame',
    indexable: true,
    owner: 'Operations',
    lastReviewed: '2026-09-05',
    targetQueries: ['laundry services Ghana', 'dry cleaning Ghana', 'wash and fold Ghana'],
    conversionGoal: 'Help users understand supported service categories.',
  },
  {
    path: '/how-it-works',
    intent: 'informational',
    title: 'How Simame Works',
    indexable: true,
    owner: 'Product',
    lastReviewed: '2026-09-05',
    targetQueries: ['how laundry pickup works', 'how Simame works', 'laundry pickup Ghana'],
    conversionGoal: 'Explain the marketplace workflow clearly.',
  },
  {
    path: '/for-laundries',
    intent: 'business',
    title: 'For Laundry Businesses - Join Simame',
    indexable: true,
    owner: 'Partnerships',
    lastReviewed: '2026-09-05',
    targetQueries: ['laundry business Ghana', 'laundry owner dashboard', 'join laundry marketplace'],
    conversionGoal: 'Convert laundry providers into registrations.',
  },
  {
    path: '/locations',
    intent: 'local',
    title: 'Simame Locations in Ghana',
    indexable: true,
    owner: 'Operations',
    lastReviewed: '2026-09-05',
    targetQueries: ['laundry Ghana', 'laundry Accra', 'laundry Kumasi'],
    conversionGoal: 'Show availability policy without overstating coverage.',
  },
  {
    path: '/campuses',
    intent: 'campus',
    title: 'Campus Laundry with Simame',
    indexable: true,
    owner: 'Campus Growth',
    lastReviewed: '2026-09-05',
    targetQueries: ['campus laundry Ghana', 'student laundry Ghana', 'laundry KNUST'],
    conversionGoal: 'Explain student/campus value while gating campus pages.',
  },
  {
    path: '/technology',
    intent: 'innovation',
    title: 'Simame Technology and Marketplace Model',
    indexable: true,
    owner: 'Product',
    lastReviewed: '2026-09-05',
    targetQueries: ['Ghanaian startup apps', 'digital marketplace Ghana', 'laundry technology Ghana'],
    conversionGoal: 'Support technology and startup discovery with factual product substance.',
  },
  {
    path: '/press',
    intent: 'trust',
    title: 'Simame Press and Media Kit',
    indexable: true,
    owner: 'Founder',
    lastReviewed: '2026-09-05',
    targetQueries: ['Simame press', 'Simame logo', 'Simame company information'],
    conversionGoal: 'Give journalists and partners an authoritative fact source.',
  },
  {
    path: '/contact',
    intent: 'trust',
    title: 'Contact Simame - Laundry Support in Ghana',
    indexable: true,
    owner: 'Support',
    lastReviewed: '2026-09-05',
    targetQueries: ['Simame contact', 'Simame support', 'Simame Ghana contact'],
    conversionGoal: 'Route users to official support.',
  },
  {
    path: '/privacy',
    intent: 'trust',
    title: 'Privacy Policy - Simame',
    indexable: true,
    owner: 'Legal',
    lastReviewed: '2026-09-05',
    targetQueries: ['Simame privacy policy'],
    conversionGoal: 'Support store review, trust, and legal transparency.',
  },
  {
    path: '/terms',
    intent: 'trust',
    title: 'Terms of Service - Simame',
    indexable: true,
    owner: 'Legal',
    lastReviewed: '2026-09-05',
    targetQueries: ['Simame terms'],
    conversionGoal: 'Support trust and legal transparency.',
  },
  {
    path: '/account-deletion',
    intent: 'trust',
    title: 'Account Deletion - Simame',
    indexable: true,
    owner: 'Legal',
    lastReviewed: '2026-09-05',
    targetQueries: ['delete Simame account', 'Simame account deletion'],
    conversionGoal: 'Support app-store policy and user rights.',
  },
]

export const SEARCH_OPPORTUNITY_GROUPS: Record<SearchIntentGroup, string[]> = {
  brand: ['Simame', 'Simame app', 'Simame laundry', 'Simame Ghana', 'Simame Laundry Connect'],
  legacy: ['Connect Laundry Ghana', 'Connect Laundry app', 'Laundry Connect Ghana'],
  service: [
    'laundry services Ghana',
    'laundry pickup Ghana',
    'laundry delivery Ghana',
    'dry cleaning Ghana',
    'wash and fold Ghana',
  ],
  local: ['laundry Accra', 'laundry Kumasi', 'laundry near me Ghana', 'dry cleaning Accra'],
  campus: ['campus laundry Ghana', 'student laundry Ghana', 'laundry KNUST', 'laundry app for students'],
  app: ['laundry app Ghana', 'laundry booking app', 'laundry pickup app', 'Simame app download'],
  business: ['laundry business Ghana', 'laundry owner dashboard', 'laundry marketplace for providers'],
  innovation: [
    'Ghanaian startup apps',
    'innovative apps Ghana',
    'campus startup Ghana',
    'digital marketplace Ghana',
  ],
  informational: [
    'how does laundry pickup work',
    'how much does laundry service cost',
    'dry cleaning vs laundry',
    'what is wash and fold',
  ],
  trust: ['Simame contact', 'Simame privacy policy', 'Simame support', 'Simame account deletion'],
}

export function getIndexableInventoryPaths() {
  return SEO_CONTENT_INVENTORY.filter((item) => item.indexable).map((item) => item.path)
}