import { PageShell } from '@/shared/components/layout/PageShell'
import { Spinner } from '@/shared/ui/spinner'

export function DashboardLoadingState() {
  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="w-10 h-10 text-primary" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Syncing your business data...
        </p>
      </div>
    </PageShell>
  )
}
