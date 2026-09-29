import { GooglePlayBadge } from '@/shared/components/GooglePlayBadge'
import { cn } from '@/shared/lib/utils'

// Customers hear "Simame" and type it several ways. Listing the common
// misspellings in visible text lets those searches land on the right page.
// Simami is a separate company: it may appear here ONLY in the
// not-connected sentence, never in metadata, schema, sameAs or store listings.
export const COMMON_MISSPELLINGS = ['Simama', 'Simamee', 'Simamay', 'Simamé', 'Semame', 'Simaame']

export function SpellingHelp({ variant = 'band' }: { variant?: 'band' | 'card' }) {
  const band = variant === 'band'

  return (
    <section
      aria-labelledby="spelling-help-heading"
      className={cn(band ? 'border-t border-border/50 bg-muted/30' : 'mt-12 rounded-xl border bg-muted/30')}
    >
      <div
        className={cn(
          'flex flex-col gap-6 md:flex-row md:items-center md:justify-between',
          band ? 'mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8' : 'p-6 sm:p-8',
        )}
      >
        <div className="max-w-3xl">
          <h2 id="spelling-help-heading" className="text-xl font-bold tracking-tight">
            Not sure how to spell it? It&rsquo;s Simame: S-I-M-A-M-E.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {`If you searched for ${COMMON_MISSPELLINGS.join(', ')} or `}&ldquo;Simame laundry app&rdquo;, you are in the right
            place. The app on Google Play is <strong>Simame - Laundry Connect</strong>, formerly Connect Laundry.
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Simame is not connected to Simami or any other similarly named company.
          </p>
        </div>
        <GooglePlayBadge className="shrink-0" />
      </div>
    </section>
  )
}
