import { Shield, FileText, UserX } from 'lucide-react'
import type { LegalNavPathLink, ContactDetails } from '../types'

export const DEFAULT_LEGAL_LAST_UPDATED = 'September 3, 2026'

export const LEGAL_NAV_LINKS: LegalNavPathLink[] = [
  { href: '/privacy', label: 'Privacy Policy', icon: Shield },
  { href: '/terms', label: 'Terms of Service', icon: FileText },
  { href: '/account-deletion', label: 'Account Deletion', icon: UserX },
]

export const SIMAME_CONTACT_DETAILS: ContactDetails = {
  company: 'Simame LaundryConnect',
  privacyEmail: 'privacy@simame.tech',
  supportEmail: 'info@simame.tech',
  officialEmail: 'simameapp.official@gmail.com',
  phone: '+233-200-9098-97 / +233-551-0571-39',
  phones: ['+233-200-9098-97', '+233-551-0571-39'],
  location: 'Accra, Ghana',
}

export const PERMANENTLY_DELETED_ITEMS: string[] = [
  'Personal identifiers (Full Name, Email Address, Phone Number).',
  'Saved delivery addresses, locations, and coordinates.',
  'Profile avatars, social media login associations, and push tokens.',
  'Stored security credentials and session tokens.',
]

export const RETAINED_DATA_ITEMS: string[] = [
  'Anonymized order history and transaction totals (required by tax & financial audit laws).',
  'Order records are permanently unlinked from your name, phone, and email.',
]
