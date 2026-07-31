/** Shared order status badge styles (blue/teal brand palette). */
export function getOrderStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-500/15 text-amber-800 ring-1 ring-amber-500/25',
    CONFIRMED: 'bg-primary/15 text-primary ring-1 ring-primary/25',
    PICKED_UP: 'bg-indigo-500/15 text-indigo-800 ring-1 ring-indigo-500/25',
    IN_PROCESS: 'bg-orange-500/15 text-orange-800 ring-1 ring-orange-500/25',
    OUT_FOR_DELIVERY: 'bg-violet-500/15 text-violet-800 ring-1 ring-violet-500/25',
    DELIVERED: 'bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-500/25',
    COMPLETED: 'bg-teal-500/15 text-teal-800 ring-1 ring-teal-500/25',
    REJECTED: 'bg-red-500/15 text-red-800 ring-1 ring-red-500/25',
    CANCELLED: 'bg-muted text-muted-foreground ring-1 ring-border',
  }
  return map[status] ?? 'bg-muted text-muted-foreground ring-1 ring-border'
}
