'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Smartphone,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/shared/ui/input-otp'
import {
  MerchantSmsSettings,
  getMerchantSmsSettings,
  updateMerchantSmsSettings,
  startPhoneVerification,
  confirmPhoneVerification,
  adoptAccountPhone,
  sendTestSms,
} from '../api/sms-alerts'

export function SmsBookingAlertsCard() {
  const [settings, setSettings] = useState<MerchantSmsSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [testing, setTesting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [dialogError, setDialogError] = useState<string | null>(null)
  const [dialogSubmitting, setDialogSubmitting] = useState(false)

  const loadSettings = async () => {
    try {
      const data = await getMerchantSmsSettings()
      setSettings(data)
      if (data.pending_phone_masked && data.pending_expires_at) {
        const expires = new Date(data.pending_expires_at).getTime()
        if (expires > Date.now()) {
          setStep('otp')
        }
      }
    } catch (err: any) {
      console.error('Failed to load SMS settings', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleToggle = async (checked: boolean) => {
    if (!settings) return
    setUpdating(true)
    try {
      const updated = await updateMerchantSmsSettings({ sms_enabled: checked })
      setSettings(updated)
      toast.success(
        checked
          ? 'SMS booking alerts enabled for your laundry.'
          : 'SMS booking alerts paused.',
      )
    } catch (err: any) {
      toast.error(err.message || 'Failed to update SMS alerts preference.')
    } finally {
      setUpdating(false)
    }
  }

  const handleUseAccountPhone = async () => {
    setUpdating(true)
    try {
      const updated = await adoptAccountPhone()
      setSettings(updated)
      toast.success('Your verified sign-in phone is now set for booking SMS alerts.')
    } catch (err: any) {
      toast.error(err.message || 'Could not adopt sign-in phone number.')
    } finally {
      setUpdating(false)
    }
  }

  const handleSendTest = async () => {
    setTesting(true)
    try {
      const updated = await sendTestSms()
      setSettings(updated)
      toast.success('Test SMS submitted to Arkesel. Check your phone.')
    } catch (err: any) {
      toast.error(err.message || 'Could not send test SMS.')
    } finally {
      setTesting(false)
    }
  }

  const handleOpenDialog = () => {
    setDialogError(null)
    setPhoneInput('')
    setOtpCode('')
    setStep(settings?.pending_phone_masked ? 'otp' : 'phone')
    setDialogOpen(true)
  }

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneInput.trim()) {
      setDialogError('Please enter a valid phone number.')
      return
    }
    setDialogError(null)
    setDialogSubmitting(true)
    try {
      const updated = await startPhoneVerification({ phone: phoneInput.trim() })
      setSettings(updated)
      setStep('otp')
      toast.success('Verification code sent via SMS.')
    } catch (err: any) {
      setDialogError(err.message || 'Failed to send verification code.')
    } finally {
      setDialogSubmitting(false)
    }
  }

  const handleConfirmVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length < 6) {
      setDialogError('Please enter the full 6-digit verification code.')
      return
    }
    setDialogError(null)
    setDialogSubmitting(true)
    try {
      const updated = await confirmPhoneVerification({ code: otpCode })
      setSettings(updated)
      setDialogOpen(false)
      toast.success('Phone number verified! Booking SMS alerts are now active.')
    } catch (err: any) {
      setDialogError(err.message || 'Invalid or expired verification code.')
    } finally {
      setDialogSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            SMS Booking Alerts
          </CardTitle>
          <CardDescription>
            Loading SMS notification configuration...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  const isVerified = Boolean(settings?.phone_verified)
  const isEnabled = Boolean(settings?.sms_enabled)

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Laundry Owner SMS Alerts
              </CardTitle>
              <CardDescription className="text-xs">
                Receive instant transactional SMS via Arkesel whenever a customer books with your laundry.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="merchant-sms-switch" className="text-xs font-medium cursor-pointer">
              {isEnabled && isVerified ? 'Alerts On' : 'Alerts Off'}
            </Label>
            <Switch
              id="merchant-sms-switch"
              checked={isEnabled && isVerified}
              disabled={!isVerified || updating}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {/* Verification Status Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg border bg-muted/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Receiving Phone
              </span>
              {isVerified ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 text-[11px] font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 gap-1 text-[11px] font-medium">
                  <AlertCircle className="h-3 w-3" />
                  Action Required
                </Badge>
              )}
            </div>

            <div className="text-sm font-medium">
              {settings?.phone_masked ? (
                <span className="font-mono tracking-tight text-foreground">
                  {settings.phone_masked}
                </span>
              ) : (
                <span className="text-muted-foreground italic">
                  No verified phone configured
                </span>
              )}
            </div>

            {isVerified && settings?.verification_method && (
              <p className="text-[11px] text-muted-foreground">
                Verified via {settings.verification_method === 'clerk' ? 'sign-in account' : 'SMS verification code'}.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
            {settings?.account_phone_masked && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleUseAccountPhone}
                disabled={updating}
              >
                Use Sign-in Phone ({settings.account_phone_masked})
              </Button>
            )}

            <Button
              variant={isVerified ? 'outline' : 'default'}
              size="sm"
              className="text-xs h-8"
              onClick={handleOpenDialog}
            >
              <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
              {isVerified ? 'Change Number' : 'Set Up Number'}
            </Button>

            {isVerified && (
              <Button
                variant="secondary"
                size="sm"
                className="text-xs h-8"
                onClick={handleSendTest}
                disabled={testing}
              >
                {testing ? (
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                )}
                Send Test SMS
              </Button>
            )}
          </div>
        </div>

        {/* Informational Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="rounded-md border p-3 bg-card/50 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Timely Notifications
            </p>
            <p>
              SMS alerts are sent immediately when a booking is confirmed (after online payment or for cash-on-delivery orders).
            </p>
          </div>
          <div className="rounded-md border p-3 bg-card/50 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Privacy & Data Minimization
            </p>
            <p>
              Messages contain necessary pickup details, order numbers, and customer contact in compliance with the Ghana Data Protection Act (Act 843).
            </p>
          </div>
        </div>

        {/* Recent SMS History */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent SMS Activity
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[11px] text-muted-foreground px-2"
              onClick={loadSettings}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>

          {!settings?.recent || settings.recent.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-xs text-muted-foreground">
              No recent SMS alerts sent to your phone yet.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent text-[11px]">
                    <TableHead className="w-[120px]">Order No</TableHead>
                    <TableHead>Notification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Sent Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.recent.map((item) => (
                    <TableRow key={item.id} className="text-xs">
                      <TableCell className="font-mono font-medium">
                        {item.order_no || '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.kind}
                      </TableCell>
                      <TableCell>
                        {item.status === 'Delivered' ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                            Delivered
                          </Badge>
                        ) : item.status === 'Sent' ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                            Sent
                          </Badge>
                        ) : item.status === 'Sending' ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                            Sending
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                            title={item.reason || 'SMS could not be delivered'}
                          >
                            {item.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-[11px]">
                        {new Date(item.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>

      {/* Verification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {step === 'phone' ? (
            <form onSubmit={handleStartVerification}>
              <DialogHeader>
                <DialogTitle>Set Notification Phone</DialogTitle>
                <DialogDescription className="text-xs">
                  Enter your mobile phone number. We will send a 6-digit SMS verification code to verify ownership.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {dialogError && (
                  <Alert variant="destructive" className="py-2 text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{dialogError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="phone-input" className="text-xs">
                    Ghana Mobile Number
                  </Label>
                  <Input
                    id="phone-input"
                    type="tel"
                    placeholder="e.g. 024 123 4567 or +233..."
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    disabled={dialogSubmitting}
                    className="text-sm font-mono"
                    autoFocus
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Accepted formats: 024..., 050..., or international +233...
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={dialogSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={dialogSubmitting}>
                  {dialogSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <form onSubmit={handleConfirmVerification}>
              <DialogHeader>
                <DialogTitle>Enter Verification Code</DialogTitle>
                <DialogDescription className="text-xs">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-foreground font-mono">
                    {settings?.pending_phone_masked || phoneInput}
                  </span>
                  . Enter the code below to complete setup.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 flex flex-col items-center">
                {dialogError && (
                  <Alert variant="destructive" className="py-2 text-xs w-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{dialogError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2 flex flex-col items-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(val) => setOtpCode(val)}
                    disabled={dialogSubmitting}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-[11px] text-muted-foreground text-center">
                    Codes are valid for 10 minutes.
                  </p>
                </div>

                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs h-auto p-0"
                    onClick={() => {
                      setStep('phone')
                      setDialogError(null)
                    }}
                    disabled={dialogSubmitting}
                  >
                    Change phone number
                  </Button>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={dialogSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={otpCode.length < 6 || dialogSubmitting}
                >
                  {dialogSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Activate'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
