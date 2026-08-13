import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/api/client', () => ({
  apiDelete: vi.fn(),
  apiGet: vi.fn(),
  apiPatch: vi.fn(),
  apiPost: vi.fn(),
}))

import { apiPost } from '@/shared/api/client'
import { applyHoursTemplate } from './api'

describe('applyHoursTemplate', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the backend POST action and unwraps the updated laundry', async () => {
    const laundry = { id: 'laundry-1', operating_hours: [] }
    vi.mocked(apiPost).mockResolvedValue({ data: laundry })

    await expect(applyHoursTemplate()).resolves.toEqual(laundry)
    expect(apiPost).toHaveBeenCalledWith('/laundries/dashboard/my-laundry/hours/template/')
  })
})