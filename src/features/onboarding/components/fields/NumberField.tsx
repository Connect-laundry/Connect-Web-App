import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'

interface NumberFieldProps {
  name: string
  label: string
  description?: string
  step?: string
  min?: string
  placeholder?: string
  readOnly?: boolean
  className?: string
}

/** A react-hook-form numeric input with label, description and validation message. */
export const NumberField = ({
  name,
  label,
  description,
  step = '0.01',
  min,
  placeholder,
  readOnly = false,
  className,
}: NumberFieldProps) => {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step={step}
              min={min}
              placeholder={placeholder}
              readOnly={readOnly}
              className={readOnly ? 'bg-muted cursor-not-allowed' : undefined}
              {...field}
            />
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
