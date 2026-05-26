import { cn } from '@/shared/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

/** Consistent page wrapper with mesh background visible through padding. */
export function PageShell({ children, className, contentClassName }: PageShellProps) {
  return (
    <div className={cn('relative min-h-full', className)}>
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-80" aria-hidden />
      <div
        className={cn(
          'relative max-w-[1400px] mx-auto p-6 md:p-8 lg:p-10',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
