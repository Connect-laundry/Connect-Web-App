import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { MerchantSmsSettings } from '../api/sms-alerts'

const api = vi.hoisted(() => ({
  getMerchantSmsSettings: vi.fn(),
  updateMerchantSmsSettings: vi.fn(),
  startPhoneVerification: vi.fn(),
  confirmPhoneVerification: vi.fn(),
  useAccountPhone: vi.fn(),
  sendTestSms: vi.fn(),
}))

vi.mock('../api/sms-alerts', () => api)
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import { SmsBookingAlertsCard } from './SmsBookingAlertsCard'

const mockVerifiedSettings: MerchantSmsSettings = {
  available: true,
  sms_enabled: true,
  phone_masked: '+233 24 *** 1234',
  phone_verified: true,
  verification_method: 'otp',
  verified_at: '2026-10-14T10:00:00Z',
  pending_phone_masked: '',
  pending_expires_at: null,
  account_phone_masked: '+233 50 *** 9999',
  recent: [
    {
      id: 'del-1',
      order_id: 'ord-1',
      order_no: 'SM-1001',
      kind: 'New booking',
      status: 'Delivered',
      created_at: '2026-10-14T12:00:00Z',
      delivered_at: '2026-10-14T12:01:00Z',
    },
  ],
}

const mockUnverifiedSettings: MerchantSmsSettings = {
  available: true,
  sms_enabled: false,
  phone_masked: '',
  phone_verified: false,
  verification_method: '',
  verified_at: null,
  pending_phone_masked: '',
  pending_expires_at: null,
  account_phone_masked: '+233 24 *** 8888',
  recent: [],
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SmsBookingAlertsCard', () => {
  it('renders verified phone number and recent delivery history', async () => {
    api.getMerchantSmsSettings.mockResolvedValue(mockVerifiedSettings)
    render(<SmsBookingAlertsCard />)

    expect(await screen.findByText('+233 24 *** 1234')).toBeTruthy()
    expect(screen.getByText('Verified')).toBeTruthy()
    expect(screen.getByText('Alerts On')).toBeTruthy()
    expect(screen.getByText('SM-1001')).toBeTruthy()
    expect(screen.getByText('Delivered')).toBeTruthy()
  })

  it('allows toggling SMS booking alerts', async () => {
    api.getMerchantSmsSettings.mockResolvedValue(mockVerifiedSettings)
    api.updateMerchantSmsSettings.mockResolvedValue({
      ...mockVerifiedSettings,
      sms_enabled: false,
    })
    render(<SmsBookingAlertsCard />)

    await screen.findByText('+233 24 *** 1234')
    const toggle = screen.getByRole('switch', { name: 'Alerts On' })
    fireEvent.click(toggle)

    await waitFor(() => {
      expect(api.updateMerchantSmsSettings).toHaveBeenCalledWith({
        sms_enabled: false,
      })
    })
  })

  it('triggers send test SMS', async () => {
    api.getMerchantSmsSettings.mockResolvedValue(mockVerifiedSettings)
    api.sendTestSms.mockResolvedValue(mockVerifiedSettings)
    render(<SmsBookingAlertsCard />)

    const testBtn = await screen.findByRole('button', { name: /Send Test SMS/i })
    fireEvent.click(testBtn)

    await waitFor(() => {
      expect(api.sendTestSms).toHaveBeenCalled()
    })
  })

  it('displays action required badge when unverified', async () => {
    api.getMerchantSmsSettings.mockResolvedValue(mockUnverifiedSettings)
    render(<SmsBookingAlertsCard />)

    expect(await screen.findByText('Action Required')).toBeTruthy()
    expect(screen.getByText('No verified phone configured')).toBeTruthy()
    const setupBtn = screen.getByRole('button', { name: /Set Up Number/i })
    expect(setupBtn).toBeTruthy()
  })

  it('adopts account sign-in phone when clicked', async () => {
    api.getMerchantSmsSettings.mockResolvedValue(mockUnverifiedSettings)
    api.useAccountPhone.mockResolvedValue({
      ...mockUnverifiedSettings,
      phone_masked: '+233 24 *** 8888',
      phone_verified: true,
      verification_method: 'clerk',
      account_phone_masked: '',
    })
    render(<SmsBookingAlertsCard />)

    const adoptBtn = await screen.findByRole('button', {
      name: /Use Sign-in Phone/i,
    })
    fireEvent.click(adoptBtn)

    await waitFor(() => {
      expect(api.useAccountPhone).toHaveBeenCalled()
    })
  })
})
