import { describe, expect, it } from 'vitest'
import { buildProfilePayload, toProfileDraft, validateProfileDraft, type ProfileDraft } from './profile-edit'

const validDraft: ProfileDraft = {
  name: 'Simame',
  description: '',
  phone_number: '0200000000',
  address: '',
  city: '',
  estimated_delivery_hours: '24',
  service_radius_km: '5',
  min_order: '10',
  express_available: false,
  express_delivery_hours: '',
  express_surcharge_percent: '',
  is_eco_friendly: false,
  ironing_available: true,
}

describe('profile edit helpers', () => {
  it('normalizes nullable laundry fields for editable inputs', () => {
    const draft = toProfileDraft({ name: 'Test', phone_number: null } as never)
    expect(draft.name).toBe('Test')
    expect(draft.phone_number).toBe('')
    expect(draft.express_available).toBe(false)
  })

  it('requires express details only when express service is enabled', () => {
    expect(validateProfileDraft(validDraft)).toBeNull()
    expect(validateProfileDraft({ ...validDraft, express_available: true })).toBe(
      'Enter the express turnaround in hours.',
    )
  })

  it('clears disabled express values in the API payload', () => {
    expect(buildProfilePayload(validDraft)).toMatchObject({
      express_delivery_hours: null,
      express_surcharge_percent: null,
    })
  })
})
