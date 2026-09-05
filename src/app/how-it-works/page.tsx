import type { Metadata } from 'next'
import { ClipboardList, Search, Truck, WalletCards } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'How Simame Works',
  description:
    'See how Simame helps customers discover laundry services, request pickup, track orders, and complete laundry workflows with local partners.',
  path: '/how-it-works',
})

const steps = [
  { title: 'Discover', description: 'Customers find laundry services available through participating partners.', icon: Search },
  { title: 'Request service', description: 'The order captures service type, pickup details, delivery needs, and garment information.', icon: ClipboardList },
  { title: 'Track order', description: 'Status updates help customers and laundry teams follow the work from request to completion.', icon: Truck },
  { title: 'Complete payment', description: 'Digital payment and settlement workflows support accountable marketplace operations where enabled.', icon: WalletCards },
]

export default function HowItWorksPage() {
  return (
    <PublicPageShell
      eyebrow="How It Works"
      path="/how-it-works"
      title="From laundry request to clean delivery."
      description="Simame connects customers, laundry providers, and operational tools around one order workflow. Exact availability, price, and turnaround depend on the provider and service area."
    >
      <div className="mt-12 grid gap-5 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <article key={step.title} className="rounded-lg border bg-card p-5 shadow-sm">
              <span className="text-xs font-bold text-primary">{String(index + 1).padStart(2, '0')}</span>
              <Icon className="mt-5 h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg font-bold">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </article>
          )
        })}
      </div>
    </PublicPageShell>
  )
}