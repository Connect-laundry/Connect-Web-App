import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { countryCodes } from "@/shared/utils/countryCodes";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export const PhoneField = ({ name = 'phone_number' }: { name?: string }) => {
  const form = useFormContext()

  const parsePhone = (val: string | undefined): { code: string; phone: string } => {
    if (val && val.startsWith('+')) {
      const match = countryCodes.find((c) => val.startsWith(c.code))
      if (match) return { code: match.code, phone: val.slice(match.code.length) }
      return { code: '+233', phone: val }
    }
    return { code: '+233', phone: val ?? '' }
  }
  const combine = (code: string, phone: string) => {
    const digits = phone.replace(/\D/g, '')
    return digits ? `${code}${digits}` : ''
  }

  const [countryCode, setCountryCode] = useState<string>(() => parsePhone(form.getValues(name)).code)
  const [localPhone, setLocalPhone] = useState<string>(() => parsePhone(form.getValues(name)).phone)

  const placeholder = countryCodes.find((c) => c.code === countryCode)?.placeholder ?? '20 000 0000'

  // Write to the form only when the owner edits the number. Writing on mount
  // wiped a phone restored from a saved draft (the field mounts before the
  // draft is loaded, with an empty local copy).
  const commit = (code: string, phone: string) => {
    setCountryCode(code)
    setLocalPhone(phone)
    form.setValue(name, combine(code, phone), { shouldValidate: true, shouldDirty: true })
  }

  // Follow changes made elsewhere (draft restore, form.reset).
  const formValue = form.watch(name) as string | undefined
  useEffect(() => {
    if ((formValue ?? '') === combine(countryCode, localPhone)) return
    const parsed = parsePhone(formValue)
    setCountryCode(parsed.code)
    setLocalPhone(parsed.phone)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue])

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
                onChange={(e) => commit(e.target.value, localPhone)}
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
                onChange={(e) => commit(countryCode, e.target.value)}
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