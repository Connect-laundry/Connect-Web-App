'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { Plus, Trash2 } from 'lucide-react'
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

function money(value: string | number) {
  const n = typeof value === 'string' ? parseFloat(value) : value
  return Number.isFinite(n) ? `GH₵${n.toFixed(2)}` : '—'
}

export function AdvancedPricingPanel() {
  const [zones, setZones] = useState<DeliveryZonePricing[]>([])
  const [scheduled, setScheduled] = useState<ScheduledPriceChange[]>([])
  const [versions, setVersions] = useState<PricingCatalogVersion[]>([])
  const [holidays, setHolidays] = useState<HolidayOverride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [z, s, v, h] = await Promise.all([
        getDeliveryZones(),
        getScheduledPriceChanges(),
        getPricingVersions(),
        getHolidayOverrides(),
      ])
      setZones(z)
      setScheduled(s)
      setVersions(v)
      setHolidays(h)
    } catch (err: any) {
      setError(err.message || 'Failed to load advanced pricing settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await load()
    }
    run()
  }, [])

  const addZone = async () => {
    setBusy('zone')
    try {
      const zone = await createDeliveryZone({
        min_distance_km: '0',
        max_distance_km: '5',
        delivery_fee: '10',
        pickup_fee: '5',
      })
      setZones((prev) => [...prev, zone])
    } catch (err: any) {
      setError(err.message || 'Could not add delivery zone.')
    } finally {
      setBusy(null)
    }
  }

  const addHoliday = async () => {
    setBusy('holiday')
    try {
      const today = new Date().toISOString().slice(0, 10)
      const holiday = await createHolidayOverride({
        date: today,
        opening_time: null,
        closing_time: null,
        is_closed: true,
        note: 'Holiday',
      })
      setHolidays((prev) => [...prev, holiday])
    } catch (err: any) {
      setError(err.message || 'Could not add holiday override.')
    } finally {
      setBusy(null)
    }
  }

  const snapshotVersion = async () => {
    setBusy('version')
    try {
      const version = await createPricingVersion()
      setVersions((prev) => [version, ...prev])
    } catch (err: any) {
      setError(err.message || 'Could not save pricing version.')
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Delivery zones</h3>
          <Button size="sm" variant="outline" disabled={busy === 'zone'} onClick={addZone}>
            <Plus className="h-4 w-4 mr-1" /> Add zone
          </Button>
        </div>
        {zones.length === 0 ? (
          <p className="text-sm text-muted-foreground">No delivery zones configured.</p>
        ) : (
          <div className="space-y-2">
            {zones.map((zone) => (
              <div key={zone.id} className="flex flex-wrap items-center gap-2 rounded border p-3 text-sm">
                <span>{zone.min_distance_km}–{zone.max_distance_km} km</span>
                <span>Delivery {money(zone.delivery_fee)}</span>
                <span>Pickup {money(zone.pickup_fee)}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-destructive"
                  onClick={async () => {
                    await deleteDeliveryZone(zone.id)
                    setZones((prev) => prev.filter((z) => z.id !== zone.id))
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Scheduled price changes</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              setBusy('schedule')
              try {
                const tomorrow = new Date(Date.now() + 86400000).toISOString()
                const row = await createScheduledPriceChange({
                  effective_at: tomorrow,
                  pricing_data: [],
                })
                setScheduled((prev) => [row, ...prev])
              } catch (err: any) {
                setError(err.message || 'Could not schedule price change.')
              } finally {
                setBusy(null)
              }
            }}
          >
            Schedule change
          </Button>
        </div>
        {scheduled.length === 0 ? (
          <p className="text-sm text-muted-foreground">No scheduled changes.</p>
        ) : (
          scheduled.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded border p-3 text-sm">
              <span>{new Date(row.effective_at).toLocaleString()} · {row.is_applied ? 'Applied' : 'Pending'}</span>
              {!row.is_applied && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await deleteScheduledPriceChange(row.id)
                    setScheduled((prev) => prev.filter((s) => s.id !== row.id))
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          ))
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Pricing versions</h3>
          <Button size="sm" variant="outline" disabled={busy === 'version'} onClick={snapshotVersion}>
            Save snapshot
          </Button>
        </div>
        {versions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved versions yet.</p>
        ) : (
          versions.map((version) => (
            <div key={version.id} className="flex items-center justify-between rounded border p-3 text-sm">
              <span>Version {version.version_number} · {version.items_data?.length ?? 0} items</span>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await rollbackPricingVersion(version.id)
                  await load()
                }}
              >
                Rollback
              </Button>
            </div>
          ))
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Holiday overrides</h3>
          <Button size="sm" variant="outline" disabled={busy === 'holiday'} onClick={addHoliday}>
            <Plus className="h-4 w-4 mr-1" /> Add holiday
          </Button>
        </div>
        {holidays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holiday overrides.</p>
        ) : (
          holidays.map((holiday) => (
            <div key={holiday.id} className="flex flex-wrap items-center gap-2 rounded border p-3 text-sm">
              <Input
                type="date"
                value={holiday.date}
                onChange={async (e) => {
                  const updated = { ...holiday, date: e.target.value }
                  setHolidays((prev) => prev.map((h) => (h.id === holiday.id ? updated : h)))
                }}
                className="w-40"
              />
              <Input
                value={holiday.note}
                placeholder="Note"
                onChange={(e) =>
                  setHolidays((prev) =>
                    prev.map((h) => (h.id === holiday.id ? { ...h, note: e.target.value } : h)),
                  )
                }
                className="flex-1 min-w-[160px]"
              />
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={async () => {
                  await deleteHolidayOverride(holiday.id)
                  setHolidays((prev) => prev.filter((h) => h.id !== holiday.id))
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
