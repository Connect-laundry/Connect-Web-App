import Link from 'next/link'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'

/** Rinse/Press-style scheduling bar — links to register. */
export function PickupBar() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-card border border-border/80 shadow-[0_4px_24px_-4px_oklch(0.42_0.15_260/0.12)] max-w-xl">
      <div className="flex flex-1 items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 min-w-0">
        <Calendar className="h-5 w-5 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pickup</p>
          <p className="text-sm font-semibold truncate">Schedule when it suits you</p>
        </div>
      </div>
      <div className="hidden sm:block w-px h-10 bg-border self-center" />
      <div className="flex flex-1 items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 min-w-0">
        <MapPin className="h-5 w-5 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Area</p>
          <p className="text-sm font-semibold truncate">Accra & surrounding</p>
        </div>
      </div>
      <Button asChild className="h-12 sm:h-auto sm:px-6 rounded-xl font-bold shrink-0">
        <Link href="/auth/register">
          Book pickup
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
