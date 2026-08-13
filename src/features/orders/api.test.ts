import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/api/client', () => ({
  apiGet: vi.fn(),
  apiPatch: vi.fn(),
  apiPost: vi.fn(),
}))
vi.mock('@/features/dashboard/api', () => ({ getDashboardOrders: vi.fn() }))

import { apiPost } from '@/shared/api/client'
import { canCollectCash, collectCash, getAvailableActions } from './api'
import type { Order } from '@/shared/interfaces'

const order = (overrides: Partial<Order> = {}): Order => ({
  id: 'order-1',
  order_no: 'SIM-1',
  customer_name: 'Customer',
  status: 'PENDING',
  status_display: 'Pending',
  total_amount: 25,
  pickup_date: '2026-08-13T00:00:00Z',
  delivery_date: '2026-08-14T00:00:00Z',
  created_at: '2026-08-13T00:00:00Z',
  updated_at: '2026-08-13T00:00:00Z',
  ...overrides,
})

describe('owner COD order policy', () => {
  beforeEach(() => vi.clearAllMocks())

  it('allows prepayment acceptance only for COD, custom quote, or paid orders', () => {
    expect(getAvailableActions(order({
      payment_method: 'CARD',
      payment_status: 'UNPAID',
    }))).not.toContain('accept')

    expect(getAvailableActions(order({
      payment_method: 'CASH',
      payment_status: 'UNPAID',
    }))).toContain('accept')

    expect(getAvailableActions(order({
      pricing_mode: 'CUSTOM_QUOTE',
      payment_method: 'CARD',
      payment_status: 'UNPAID',
    }))).toContain('accept')
  })

  it('offers collection only for unpaid COD at fulfillment and hides it after refresh', () => {
    expect(canCollectCash(order({ status: 'OUT_FOR_DELIVERY', payment_method: 'CASH', payment_status: 'UNPAID', amount_due: '25.00' }))).toBe(true);
    expect(canCollectCash(order({ status: 'CONFIRMED', payment_method: 'CASH', payment_status: 'UNPAID', amount_due: '25.00' }))).toBe(false);
    expect(canCollectCash(order({ status: 'DELIVERED', payment_method: 'CASH', payment_status: 'PAID', amount_due: '0.00' }))).toBe(false);
    expect(canCollectCash(order({ status: 'DELIVERED', payment_method: 'CARD', payment_status: 'UNPAID', amount_due: '25.00' }))).toBe(false);
  });

  it('posts the exact expected cash amount and returns refreshed order state', async () => {
    const updated = order({
      status: 'OUT_FOR_DELIVERY',
      payment_method: 'CASH',
      payment_status: 'PAID',
      payment_state: 'CASH_COLLECTED',
      amount_collected: '25.00',
      amount_due: '0.00',
    })
    vi.mocked(apiPost).mockResolvedValue({ data: updated })

    await expect(collectCash('order-1', 25)).resolves.toEqual(updated)
    expect(apiPost).toHaveBeenCalledWith(
      '/orders/lifecycle/order-1/collect-cash/',
      { amount: '25.00' },
    )
  })
})
