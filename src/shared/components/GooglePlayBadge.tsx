import { GOOGLE_PLAY_WEBSITE_URL } from '@/shared/lib/seo'
import { cn } from '@/shared/lib/utils'

interface GooglePlayBadgeProps {
  size?: 'sm' | 'md'
  className?: string
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
        'inline-flex items-center justify-center gap-2 bg-black text-white transition-colors hover:bg-neutral-800',
        small ? 'h-[44px] w-[140px] rounded-lg px-3 py-1.5' : 'h-[52px] w-[170px] rounded-xl px-4 py-2',
        className,
      )}
    >
      <svg viewBox="0 0 512 512" aria-hidden="true" className={cn('shrink-0 fill-current', small ? 'h-5 w-5' : 'h-6 w-6')}>
        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
      </svg>
      <span className="text-left">
        <span className={cn('block uppercase leading-tight', small ? 'text-[8px]' : 'text-[10px]')}>Get it on</span>
        <span className={cn('block font-semibold leading-tight', small ? 'text-xs' : 'text-sm')}>Google Play</span>
      </span>
    </a>
  )
}
