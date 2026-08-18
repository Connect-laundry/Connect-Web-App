'use client'

import { useState } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createDriverAccount } from '@/features/logistics/api'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'

interface CreateDriverModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void | Promise<void>
}

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  password_confirm: '',
}

const PasswordInput = ({
  id,
  value,
  onChange,
  autoComplete,
  disabled,
  required,
}: {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
  disabled?: boolean
  required?: boolean
}) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={8}
        disabled={disabled}
        required={required}
        className="pr-10"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

export const CreateDriverModal = ({
  isOpen,
  onOpenChange,
  onCreated,
}: CreateDriverModalProps) => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return
    onOpenChange(open)
    if (!open) {
      setForm(EMPTY_FORM)
      setError(null)
    }
  }

  const updateField = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (form.password !== form.password_confirm) {
      setError('Passwords do not match.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await createDriverAccount({
        ...form,
        email: form.email.trim(),
        phone: form.phone.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
      })
      setForm(EMPTY_FORM)
      onOpenChange(false)
      await onCreated()
    } catch (err: any) {
      setError(err?.message || 'Failed to create the driver account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">Create Driver Account</DialogTitle>
          <DialogDescription className="text-xs">
            Create the login account the courier will use. It will automatically be assigned the DRIVER role.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="py-2 text-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-semibold">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="driver-first-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                First Name
              </label>
              <Input
                id="driver-first-name"
                value={form.first_name}
                onChange={(e) => updateField('first_name', e.target.value)}
                autoComplete="given-name"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="driver-last-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Last Name
              </label>
              <Input
                id="driver-last-name"
                value={form.last_name}
                onChange={(e) => updateField('last_name', e.target.value)}
                autoComplete="family-name"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="driver-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <Input
              id="driver-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="driver-phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Phone Number
            </label>
            <Input
              id="driver-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              autoComplete="tel"
              placeholder="e.g. 233241234567"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="driver-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Temporary Password
              </label>
              <PasswordInput
                id="driver-password"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="driver-password-confirm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </label>
              <PasswordInput
                id="driver-password-confirm"
                value={form.password_confirm}
                onChange={(e) => updateField('password_confirm', e.target.value)}
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Share the temporary password securely with the driver. The backend applies its normal password-strength rules.
          </p>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="font-bold text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="font-bold text-xs">
              {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
              Create Driver
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
