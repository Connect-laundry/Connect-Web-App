import type { Metadata } from 'next'
import { LegalLayout } from '@/features/legal/components/LegalLayout'
import { PrivacyPolicyContent } from '@/features/legal/components/PrivacyPolicyContent'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Privacy Policy - Simame',
  description: 'Learn how Simame collects, protects, and manages personal data, order history, privacy rights, and account information.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, protect, and process your personal information across SIMAME services."
    >
      <PrivacyPolicyContent />
    </LegalLayout>
  )
}
