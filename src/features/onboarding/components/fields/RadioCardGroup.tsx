import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import type { LucideIcon } from 'lucide-react'

export interface RadioCardOption {
  value: string
  label: string
  hint?: string
  symbol?: string
  icon?: LucideIcon
}

interface RadioCardGroupProps {
  name: string
  label: string
  options: readonly RadioCardOption[]
  /** Tailwind grid classes for the card layout. */
  gridClassName?: string
  /** Compact text-only chips (e.g. small option pickers). */
  compact?: boolean
  /** Extra classes for the wrapping FormItem (e.g. grid placement). */
  className?: string
}

/** A radio group rendered as selectable cards, bound to react-hook-form. */
export const RadioCardGroup = ({
  name,
  label,
  options,
  gridClassName = 'grid grid-cols-3 gap-3',
  compact = false,
  className,
}: RadioCardGroupProps) => {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} value={field.value} className={gridClassName}>
              {options.map((opt) => {
                const Icon = opt.icon
                const selected = field.value === opt.value
                const base = selected
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/40'
                return (
                  <label
                    key={opt.value}
                    htmlFor={`${name}-${opt.value}`}
                    className={
                      compact
                        ? `cursor-pointer rounded-md border-2 px-2 py-1.5 text-center text-xs transition-colors ${
                            selected ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/40'
                          }`
                        : `cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${base}`
                    }
                  >
                    <RadioGroupItem id={`${name}-${opt.value}`} value={opt.value} className="sr-only" />
                    {opt.symbol && <div className="text-lg font-bold text-primary">{opt.symbol}</div>}
                    {Icon && <Icon className="w-5 h-5 mx-auto mb-1 text-primary" />}
                    <div className={compact ? 'font-medium' : 'font-medium text-sm'}>{opt.label}</div>
                    {opt.hint && <div className="text-xs text-muted-foreground">{opt.hint}</div>}
                  </label>
                )
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
