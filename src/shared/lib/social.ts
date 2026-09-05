export type SocialVerificationStatus = 'verified' | 'needs_founder_review' | 'not_found'

export interface SocialProfile {
  platform: string
  url: string
  handle: string
  profileName: string
  status: SocialVerificationStatus
  evidence: string
  action: string
}

export const OFFICIAL_SOCIAL_HANDLE = '@simameapp'

export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    platform: 'Instagram',
    url: 'https://www.instagram.com/simameapp/',
    handle: OFFICIAL_SOCIAL_HANDLE,
    profileName: 'Simame - LaundryConnect',
    status: 'verified',
    evidence: 'Direct HTTP check returned a profile title for Simame - LaundryConnect (@simameapp).',
    action: 'Keep the website link, logo, display name, and bio aligned with simame.tech.',
  },
  {
    platform: 'X',
    url: 'https://x.com/simameapp',
    handle: OFFICIAL_SOCIAL_HANDLE,
    profileName: 'Simame | Smart Laundry Booking & Pickup Platform',
    status: 'verified',
    evidence: 'Direct HTTP check returned a profile title for Simame (@simameapp).',
    action: 'Keep the canonical website link and descriptor aligned with Simame Laundry Connect.',
  },
  {
    platform: 'YouTube',
    url: 'https://www.youtube.com/@simameapp',
    handle: OFFICIAL_SOCIAL_HANDLE,
    profileName: 'SIMAME - LAUNDRYCONNECT',
    status: 'verified',
    evidence: 'Direct HTTP check returned a YouTube channel title for SIMAME - LAUNDRYCONNECT.',
    action: 'Use consistent capitalization, channel description, playlists, and simame.tech link.',
  },
  {
    platform: 'TikTok',
    url: 'https://www.tiktok.com/@simameapp',
    handle: OFFICIAL_SOCIAL_HANDLE,
    profileName: 'Unknown from HTTP response',
    status: 'needs_founder_review',
    evidence: 'Direct URL returned HTTP 200, but the fetched HTML did not expose Simame-identifying text.',
    action: 'Founder should confirm ownership in-app before adding this URL to Organization sameAs.',
  },
  {
    platform: 'Facebook',
    url: 'https://www.facebook.com/simameapp/',
    handle: OFFICIAL_SOCIAL_HANDLE,
    profileName: 'Facebook',
    status: 'needs_founder_review',
    evidence: 'Direct URL returned HTTP 200, but the title was generic and the platform was not in the known official list.',
    action: 'Confirm whether this is official before linking from the website.',
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/company/simameapp/',
    handle: OFFICIAL_SOCIAL_HANDLE,
    profileName: 'Unknown',
    status: 'needs_founder_review',
    evidence: 'Direct HTTP check could not complete because LinkedIn closed the connection.',
    action: 'Search while logged in or create/claim the company page if it is not already controlled.',
  },
]

export const VERIFIED_SOCIAL_PROFILES = SOCIAL_PROFILES.filter(
  (profile) => profile.status === 'verified',
)

export const ORGANIZATION_SAME_AS = VERIFIED_SOCIAL_PROFILES.map((profile) => profile.url)

export function isValidCanonicalSocialUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && !parsed.search && !parsed.hash
  } catch {
    return false
  }
}