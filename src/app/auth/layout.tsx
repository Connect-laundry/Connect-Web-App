import type { Metadata } from 'next'
import { noindexMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = noindexMetadata('Account Access')

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

