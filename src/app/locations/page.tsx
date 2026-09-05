import type { Metadata } from 'next'
import { AlertCircle, CheckCircle2, MapPin } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { COVERAGE_ENTRIES } from '@/shared/lib/coverage'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Simame Locations in Ghana',
  description:
    'See how Simame handles Ghana laundry location coverage, including Accra, Kumasi, and future service areas without overstating active availability.',
  path: '/locations',
})

export default function LocationsPage() {
  return (
    <PublicPageShell
      eyebrow="Locations"
      path="/locations"
      title="Ghana-wide ambition, verified local availability."
      description="Simame can speak nationally as a Ghanaian laundry marketplace while keeping current service availability tied to active partner data. City pages are published only after real providers, booking availability, and unique local value are confirmed."
    >
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {COVERAGE_ENTRIES.map((entry) => {
          const indexable = entry.indexStatus === 'indexable_hub'
          const Icon = indexable ? CheckCircle2 : AlertCircle
          return (
            <article key={entry.slug} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">{entry.name}</h2>
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{entry.region ?? entry.type}</p>
              <div className="mt-5 flex items-start gap-3 rounded-md bg-muted/40 p-4">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">{entry.reason}</p>
              </div>
            </article>
          )
        })}
      </div>
    </PublicPageShell>
  )
}