'use client'

import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'

import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Spinner } from '@/shared/ui/spinner'
import { Switch } from '@/shared/ui/switch'

import { getPromotion, savePromotion, type OwnerPromotion, type PromoScope, type PromoStatus } from './api'

const SCOPES: { value: PromoScope; label: string }[] = [
  { value: 'PICKUP_AND_DELIVERY', label: 'Free pickup & delivery' },
  { value: 'PICKUP_ONLY', label: 'Free pickup only' },
  { value: 'DELIVERY_ONLY', label: 'Free delivery only' },
]

const STATUS_LABEL: Record<PromoStatus, string> = {
  OFF: 'Off',
  SCHEDULED: 'Scheduled',
  RUNNING: 'Running',
  ENDED: 'Ended',
}

/** `datetime-local` wants local time without a zone; the API speaks ISO. */
function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function fromLocalInput(value: string): string | null {
  return value ? new Date(value).toISOString() : null
}

type Draft = {
  enabled: boolean
  scope: PromoScope
  name: string
  start_at: string
  end_at: string
  min_order_value: string
  max_distance_km: string
}

function toDraft(promo: OwnerPromotion): Draft {
  return {
    enabled: promo.enabled,
    scope: promo.scope,
    name: promo.name ?? '',
    start_at: toLocalInput(promo.start_at),
    end_at: toLocalInput(promo.end_at),
    min_order_value: promo.min_order_value ?? '',
    max_distance_km: promo.max_distance_km ?? '',
  }
}

/**
 * Lets an owner run a free pickup/delivery promo. Simame still pays the rider
 * the full fee; the promo cost comes out of this laundry's payout. Customers
 * who saved the laundry or ordered before get one notification per campaign.
 */
export function FreeDeliveryPromoCard() {
  const [promo, setPromo] = useState<OwnerPromotion | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let active = true
    getPromotion()
      .then((data) => {
        if (!active) return
        setPromo(data)
        setDraft(toDraft(data))
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load your promotion.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const update = (patch: Partial<Draft>) => {
    setSaved(false)
    setDraft((current) => (current ? { ...current, ...patch } : current))
  }

  const onSave = async () => {
    if (!draft) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const result = await savePromotion({
        enabled: draft.enabled,
        scope: draft.scope,
        name: draft.name.trim(),
        start_at: fromLocalInput(draft.start_at),
        end_at: fromLocalInput(draft.end_at),
        min_order_value: draft.min_order_value.trim() || null,
        max_distance_km: draft.max_distance_km.trim() || null,
      })
      setPromo(result)
      setDraft(toDraft(result))
      setSaved(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not save your promotion.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-emerald-600" aria-hidden />
            Free pickup &amp; delivery
          </CardTitle>
          {promo && (
            <Badge variant={promo.status === 'RUNNING' ? 'default' : 'secondary'}>{STATUS_LABEL[promo.status]}</Badge>
          )}
        </div>
        <CardDescription>
          Customers pay nothing for transport while this is on. The rider is still paid in full, and that cost is
          taken from your payout for each promo order. Simame sets the transport rates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading || !draft ? (
          <div className="flex justify-center py-8">{loading ? <Spinner /> : null}</div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <Label htmlFor="promo-enabled" className="text-base">
                  Offer free transport
                </Label>
                <p className="text-sm text-muted-foreground">
                  Turning this on notifies customers who saved your laundry or ordered before (once per campaign).
                </p>
              </div>
              <Switch
                id="promo-enabled"
                checked={draft.enabled}
                onCheckedChange={(checked) => update({ enabled: checked })}
                aria-label="Offer free transport"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="promo-scope">What is free</Label>
                <select
                  id="promo-scope"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={draft.scope}
                  onChange={(event) => update({ scope: event.target.value as PromoScope })}
                >
                  {SCOPES.map((scope) => (
                    <option key={scope.value} value={scope.value}>
                      {scope.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-name">Promo name (optional)</Label>
                <Input
                  id="promo-name"
                  maxLength={80}
                  placeholder="Opening week"
                  value={draft.name}
                  onChange={(event) => update({ name: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-start">Starts (optional)</Label>
                <Input
                  id="promo-start"
                  type="datetime-local"
                  value={draft.start_at}
                  onChange={(event) => update({ start_at: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-end">Ends (optional)</Label>
                <Input
                  id="promo-end"
                  type="datetime-local"
                  value={draft.end_at}
                  onChange={(event) => update({ end_at: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-min-order">Minimum order, GHS (optional)</Label>
                <Input
                  id="promo-min-order"
                  inputMode="decimal"
                  placeholder="e.g. 100"
                  value={draft.min_order_value}
                  onChange={(event) => update({ min_order_value: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-max-km">Up to distance, km (optional)</Label>
                <Input
                  id="promo-max-km"
                  inputMode="decimal"
                  placeholder="e.g. 5"
                  value={draft.max_distance_km}
                  onChange={(event) => update({ max_distance_km: event.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={onSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save promotion'}
              </Button>
              {saved && <span className="text-sm text-emerald-700">Saved.</span>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
