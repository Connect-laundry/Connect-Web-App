import { useCallback, useEffect, useState } from 'react'
import {
  createDeliveryZone,
  createHolidayOverride,
  createPricingVersion,
  createScheduledPriceChange,
  deleteDeliveryZone,
  deleteHolidayOverride,
  deleteScheduledPriceChange,
  getDeliveryZones,
  getHolidayOverrides,
  getPricingVersions,
  getScheduledPriceChanges,
  rollbackPricingVersion,
  type DeliveryZonePricing,
  type HolidayOverride,
  type PricingCatalogVersion,
  type ScheduledPriceChange,
} from '../api'

export function useAdvancedPricing() {
  const [zones, setZones] = useState<DeliveryZonePricing[]>([])
  const [scheduled, setScheduled] = useState<ScheduledPriceChange[]>([])
  const [versions, setVersions] = useState<PricingCatalogVersion[]>([])
  const [holidays, setHolidays] = useState<HolidayOverride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [nextZones, nextScheduled, nextVersions, nextHolidays] = await Promise.all([
        getDeliveryZones(), getScheduledPriceChanges(), getPricingVersions(), getHolidayOverrides(),
      ])
      setZones(nextZones)
      setScheduled(nextScheduled)
      setVersions(nextVersions)
      setHolidays(nextHolidays)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to load advanced pricing settings.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const run = async (key: string, operation: () => Promise<void>, fallback: string) => {
    setBusy(key)
    setError(null)
    try { await operation() } catch (error: unknown) {
      setError(error instanceof Error ? error.message : fallback)
    } finally { setBusy(null) }
  }

  const addZone = () => run('zone', async () => {
    const zone = await createDeliveryZone({ min_distance_km: '0', max_distance_km: '5', delivery_fee: '10', pickup_fee: '5' })
    setZones((previous) => [...previous, zone])
  }, 'Could not add delivery zone.')

  const removeZone = (id: string) => run(`zone-${id}`, async () => {
    await deleteDeliveryZone(id)
    setZones((previous) => previous.filter((zone) => zone.id !== id))
  }, 'Could not remove delivery zone.')

  const addHoliday = () => run('holiday', async () => {
    const holiday = await createHolidayOverride({ date: new Date().toISOString().slice(0, 10), opening_time: null, closing_time: null, is_closed: true, note: 'Holiday' })
    setHolidays((previous) => [...previous, holiday])
  }, 'Could not add holiday override.')

  const updateHolidayDraft = (id: string, patch: Partial<HolidayOverride>) =>
    setHolidays((previous) => previous.map((holiday) => holiday.id === id ? { ...holiday, ...patch } : holiday))

  const removeHoliday = (id: string) => run(`holiday-${id}`, async () => {
    await deleteHolidayOverride(id)
    setHolidays((previous) => previous.filter((holiday) => holiday.id !== id))
  }, 'Could not remove holiday override.')

  const snapshotVersion = () => run('version', async () => {
    const version = await createPricingVersion()
    setVersions((previous) => [version, ...previous])
  }, 'Could not save pricing version.')

  const rollbackVersion = (id: string) => run(`version-${id}`, async () => {
    await rollbackPricingVersion(id)
    await load()
  }, 'Could not rollback pricing version.')

  const scheduleChange = () => run('schedule', async () => {
    const effectiveAt = new Date(Date.now() + 86400000).toISOString()
    const change = await createScheduledPriceChange({ effective_at: effectiveAt, pricing_data: [] })
    setScheduled((previous) => [change, ...previous])
  }, 'Could not schedule price change.')

  const removeScheduledChange = (id: string) => run(`schedule-${id}`, async () => {
    await deleteScheduledPriceChange(id)
    setScheduled((previous) => previous.filter((change) => change.id !== id))
  }, 'Could not remove scheduled change.')

  return { zones, scheduled, versions, holidays, loading, error, busy, addZone, removeZone, addHoliday, updateHolidayDraft, removeHoliday, snapshotVersion, rollbackVersion, scheduleChange, removeScheduledChange }
}
