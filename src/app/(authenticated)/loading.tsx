import { Spinner } from '@/shared/ui/spinner'

/** Instant feedback while a hub route loads (avoids blank wait on slow API). */
export default function AuthenticatedLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 p-8">
      <Spinner className="w-8 h-8 text-primary" />
      <p className="text-sm font-medium text-muted-foreground">Loading…</p>
    </div>
  )
}
