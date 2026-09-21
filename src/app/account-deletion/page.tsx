import type { Metadata } from 'next'
import { LegalLayout } from '@/features/legal/components/LegalLayout'
import { AccountDeletionContent } from '@/features/legal/components/AccountDeletionContent'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Account Deletion - Simame',
  description: 'Request Simame account deletion and learn how personal data deletion and anonymization are handled.',
  path: '/account-deletion',
})

export default function AccountDeletionPage() {
  return (
    <LegalLayout
      title="Account & Data Deletion"
      subtitle="Request permanent account deletion or learn how to purge your personal data."
    >
      <AccountDeletionContent />
    </LegalLayout>
  )
}
