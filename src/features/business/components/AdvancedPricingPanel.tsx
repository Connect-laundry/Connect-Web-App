'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { useAdvancedPricing } from '../hooks/useAdvancedPricing'

const money = (value: string | number) => {
  const amount = typeof value === 'string' ? parseFloat(value) : value
  return Number.isFinite(amount) ? `GH₵${amount.toFixed(2)}` : '—'
}

export function AdvancedPricingPanel() {
  const pricing = useAdvancedPricing()
  if (pricing.loading) return <div className="flex justify-center py-8"><Spinner /></div>

  return (
    <div className="space-y-8">
      {pricing.error && <Alert variant="destructive"><AlertDescription>{pricing.error}</AlertDescription></Alert>}
      <section className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Delivery zones</h3><Button size="sm" variant="outline" disabled={pricing.busy === 'zone'} onClick={pricing.addZone}><Plus className="h-4 w-4 mr-1" /> Add zone</Button></div>
        {pricing.zones.length === 0 ? <p className="text-sm text-muted-foreground">No delivery zones configured.</p> : <div className="space-y-2">{pricing.zones.map((zone) => <div key={zone.id} className="flex flex-wrap items-center gap-2 rounded border p-3 text-sm"><span>{zone.min_distance_km}–{zone.max_distance_km} km</span><span>Delivery {money(zone.delivery_fee)}</span><span>Pickup {money(zone.pickup_fee)}</span><Button size="sm" variant="ghost" className="ml-auto text-destructive" onClick={() => pricing.removeZone(zone.id)}><Trash2 className="h-4 w-4" /></Button></div>)}</div>}
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Scheduled price changes</h3><Button size="sm" variant="outline" onClick={pricing.scheduleChange}>Schedule change</Button></div>
        {pricing.scheduled.length === 0 ? <p className="text-sm text-muted-foreground">No scheduled changes.</p> : pricing.scheduled.map((row) => <div key={row.id} className="flex items-center justify-between rounded border p-3 text-sm"><span>{new Date(row.effective_at).toLocaleString()} · {row.is_applied ? 'Applied' : 'Pending'}</span>{!row.is_applied && <Button size="sm" variant="ghost" onClick={() => pricing.removeScheduledChange(row.id)}>Remove</Button>}</div>)}
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Pricing versions</h3><Button size="sm" variant="outline" disabled={pricing.busy === 'version'} onClick={pricing.snapshotVersion}>Save snapshot</Button></div>
        {pricing.versions.length === 0 ? <p className="text-sm text-muted-foreground">No saved versions yet.</p> : pricing.versions.map((version) => <div key={version.id} className="flex items-center justify-between rounded border p-3 text-sm"><span>Version {version.version_number} · {version.items_data?.length ?? 0} items</span><Button size="sm" variant="outline" onClick={() => pricing.rollbackVersion(version.id)}>Rollback</Button></div>)}
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Holiday overrides</h3><Button size="sm" variant="outline" disabled={pricing.busy === 'holiday'} onClick={pricing.addHoliday}><Plus className="h-4 w-4 mr-1" /> Add holiday</Button></div>
        {pricing.holidays.length === 0 ? <p className="text-sm text-muted-foreground">No holiday overrides.</p> : pricing.holidays.map((holiday) => <div key={holiday.id} className="flex flex-wrap items-center gap-2 rounded border p-3 text-sm"><Input type="date" value={holiday.date} onChange={(event) => pricing.updateHolidayDraft(holiday.id, { date: event.target.value })} className="w-40" /><Input value={holiday.note} placeholder="Note" onChange={(event) => pricing.updateHolidayDraft(holiday.id, { note: event.target.value })} className="flex-1 min-w-[160px]" /><Button size="sm" variant="ghost" className="text-destructive" onClick={() => pricing.removeHoliday(holiday.id)}><Trash2 className="h-4 w-4" /></Button></div>)}
      </section>
    </div>
  )
}
