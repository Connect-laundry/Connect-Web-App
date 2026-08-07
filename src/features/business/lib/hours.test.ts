import { describe, expect, it } from 'vitest'
import { buildOperatingHours, toHoursDrafts, validateHoursDrafts } from './hours'

describe('hours helpers', () => {
  it('creates a seven-day editable schedule', () => {
    const drafts = toHoursDrafts([{ day: 1, is_closed: false, opening_time: '08:30:00', closing_time: '18:00:00' } as never])
    expect(drafts).toHaveLength(7)
    expect(drafts[0]).toMatchObject({ day: 1, opening_time: '08:30', closing_time: '18:00' })
  })

  it('rejects identical open and close times', () => {
    expect(validateHoursDrafts([{ day: 1, is_closed: false, opening_time: '08:00', closing_time: '08:00' }])).toContain('Monday')
  })

  it('marks schedules crossing midnight as overnight', () => {
    expect(buildOperatingHours([{ day: 1, is_closed: false, opening_time: '20:00', closing_time: '06:00' }])[0].is_overnight).toBe(true)
  })
})
