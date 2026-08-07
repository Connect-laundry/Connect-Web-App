import type { OperatingHour } from '@/shared/interfaces'

export const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export interface DayDraft {
  day: number
  is_closed: boolean
  opening_time: string
  closing_time: string
}

export const toInputTime = (time: string | null) => (time ? time.slice(0, 5) : '08:00')

export function toHoursDrafts(hours: OperatingHour[] = []): DayDraft[] {
  const byDay = new Map(hours.map((hour) => [hour.day, hour]))
  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1
    const hour = byDay.get(day)
    return {
      day,
      is_closed: hour?.is_closed ?? true,
      opening_time: toInputTime(hour?.opening_time ?? null),
      closing_time: hour && !hour.is_closed ? toInputTime(hour.closing_time) : '18:00',
    }
  })
}

export function validateHoursDrafts(drafts: DayDraft[]): string | null {
  const invalid = drafts.find((draft) => !draft.is_closed && draft.opening_time === draft.closing_time)
  return invalid ? `${DAY_NAMES[invalid.day]}: opening and closing time can't be the same.` : null
}

export function buildOperatingHours(drafts: DayDraft[]) {
  return drafts.map((draft) => ({
    day: draft.day,
    is_closed: draft.is_closed,
    opening_time: draft.is_closed ? '00:00' : draft.opening_time,
    closing_time: draft.is_closed ? '00:00' : draft.closing_time,
    is_overnight: !draft.is_closed && draft.closing_time < draft.opening_time,
  }))
}
