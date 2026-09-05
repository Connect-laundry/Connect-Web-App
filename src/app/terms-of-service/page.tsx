import type { Metadata } from 'next'
import { LegalLayout } from '@/features/legal/components/LegalLayout'
import { TermsOfServiceContent } from '@/features/legal/components/TermsOfServiceContent'

export const metadata: Metadata = {
  title: 'Terms of Service — SIMAME',
  description: 'Terms and conditions governing the use of SIMAME laundry services, partner business dashboard, and delivery platform.',
}

export default function TermsOfServiceAliasPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Terms and conditions governing customers, partner laundry businesses, and logistics on SIMAME."
    >
      <TermsOfServiceContent />
    </LegalLayout>
  )
}
