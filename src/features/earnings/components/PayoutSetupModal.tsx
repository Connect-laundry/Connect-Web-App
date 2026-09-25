'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle, CheckCircle2, Landmark, Loader2, Smartphone, Wallet } from 'lucide-react'
import { apiGet, apiPost } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'
import { useAuth } from '@/features/auth/context/AuthContext'
import { toast } from 'sonner'

interface PayoutProvider {
  name: string
  code: string
  slug: string
}

interface PayoutSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  currentPhone?: string
  currentProvider?: string
  businessPhone?: string
}

const fallbackProviders: PayoutProvider[] = [
  { name: 'MTN Mobile Money', code: 'MTN', slug: 'mtn' },
  { name: 'Telecel Cash', code: 'VOD', slug: 'vodafone' },
  { name: 'ATMoney', code: 'ATL', slug: 'airteltigo' },
]

const providerDisplayName = (provider?: PayoutProvider) => {
  if (!provider) return 'Mobile Money'
  if (provider.code === 'VOD') return 'Telecel Cash'
  if (provider.code === 'ATL') return 'ATMoney'
  return provider.name
}

const friendlyPayoutError = (message?: string) => {
  const text = (message || '').toLowerCase()
  if (text.includes('phone') || text.includes('number')) {
    return 'Please check the phone number. Use a valid Ghana Mobile Money number.'
  }
  if (text.includes('network') || text.includes('provider')) {
    return 'Please choose MTN, Telecel, or ATMoney.'
  }
  if (text.includes('unauthor')) {
    return 'You can only update the payout account for your own laundry.'
  }
  return "We couldn't confirm this payout account right now. Your earnings are safe. Please try again."
}

export const PayoutSetupModal = ({
  open,
  onOpenChange,
  onSuccess,
  currentPhone,
  currentProvider,
  businessPhone,
}: PayoutSetupModalProps) => {
  const { laundry, refreshLaundry } = useAuth()
  const [method, setMethod] = useState<'MOBILE_MONEY' | 'BANK_ACCOUNT'>('MOBILE_MONEY')
  const [provider, setProvider] = useState<string>(currentProvider || 'MTN')
  const [phone, setPhone] = useState<string>(currentPhone || businessPhone || '')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [providers, setProviders] = useState<PayoutProvider[]>(fallbackProviders)

  useEffect(() => {
    if (!open) return
    setError(null)
    setMethod('MOBILE_MONEY')
    setProvider(currentProvider || 'MTN')
    setPhone(currentPhone || businessPhone || '')
  }, [open, currentPhone, currentProvider, businessPhone])

  useEffect(() => {
    let isMounted = true
    async function fetchProviders() {
      try {
        const res = await apiGet<any>('/payments/payout-providers/?currency=GHS&type=mobile_money')
        const data = unwrap<any>(res)
        const providerList = Array.isArray(data) ? data : data?.providers
        if (isMounted && Array.isArray(providerList) && providerList.length > 0) {
          setProviders(providerList)
        }
      } catch (_e) {
        // The fallback list keeps setup usable on slow networks.
      }
    }
    if (open) fetchProviders()
    return () => {
      isMounted = false
    }
  }, [open])

  const selectedProvider = providers.find((p) => p.code === provider)

  const localPhone = useMemo(() => {
    const raw = (phone || '').replace(/\D/g, '')
    if (raw.startsWith('233') && raw.length === 12) return `0${raw.slice(3)}`
    return raw
  }, [phone])

  const maskedPhone = useMemo(() => {
    if (!localPhone) return 'Enter a phone number'
    if (localPhone.length >= 7) return `${localPhone.slice(0, 3)} *** ${localPhone.slice(-4)}`
    return localPhone
  }, [localPhone])

  const ending = localPhone.length >= 4 ? localPhone.slice(-4) : ''
  const canSubmit = method === 'MOBILE_MONEY' && phone.replace(/\D/g, '').length >= 9 && !isSubmitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (method !== 'MOBILE_MONEY') {
      setError('Bank account payouts are not ready yet. Please use Mobile Money for now.')
      return
    }
    if (!phone || phone.replace(/\D/g, '').length < 9) {
      setError('Please enter a valid Ghana Mobile Money number.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const res = await apiPost('/laundries/dashboard/my-laundry/payout-account/', {
        payout_method: 'MOBILE_MONEY',
        payout_provider: provider,
        payout_phone: phone,
        account_name: laundry?.name || '',
        confirmed: true,
      })
      unwrap(res)
      toast.success('Payout account ready')
      await refreshLaundry()
      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      setError(friendlyPayoutError(err?.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            How would you like to receive your earnings?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Set this up once. Simame sends future earnings automatically after completed orders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <Alert variant="destructive" className="py-2.5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod('MOBILE_MONEY')}
              className={`rounded-lg border p-4 text-left transition-colors ${
                method === 'MOBILE_MONEY'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Smartphone className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold">Mobile Money</span>
                  <span className="block text-xs text-muted-foreground">Fastest for Ghana</span>
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMethod('BANK_ACCOUNT')}
              className={`rounded-lg border p-4 text-left transition-colors ${
                method === 'BANK_ACCOUNT'
                  ? 'border-amber-400 bg-amber-50 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100'
                  : 'border-border bg-background hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Landmark className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold">Bank Account</span>
                  <span className="block text-xs text-muted-foreground">Coming soon</span>
                </span>
              </div>
            </button>
          </div>

          {method === 'BANK_ACCOUNT' ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
              Bank payouts need bank account details that Simame does not have yet. Use Mobile Money today to receive earnings automatically.
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-bold">Choose your Mobile Money provider</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {providers.map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => setProvider(p.code)}
                      className={`min-h-11 rounded-md border px-3 py-2 text-sm font-bold transition-colors ${
                        provider === p.code
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-muted/50'
                      }`}
                    >
                      {providerDisplayName(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-bold">Payout phone</Label>
                <Input
                  inputMode="tel"
                  placeholder="055 105 7139"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 text-base"
                />
                {businessPhone && (
                  <button
                    type="button"
                    onClick={() => setPhone(businessPhone)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Use business phone {businessPhone}
                  </button>
                )}
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {providerDisplayName(selectedProvider)}
                    </p>
                    <p className="mt-1 text-lg font-black tracking-tight text-primary">
                      {maskedPhone}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Future payouts use this account. A payout already processing will continue to the account it started with.
                    </p>
                  </div>
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </>
          )}

          <DialogFooter className="gap-2 pt-1 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit} className="min-h-11 font-bold">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : ending ? (
                `Confirm ${providerDisplayName(selectedProvider)} ending ${ending}`
              ) : (
                'Confirm payout account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}