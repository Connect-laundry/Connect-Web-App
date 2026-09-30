import { useId } from 'react'
import { GOOGLE_PLAY_WEBSITE_URL } from '@/shared/lib/seo'
import { cn } from '@/shared/lib/utils'

interface GooglePlayBadgeProps {
  size?: 'sm' | 'md'
  className?: string
}

// Four-colour Play mark. The segments are clipped by a rounded triangle so the
// corners stay soft like the current Google Play logo.
function PlayLogo({ className }: { className?: string }) {
  const clipId = useId()

  return (
    <svg viewBox="2 1 21 24" aria-hidden="true" className={className}>
      <defs>
        <clipPath id={clipId}>
          <path d="M3 4.5V21.5Q3 24 5.16 22.75L19.84 14.25Q22 13 19.84 11.75L5.16 3.25Q3 2 3 4.5Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path fill="#FBBC04" d="M3 2L22 13L3 24Z" />
        <path fill="#34A853" d="M3 2L14.26 8.52L11 13L3 13Z" />
        <path fill="#EA4335" d="M3 24L14.26 17.48L11 13L3 13Z" />
        <path fill="#4285F4" d="M3 2L11 13L3 24Z" />
      </g>
    </svg>
  )
}

export function GooglePlayBadge({ size = 'md', className }: GooglePlayBadgeProps) {
  const small = size === 'sm'

  return (
    <a
      href={GOOGLE_PLAY_WEBSITE_URL}
      target="_blank"
      rel="noopener"
      aria-label="Get Simame - Laundry Connect on Google Play"
      className={cn(
        'group relative inline-flex items-center overflow-hidden text-[oklch(0.98_0.003_260)]',
        'bg-linear-to-b from-[oklch(0.27_0.012_260)] to-[oklch(0.16_0.01_260)]',
        'ring-1 ring-[oklch(1_0_0/0.1)]',
        'shadow-[inset_0_1px_0_oklch(1_0_0/0.14),0_1px_2px_oklch(0.2_0.02_260/0.25),0_8px_20px_-6px_oklch(0.2_0.02_260/0.45)]',
        'transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_oklch(1_0_0/0.18),0_2px_4px_oklch(0.2_0.02_260/0.25),0_14px_28px_-8px_oklch(0.2_0.02_260/0.55)]',
        'active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        small ? 'h-11 gap-2.5 rounded-lg pl-3.5 pr-4' : 'h-13 gap-3 rounded-xl pl-4 pr-5',
        className,
      )}
    >
      {/* Soft sheen that drifts across on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-[oklch(1_0_0/0.08)] to-transparent opacity-0 transition-[translate,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[300%] group-hover:opacity-100 motion-reduce:hidden"
      />
      <PlayLogo className={cn('relative shrink-0 drop-shadow-[0_1px_1px_oklch(0_0_0/0.35)]', small ? 'h-6 w-5.5' : 'h-7.5 w-6.5')} />
      <span className="relative flex flex-col text-left">
        <span
          className={cn(
            'font-medium uppercase leading-none tracking-[0.14em] text-[oklch(0.98_0.003_260/0.7)]',
            small ? 'text-[8.5px]' : 'text-[9.5px]',
          )}
        >
          Get it on
        </span>
        <span
          className={cn(
            'mt-1 font-semibold leading-none tracking-[-0.01em]',
            small ? 'text-[15px]' : 'text-[18px]',
          )}
        >
          Google Play
        </span>
      </span>
    </a>
  )
}
