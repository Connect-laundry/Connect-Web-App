import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PrivacyPolicyContent } from './PrivacyPolicyContent'

// Guideline 5.1.1(i): the policy must identify every third party the apps
// send user data to. Keep this list in step with the mobile and web code.
describe('PrivacyPolicyContent', () => {
  it('names every service that receives user data from the apps', () => {
    const { container } = render(<PrivacyPolicyContent />)
    const text = container.textContent ?? ''
    for (const name of [
      'Clerk', 'Cloudinary', 'Expo', 'Brevo', 'Arkesel', 'Sentry', 'Paystack',
      'Google Places', 'Google Directions', 'Apple Maps', 'Mapbox', 'Photon',
      'OSRM', 'DiceBear', 'EAS Update', 'EAS Observe', 'Gemini', 'OCR.space',
    ]) {
      expect(text, name).toContain(name)
    }
  })

  it('describes first-party usage events and that laundries receive booking alerts', () => {
    const { container } = render(<PrivacyPolicyContent />)
    const text = container.textContent ?? ''
    expect(text).toContain('App Usage Events')
    expect(text).toContain('to the laundry handling your order')
  })
})
