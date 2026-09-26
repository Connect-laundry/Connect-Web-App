import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { OwnerPromotion } from './api'

const api = vi.hoisted(() => ({ getPromotion: vi.fn(), savePromotion: vi.fn() }))
vi.mock('./api', () => api)

import { FreeDeliveryPromoCard } from './FreeDeliveryPromoCard'

const off: OwnerPromotion = {
  enabled: false,
  scope: 'PICKUP_AND_DELIVERY',
  name: '',
  start_at: null,
  end_at: null,
  min_order_value: null,
  max_distance_km: null,
  funded_by: 'LAUNDRY',
  status: 'OFF',
}

beforeEach(() => {
  vi.clearAllMocks()
  api.getPromotion.mockResolvedValue(off)
})

describe('FreeDeliveryPromoCard', () => {
  it('turns on a free pickup & delivery promo and shows it running', async () => {
    api.savePromotion.mockResolvedValue({ ...off, enabled: true, name: 'Opening week', status: 'RUNNING' })
    render(<FreeDeliveryPromoCard />)

    const toggle = await screen.findByRole('switch', { name: 'Offer free transport' })
    expect(screen.getByText('Off')).toBeTruthy()
    fireEvent.click(toggle)
    fireEvent.change(screen.getByLabelText('Promo name (optional)'), { target: { value: 'Opening week' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save promotion' }))

    await waitFor(() => expect(screen.getByText('Running')).toBeTruthy())
    expect(api.savePromotion).toHaveBeenCalledWith({
      enabled: true,
      scope: 'PICKUP_AND_DELIVERY',
      name: 'Opening week',
      start_at: null,
      end_at: null,
      min_order_value: null,
      max_distance_km: null,
    })
    expect(screen.getByText('Saved.')).toBeTruthy()
  })

  it('never sends rates or funding: only the promo fields an owner controls', async () => {
    api.savePromotion.mockResolvedValue(off)
    render(<FreeDeliveryPromoCard />)
    fireEvent.click(await screen.findByRole('button', { name: 'Save promotion' }))
    await waitFor(() => expect(api.savePromotion).toHaveBeenCalled())
    const body = api.savePromotion.mock.calls[0][0]
    expect(Object.keys(body).sort()).toEqual(
      ['enabled', 'end_at', 'max_distance_km', 'min_order_value', 'name', 'scope', 'start_at'].sort(),
    )
  })

  it('can make only delivery free', async () => {
    api.savePromotion.mockResolvedValue({ ...off, scope: 'DELIVERY_ONLY' })
    render(<FreeDeliveryPromoCard />)
    fireEvent.change(await screen.findByLabelText('What is free'), { target: { value: 'DELIVERY_ONLY' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save promotion' }))
    await waitFor(() => expect(api.savePromotion.mock.calls[0][0].scope).toBe('DELIVERY_ONLY'))
  })

  it('shows the server validation message', async () => {
    api.savePromotion.mockRejectedValue(new Error('Choose an end date in the future.'))
    render(<FreeDeliveryPromoCard />)
    fireEvent.click(await screen.findByRole('button', { name: 'Save promotion' }))
    expect(await screen.findByText('Choose an end date in the future.')).toBeTruthy()
  })
})
