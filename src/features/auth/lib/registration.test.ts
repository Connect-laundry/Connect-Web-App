import { describe, expect, it } from 'vitest'
import { getRegistrationError, registerSchema } from './registration'

describe('registration helpers', () => {
  it('validates password confirmation', () => {
    const result = registerSchema.safeParse({
      email: 'owner@example.com',
      password: 'password1',
      password_confirm: 'password2',
      first_name: 'Owner',
      last_name: 'User',
      phone: '0200000000',
      role: 'OWNER',
    })
    expect(result.success).toBe(false)
  })

  it('maps nested backend uniqueness errors', () => {
    expect(getRegistrationError({ data: { data: { email: ['This field must be unique.'] } } })).toBe(
      'An account with this email already exists. Try logging in instead.',
    )
    expect(getRegistrationError({ data: { phone: ['Must be unique'] } })).toBe(
      'An account with this phone number already exists. Try logging in instead.',
    )
  })

  it('falls back to the API error message', () => {
    expect(getRegistrationError({ message: 'Network unavailable' })).toBe('Network unavailable')
  })
})
