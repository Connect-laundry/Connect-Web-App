import type { ComponentType, ReactNode } from 'react'

export type AccountType = 'customer' | 'laundry_owner'

export interface AccountDeletionFormData {
  email: string
  phone: string
  accountType: AccountType
  reason: string
  confirmCheckbox: boolean
}

export interface LegalNavPathLink {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

export interface LegalLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  lastUpdated?: string
}

export interface ContactDetails {
  company: string
  privacyEmail: string
  supportEmail: string
  officialEmail?: string
  phone: string
  phones?: string[]
  location: string
}
