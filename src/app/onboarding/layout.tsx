import type { Metadata } from 'next'
import { noindexMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = noindexMetadata('Business Onboarding')

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

