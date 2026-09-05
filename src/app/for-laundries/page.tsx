import type { Metadata } from 'next'
import { BarChart3, CalendarClock, CircleDollarSign, Store, Users } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'For Laundry Businesses - Join Simame',
  description:
    'Laundry businesses can use Simame to manage profile details, services, pricing, hours, orders, earnings, notifications, and staff workflows.',
  path: '/for-laundries',
})

const capabilities = [
  { title: 'Business profile', description: 'Set core laundry details, address, contact information, service radius, and operating status.', icon: Store },
  { title: 'Pricing and services', description: 'Manage item pricing, weight pricing, service availability, delivery zones, and special pricing workflows.', icon: CircleDollarSign },
  { title: 'Orders and timing', description: 'Track incoming orders, status changes, weighing, delivery dates, and order lifecycle steps.', icon: CalendarClock },
  { title: 'Staff workflow', description: 'Invite and manage staff or drivers who support daily laundry operations.', icon: Users },
  { title: 'Earnings view', description: 'Review revenue and transaction history from completed order activity.', icon: BarChart3 },
]

export default function ForLaundriesPage() {
  return (
    <PublicPageShell
      eyebrow="For Laundries"
      path="/for-laundries"
      title="A marketplace dashboard for laundry businesses."
      description="Simame gives laundry partners digital tools for storefront setup, service management, order handling, earnings visibility, and team coordination. Public provider profiles should only be indexed after approval and quality checks."
      ctaHref="/auth/register"
      ctaLabel="Join Simame"
    >
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability) => {
          const Icon = capability.icon
          return (
            <article key={capability.title} className="rounded-lg border bg-card p-6 shadow-sm">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 text-lg font-bold">{capability.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{capability.description}</p>
            </article>
          )
        })}
      </div>
    </PublicPageShell>
  )
}