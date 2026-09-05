import type { Metadata } from 'next'
import { LegalLayout } from '@/features/legal/components/LegalLayout'
import { AccountDeletionContent } from '@/features/legal/components/AccountDeletionContent'

export const metadata: Metadata = {
  title: 'Account Deletion — SIMAME',
  description: 'Request account deletion and learn how SIMAME handles personal data deletion and anonymization in accordance with App Store guidelines.',
}

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
