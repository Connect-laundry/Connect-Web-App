import type { Metadata } from 'next'
import { AuthenticatedShell } from './AuthenticatedShell'
import { noindexMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = noindexMetadata('Owner Dashboard')

const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <AuthenticatedShell>{children}</AuthenticatedShell>
}

export default AuthenticatedLayout
