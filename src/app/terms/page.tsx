import type { Metadata } from 'next'
import { LegalLayout } from '@/features/legal/components/LegalLayout'
import { TermsOfServiceContent } from '@/features/legal/components/TermsOfServiceContent'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Terms of Service - Simame',
  description: 'Read the terms that govern Simame laundry services, partner business dashboard access, delivery workflows, and platform use.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Terms and conditions governing customers, partner laundry businesses, and logistics on SIMAME."
    >
      <TermsOfServiceContent />
    </LegalLayout>
  )
}
