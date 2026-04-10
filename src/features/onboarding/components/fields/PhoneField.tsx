import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { countryCodes } from "@/shared/utils/countryCodes";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function PhoneField({ name = 'phone_number' }: { name?: string }) {
  const form = useFormContext()

  const parseInitialPhone = (): { code: string; phone: string } => {
    const val = form.getValues(name) as string
    if (val && val.startsWith('+')) {
      const match = countryCodes.find((c) => val.startsWith(c.code))
      if (match) return { code: match.code, phone: val.slice(match.code.length) }
      return { code: '+233', phone: val }
    }
    return { code: '+233', phone: val ?? '' }
  }

  const [countryCode, setCountryCode] = useState<string>(() => parseInitialPhone().code)
  const [localPhone, setLocalPhone] = useState<string>(() => parseInitialPhone().phone)

  const placeholder = countryCodes.find((c) => c.code === countryCode)?.placeholder ?? '20 000 0000'

  // Keep the combined value in sync with the form.
  useEffect(() => {
    const digits = localPhone.replace(/\D/g, '')
    form.setValue(name, digits ? `${countryCode}${digits}` : '', { shouldValidate: true })
  }, [countryCode, localPhone, form, name])

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>Business Phone</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <Input
                type="tel"
                placeholder={placeholder}
                value={localPhone}
                onChange={(e) => setLocalPhone(e.target.value)}
                className="flex-1"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}