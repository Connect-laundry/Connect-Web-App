import { GooglePlayBadge } from '@/shared/components/GooglePlayBadge'

interface AppDownloadCalloutProps {
  heading?: string
  body?: string
}

export function AppDownloadCallout({
  heading = 'Get the Simame laundry app',
  body = 'Find laundries near you, book pickup and delivery, pay with Mobile Money or card, and track your order. Free on Google Play for Android.',
}: AppDownloadCalloutProps) {
  return (
    <aside className="mt-12 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{body}</p>
        </div>
        <GooglePlayBadge className="shrink-0" />
      </div>
    </aside>
  )
}
