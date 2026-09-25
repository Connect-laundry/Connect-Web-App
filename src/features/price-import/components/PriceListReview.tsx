'use client'

import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'
import { formatGhs } from '../lib/money'
import { rowProblem, type ReviewRow, type RowMethod, type ServiceChoice } from '../lib/review'
import { SERVICE_TYPES, type ServiceType } from '../types'

const STATE_BADGE: Record<ReviewRow['reviewState'], { label: string; className: string }> = {
  LOOKS_GOOD: { label: 'Looks good', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  CHECK: { label: 'Please check', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  UNREADABLE: { label: 'Could not read', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
}

const selectClass =
  'h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

interface Props {
  rows: ReviewRow[]
  defaultService: ServiceType
  /** Hide per-kg/per-item choice when the laundry only has one mode. */
  allowPerKg: boolean
  allowPerItem: boolean
  onChange: (key: string, patch: Partial<ReviewRow>) => void
}

export const PriceListReview = ({ rows, defaultService, allowPerKg, allowPerItem, onChange }: Props) => (
  <ul className="space-y-3" aria-label="Detected prices">
    {rows.map((row) => (
      <ReviewRowCard
        key={row.key}
        row={row}
        defaultService={defaultService}
        allowPerKg={allowPerKg}
        allowPerItem={allowPerItem}
        onChange={(patch) => onChange(row.key, patch)}
      />
    ))}
  </ul>
)

const ReviewRowCard = ({
  row,
  defaultService,
  allowPerKg,
  allowPerItem,
  onChange,
}: {
  row: ReviewRow
  defaultService: ServiceType
  allowPerKg: boolean
  allowPerItem: boolean
  onChange: (patch: Partial<ReviewRow>) => void
}) => {
  const badge = STATE_BADGE[row.reviewState]
  const problem = rowProblem(row, defaultService)
  const label = row.method === 'PER_KG' ? 'Per-kg price' : row.name || 'Unnamed service'
  return (
    <li
      className={cn(
        'rounded-lg border p-3 space-y-3 transition-opacity',
        !row.include && 'opacity-60',
        row.include && problem && 'border-amber-500/60',
      )}
      data-testid={`review-row-${row.key}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm font-medium min-w-0">
          <input
            type="checkbox"
            checked={row.include}
            onChange={(e) => onChange({ include: e.target.checked })}
            aria-label={`Include ${label}`}
            className="h-4 w-4 shrink-0"
          />
          <span className="truncate">{label}</span>
        </label>
        <span className={cn('ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold', badge.className)}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
        {row.method !== 'PER_KG' && (
          <div className="sm:col-span-4">
            <span className="mb-1 block text-xs text-muted-foreground">Service name</span>
            <Input
              value={row.name}
              onChange={(e) => onChange({ name: e.target.value })}
              aria-label="Service name"
            />
          </div>
        )}
        {row.method !== 'PER_KG' && (
          <div className="sm:col-span-3">
            <span className="mb-1 block text-xs text-muted-foreground">Service type</span>
            <select
              className={selectClass}
              value={row.service}
              onChange={(e) => onChange({ service: e.target.value as ServiceChoice })}
              aria-label="Service type"
            >
              {row.service === '' && <option value="">Choose…</option>}
              <option value="UNSTATED">Not stated (use {defaultService.toLowerCase()})</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
        {allowPerKg && allowPerItem && (
          <div className="sm:col-span-3">
            <span className="mb-1 block text-xs text-muted-foreground">Pricing</span>
            <select
              className={selectClass}
              value={row.method}
              onChange={(e) => onChange({ method: e.target.value as RowMethod })}
              aria-label="Pricing method"
            >
              {row.method === '' && <option value="">Choose…</option>}
              <option value="PER_ITEM">Per item</option>
              <option value="PER_KG">Per kg</option>
            </select>
          </div>
        )}
        <div className={row.method === 'PER_KG' ? 'sm:col-span-4' : allowPerKg && allowPerItem ? 'sm:col-span-2' : 'sm:col-span-5'}>
          <span className="mb-1 block text-xs text-muted-foreground">
            Price (GH₵){row.method === 'PER_KG' ? ' per kg' : ''}
          </span>
          <Input
            inputMode="decimal"
            value={row.price}
            onChange={(e) => onChange({ price: e.target.value.replace(/[^\d.]/g, '') })}
            placeholder="0.00"
            aria-label="Price"
          />
        </div>
      </div>

      {row.existing && (
        <div className="rounded-md bg-muted/50 p-2 text-xs space-y-2" data-testid="existing-choice">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              Existing: <strong>{row.existing.name}</strong> — {formatGhs(row.existing.price)}
            </span>
            <span>
              Detected: <strong>{label}</strong> — {formatGhs(row.price)}
            </span>
          </div>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="What to do with the existing price">
            <Choice label="Keep existing" checked={row.choice === 'KEEP'} onSelect={() => onChange({ choice: 'KEEP' })} />
            <Choice
              label={row.existingSource === 'server' ? 'Update existing' : 'Use detected'}
              checked={row.choice === 'USE_DETECTED'}
              onSelect={() => onChange({ choice: 'USE_DETECTED', include: true })}
            />
            {row.existingSource === 'server' && row.method === 'PER_ITEM' && (
              <Choice
                label="Create new"
                checked={row.choice === 'CREATE_NEW'}
                onSelect={() => onChange({ choice: 'CREATE_NEW', include: true })}
              />
            )}
          </div>
        </div>
      )}

      {(row.notes.length > 0 || (row.include && problem)) && (
        <ul className="space-y-0.5 text-xs text-amber-700 dark:text-amber-400">
          {row.include && problem && <li className="font-medium">{problem}</li>}
          {row.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      {row.sourceText && (
        <p className="truncate text-[11px] text-muted-foreground" title={row.sourceText}>
          Read from photo: “{row.sourceText}”
        </p>
      )}
    </li>
  )
}

const Choice = ({ label, checked, onSelect }: { label: string; checked: boolean; onSelect: () => void }) => (
  <label className="flex items-center gap-1.5 cursor-pointer">
    <input type="radio" checked={checked} onChange={onSelect} className="h-3.5 w-3.5" />
    {label}
  </label>
)
