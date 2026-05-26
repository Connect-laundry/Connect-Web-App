const APPLICATION_KEY = 'connect_onboarding_application'
const PENDING_FLAG = 'connect_onboarding_pending'

export interface OnboardingApplication {
  name: string
  description: string
  phone_number: string
  address: string
  city: string
  delivery_fee: string
  pickup_fee: string
  min_order: string
  operating_hours: { day: number; open: string; close: string; is_closed: boolean }[]
  submittedAt: string
}

export function saveOnboardingApplication(data: Omit<OnboardingApplication, 'submittedAt'>) {
  if (typeof window === 'undefined') return
  const payload: OnboardingApplication = { ...data, submittedAt: new Date().toISOString() }
  localStorage.setItem(APPLICATION_KEY, JSON.stringify(payload))
  localStorage.setItem(PENDING_FLAG, '1')
}

export function getOnboardingApplication(): OnboardingApplication | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(APPLICATION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as OnboardingApplication
  } catch {
    return null
  }
}

export function hasPendingOnboardingApplication(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(PENDING_FLAG) === '1'
}

export function clearOnboardingApplication() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(APPLICATION_KEY)
  localStorage.removeItem(PENDING_FLAG)
}
