import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/api/client', () => ({ apiGet: vi.fn() }))
vi.mock('@/features/dashboard/api', () => ({ getDashboardOrders: vi.fn() }))
vi.mock('@/features/payments/api', () => ({ getPaymentOwnerStats: vi.fn() }))

import { apiGet } from '@/shared/api/client'
import { getDashboardOrders } from '@/features/dashboard/api'
import { getPayoutOverview, getTransactionHistory } from './api'

describe('owner earnings API', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads the authoritative payout overview', async () => {
    const overview = {
      summary: { held: '10.00', available: '20.00', paid: '30.00', currency: 'GHS' },
      settles_directly: false,
      settlements: [],
      payouts: [],
    }
    vi.mocked(apiGet).mockResolvedValue({ data: overview })

    await expect(getPayoutOverview()).resolves.toEqual(overview)
    expect(apiGet).toHaveBeenCalledWith('/laundries/dashboard/payouts/')
  })

  it('does not present cancelled or rejected orders as completed transactions', async () => {
    vi.mocked(getDashboardOrders).mockResolvedValue({
      count: 3,
      results: [
        { id: '1', order_no: 'SIM-1', status: 'COMPLETED', total_amount: '12.00', created_at: '2026-08-13T00:00:00Z' },
        { id: '2', order_no: 'SIM-2', status: 'CANCELLED', total_amount: '15.00', created_at: '2026-08-13T00:00:00Z' },
        { id: '3', order_no: 'SIM-3', status: 'REJECTED', total_amount: '18.00', created_at: '2026-08-13T00:00:00Z' },
      ],
    } as never)

    const history = await getTransactionHistory({ limit: 20 })

    expect(history.results).toHaveLength(1)
    expect(history.results[0]).toMatchObject({ order_no: 'SIM-1', status: 'COMPLETED', amount: 12 })
    expect(getDashboardOrders).toHaveBeenCalledWith({ limit: 20, offset: undefined, status: undefined })
  })
})