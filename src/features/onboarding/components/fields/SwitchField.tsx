import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/shared/ui/form'
import { Switch } from '@/shared/ui/switch'
import type { LucideIcon } from 'lucide-react'

interface SwitchFieldProps {
  name: string
  label: string
  description?: string
  icon?: LucideIcon
}

/** A labelled on/off toggle bound to react-hook-form. */
export function SwitchField({ name, label, description, icon: Icon }: SwitchFieldProps) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between gap-3 space-y-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <div>
              <FormLabel className="m-0">{label}</FormLabel>
              {description && <FormDescription className="text-xs">{description}</FormDescription>}
            </div>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
