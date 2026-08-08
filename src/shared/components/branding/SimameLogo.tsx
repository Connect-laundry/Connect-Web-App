import { cn } from '@/shared/lib/utils'

/**
 * SIMAME brand — icon + wordmark composed inline (no background boxes).
 * Asset: /images/SIMAME_EVOLVED_APPICON-01.png
 */
type SimameLogoVariant = 'icon' | 'lockup' | 'brand'

interface SimameLogoProps {
  variant?: SimameLogoVariant
  className?: string
  imageClassName?: string
  /** Hide the wordmark text (icon only, same as `icon` variant). */
  iconOnly?: boolean
}

const ICON_SRC = '/images/SIMAME_EVOLVED_APPICON-01.png'

const iconSizes: Record<SimameLogoVariant, string> = {
  icon: 'h-9 w-9 sm:h-10 sm:w-10',
  lockup: 'h-8 w-8 sm:h-9 sm:w-9',
  brand: 'h-12 w-12 sm:h-14 sm:w-14',
}

const wordmarkSizes: Record<SimameLogoVariant, string> = {
  icon: '',
  lockup: 'text-lg sm:text-xl',
  brand: 'text-2xl sm:text-3xl',
}

export function SimameLogo({
  variant = 'lockup',
  className,
  imageClassName,
  iconOnly = false,
}: SimameLogoProps) {
  const showWordmark = !iconOnly && variant !== 'icon'

  return (
    <div
      className={cn(
        'inline-flex items-center shrink-0',
        showWordmark ? 'gap-2.5 sm:gap-3' : '',
        className
      )}
    >
      <img
        src={ICON_SRC}
        alt=""
        aria-hidden
        className={cn(
          'rounded-lg object-cover',
          iconSizes[variant],
          imageClassName
        )}
      />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-bold tracking-tight text-foreground',
              wordmarkSizes[variant]
            )}
          >
            SIMAME
          </span>
          {variant === 'brand' && (
            <span className="mt-1 text-[11px] sm:text-xs text-muted-foreground font-medium tracking-wide">
              your laundry, one click away
            </span>
          )}
        </div>
      )}
      {!showWordmark && (
        <span className="sr-only">SIMAME</span>
      )}
    </div>
  )
}
