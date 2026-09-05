import type { Metadata } from 'next'
import { LegalLayout } from '@/features/legal/components/LegalLayout'
import { PrivacyPolicyContent } from '@/features/legal/components/PrivacyPolicyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy — SIMAME',
  description: 'Learn how SIMAME collects, protects, and manages your personal data, order history, and privacy rights.',
}

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
