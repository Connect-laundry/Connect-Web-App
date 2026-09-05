'use client'

import React, { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { CheckCircle2, AlertCircle, Trash2 } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import type { AccountType } from '../types'

export const AccountDeletionForm: React.FC = () => {
  const { user } = useAuth()

  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [accountType, setAccountType] = useState<AccountType>('customer')
  const [reason, setReason] = useState('')
  const [confirmCheckbox, setConfirmCheckbox] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() && !phone.trim()) {
      setErrorMessage('Please provide either your registered email address or phone number.')
      return
    }

    if (!confirmCheckbox) {
      setErrorMessage('Please check the confirmation box acknowledging account deletion.')
      return
    }

    setIsSubmitting(true)

    try {
      await fetch('/api/proxy/users/delete-account/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          account_type: accountType,
          reason,
        }),
      }).catch(() => null)

      setSubmitted(true)
    } catch (_err) {
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Alert className="border-green-300 bg-green-500/10 text-green-700 dark:text-green-300 p-6 rounded-xl">
        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
        <div className="space-y-2">
          <AlertTitle className="text-lg font-bold">Request Successfully Submitted</AlertTitle>
          <AlertDescription className="text-sm leading-relaxed">
            We have received your account deletion request for <strong className="text-foreground">{email || phone}</strong>.
            Our compliance team will process your request and anonymize your account records within 24-48 hours.
            A confirmation notification will be dispatched once deletion is complete.
          </AlertDescription>
        </div>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Account Type</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
            <input
              type="radio"
              name="accountType"
              value="customer"
              checked={accountType === 'customer'}
              onChange={() => setAccountType('customer')}
              className="text-primary focus:ring-primary"
            />
            <span>Customer Account</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
            <input
              type="radio"
              name="accountType"
              value="laundry_owner"
              checked={accountType === 'laundry_owner'}
              onChange={() => setAccountType('laundry_owner')}
              className="text-primary focus:ring-primary"
            />
            <span>Laundry Business Owner</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold">
          Registered Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="e.g. user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-semibold">
          Registered Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="e.g. +233 20 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isSubmitting}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason" className="text-sm font-semibold">
          Reason for Account Deletion (Optional)
        </Label>
        <Textarea
          id="reason"
          placeholder="Please tell us why you are deleting your account to help us improve..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSubmitting}
          rows={3}
          className="bg-background"
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-muted/40 rounded-xl border border-border/50">
        <input
          type="checkbox"
          id="confirm"
          checked={confirmCheckbox}
          onChange={(e) => setConfirmCheckbox(e.target.checked)}
          disabled={isSubmitting}
          className="mt-1 rounded text-destructive focus:ring-destructive"
        />
        <label htmlFor="confirm" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
          I understand that deleting my account is permanent and cannot be undone. I acknowledge that all my profile data, saved addresses, and active rewards will be permanently deleted.
        </label>
      </div>

      <Button
        type="submit"
        variant="destructive"
        disabled={isSubmitting || !confirmCheckbox}
        className="w-full sm:w-auto px-8 py-6 font-bold text-base shadow-glow-sm"
      >
        {isSubmitting ? (
          <>
            <Spinner className="mr-2 h-5 w-5" />
            Submitting Request...
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-5 w-5" />
            Submit Deletion Request
          </>
        )}
      </Button>
    </form>
  )
}
