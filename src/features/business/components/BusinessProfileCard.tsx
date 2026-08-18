'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Laundry } from '@/shared/types'
import { ProfileEditDialog } from './ProfileEditDialog'

const PRICING_MODEL_LABEL: Record<string, string> = {
  BY_ITEM: 'Per item',
  BY_WEIGHT: 'Per weight (kg)',
  HYBRID: 'Hybrid (item + weight)',
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  SUSPENDED: 'bg-gray-100 text-gray-800',
}

function money(value: string | number | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (n == null || isNaN(n)) return '—'
  return `GH₵${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{children}</p>
    </div>
  )
}

const BoolBadge = ({ value }: { value: boolean }) => {
  return value ? (
    <span className="inline-flex items-center gap-1 text-green-700">
      <CheckCircle2 className="h-4 w-4" /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <XCircle className="h-4 w-4" /> No
    </span>
  )
}

interface BusinessProfileCardProps {
  laundry: Laundry | null
  onSaved: (updated: Laundry) => void
}

export const BusinessProfileCard = ({ laundry, onSaved }: BusinessProfileCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>The details you registered during onboarding</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          {laundry && <ProfileEditDialog laundry={laundry} onSaved={onSaved} />}
          {laundry && (
            <Badge className={STATUS_STYLE[laundry.status] || 'bg-gray-100 text-gray-800'}>
              {laundry.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {laundry ? (
          <div className="space-y-6">
            {(laundry.imageUrl || laundry.image) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={laundry.imageUrl || laundry.image || undefined}
                alt={laundry.name}
                className="h-40 w-full max-w-md rounded-lg object-cover"
              />
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Business name">{laundry.name || '—'}</Field>
              <Field label="Phone">{laundry.phone_number || '—'}</Field>
              <Field label="Price range">{laundry.price_range || '—'}</Field>
              <Field label="Address">{laundry.address || '—'}</Field>
              <Field label="City">{laundry.city || '—'}</Field>
              <Field label="Coordinates">
                {laundry.latitude != null && laundry.longitude != null
                  ? `${laundry.latitude}, ${laundry.longitude}`
                  : '—'}
              </Field>
              <Field label="Pricing model">
                {PRICING_MODEL_LABEL[laundry.pricing_model] || laundry.pricing_model || '—'}
              </Field>
              <Field label="Est. delivery">
                {laundry.estimated_delivery_hours != null
                  ? `${laundry.estimated_delivery_hours} hrs`
                  : '—'}
              </Field>
              <Field label="Express service">
                {laundry.express_available
                  ? `${laundry.express_delivery_hours ?? '—'} hrs · +${laundry.express_surcharge_percent ?? '—'}%`
                  : 'Not offered'}
              </Field>
              <Field label="Service radius">
                {laundry.service_radius_km != null ? `${laundry.service_radius_km} km` : '—'}
              </Field>
              <Field label="Minimum order">{money(laundry.min_order)}</Field>
              <Field label="Ironing available">
                <BoolBadge value={!!laundry.ironing_available} />
              </Field>
              <Field label="Eco-friendly">
                <BoolBadge value={!!laundry.is_eco_friendly} />
              </Field>
              <Field label="Vacation mode">
                <BoolBadge value={!!laundry.vacation_mode} />
              </Field>
            </div>
            {laundry.description && <Field label="Description">{laundry.description}</Field>}
          </div>
        ) : (
          <p className="text-muted-foreground">No business profile found.</p>
        )}
      </CardContent>
    </Card>
  )
}
