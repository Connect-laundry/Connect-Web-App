'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CheckCircle2, Landmark, Smartphone, Wallet } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { apiGet } from '@/shared/api/client'
import { unwrap } from '@/shared/api/unwrap'

interface PayoutProvider {
  name: string
  code: string
  slug: string
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

export const PayoutAccountStep = () => {
  const form = useFormContext()
  const businessPhone = form.watch('phone_number') || ''
  const payoutPhone = form.watch('payout_phone') || ''
  const payoutProvider = form.watch('payout_provider') || 'MTN'
  const payoutMethod = form.watch('payout_method') || 'MOBILE_MONEY'
  const payoutConfirmed = Boolean(form.watch('payout_confirmed'))

  const [providers, setProviders] = useState<PayoutProvider[]>(fallbackProviders)
  const [loadingProviders, setLoadingProviders] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function fetchProviders() {
      try {
        setLoadingProviders(true)
        const res = await apiGet<any>('/payments/payout-providers/?currency=GHS&type=mobile_money')
        const data = unwrap<any>(res)
        const providerList = Array.isArray(data) ? data : data?.providers
        if (isMounted && Array.isArray(providerList) && providerList.length > 0) {
          setProviders(providerList)
        }
      } catch (_err) {
        // The fallback list keeps setup usable on slow networks.
      } finally {
        if (isMounted) setLoadingProviders(false)
      }
    }
    fetchProviders()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (businessPhone && !payoutPhone) {
      form.setValue('use_business_phone_for_payout', true, { shouldValidate: false })
      form.setValue('payout_phone', businessPhone, { shouldValidate: true })
    }
  }, [businessPhone, payoutPhone, form])

  useEffect(() => {
    if (payoutMethod !== 'MOBILE_MONEY') {
      form.setValue('payout_confirmed', false, { shouldValidate: true })
    }
  }, [payoutMethod, form])

  const selectedProvider = providers.find((p) => p.code === payoutProvider)
  const localPhone = useMemo(() => {
    const raw = (payoutPhone || '').replace(/\D/g, '')
    if (raw.startsWith('233') && raw.length === 12) return `0${raw.slice(3)}`
    return raw
  }, [payoutPhone])

  const maskedPhone = useMemo(() => {
    if (!localPhone) return 'Enter a phone number'
    if (localPhone.length >= 7) return `${localPhone.slice(0, 3)} *** ${localPhone.slice(-4)}`
    return localPhone
  }, [localPhone])

  const canConfirm = payoutMethod === 'MOBILE_MONEY' && localPhone.length >= 9 && Boolean(payoutProvider)

  const selectMethod = (method: 'MOBILE_MONEY' | 'BANK_ACCOUNT') => {
    form.setValue('payout_method', method, { shouldValidate: true })
    if (method === 'MOBILE_MONEY' && businessPhone && !payoutPhone) {
      form.setValue('payout_phone', businessPhone, { shouldValidate: true })
    }
  }

  const confirmPayout = () => {
    if (!canConfirm) return
    form.setValue('payout_confirmed', true, { shouldValidate: true })
    form.setValue('use_business_phone_for_payout', payoutPhone === businessPhone, { shouldValidate: false })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">Get paid automatically</h4>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              Simame sends your earnings after the customer confirms receiving the order, or after the protection period if no issue is reported.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel className="text-sm font-bold">How would you like to receive your earnings?</FormLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectMethod('MOBILE_MONEY')}
            className={`rounded-lg border p-4 text-left transition-colors ${
              payoutMethod === 'MOBILE_MONEY'
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
                <span className="block text-xs text-muted-foreground">MTN, Telecel, ATMoney</span>
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => selectMethod('BANK_ACCOUNT')}
            className={`rounded-lg border p-4 text-left transition-colors ${
              payoutMethod === 'BANK_ACCOUNT'
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
      </div>

      {payoutMethod === 'BANK_ACCOUNT' ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
          Bank payouts need bank account details that Simame does not have yet. Choose Mobile Money to finish setup now.
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-border/80 bg-card/50 p-4">
          <FormField
            control={form.control}
            name="payout_provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {providers.map((p) => (
                      <button
                        key={p.code}
                        type="button"
                        disabled={loadingProviders}
                        onClick={() => {
                          field.onChange(p.code)
                          form.setValue('payout_confirmed', false, { shouldValidate: true })
                        }}
                        className={`min-h-11 rounded-md border px-3 py-2 text-sm font-bold transition-colors disabled:opacity-60 ${
                          field.value === p.code
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background hover:bg-muted/50'
                        }`}
                      >
                        {providerDisplayName(p)}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payout_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payout phone</FormLabel>
                <FormControl>
                  <Input
                    inputMode="tel"
                    placeholder="055 105 7139"
                    className="h-11 text-base"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      form.setValue('payout_confirmed', false, { shouldValidate: true })
                    }}
                  />
                </FormControl>
                {businessPhone && field.value !== businessPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      form.setValue('payout_phone', businessPhone, { shouldValidate: true })
                      form.setValue('use_business_phone_for_payout', true, { shouldValidate: false })
                      form.setValue('payout_confirmed', false, { shouldValidate: true })
                    }}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Use business phone {businessPhone}
                  </button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-foreground">{providerDisplayName(selectedProvider)}</p>
                <p className="mt-1 text-lg font-black tracking-tight text-primary">{maskedPhone}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  This is where your Simame earnings will be sent automatically after completed orders.
                </p>
              </div>
              {payoutConfirmed && <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />}
            </div>
          </div>

          <Button
            type="button"
            onClick={confirmPayout}
            disabled={!canConfirm}
            className="min-h-11 w-full font-bold"
          >
            {payoutConfirmed ? 'Payout account ready' : 'Confirm payout account'}
          </Button>

          <FormField
            control={form.control}
            name="payout_confirmed"
            render={() => <FormMessage />}
          />
        </div>
      )}
    </div>
  )
}