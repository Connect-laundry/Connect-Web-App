'use client'

import { useState } from 'react'
import { AlertCircle, ArrowRight, RefreshCw, Wallet } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { PayoutSetupModal } from './PayoutSetupModal'
import { useAuth } from '@/features/auth/context/AuthContext'

interface PayoutStatusBannerProps {
  onRefresh?: () => void
}

export const PayoutStatusBanner = ({ onRefresh }: PayoutStatusBannerProps) => {
  const { laundry } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  if (!laundry) return null

  const status = laundry.payout_status || (laundry.paystack_recipient_code ? 'PAYOUT_READY' : 'PAYOUT_SETUP_REQUIRED')
  if (status === 'PAYOUT_READY') return null

  const isFailed = status === 'PAYOUT_FAILED_RETRYABLE'

  return (
    <>
      <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-950 shadow-xs dark:text-amber-100 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
              {isFailed ? <AlertCircle className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold sm:text-base">
                {isFailed ? "We couldn't confirm your payout account" : 'Set up where your earnings should go'}
              </h4>
              <p className="mt-0.5 text-sm leading-relaxed text-amber-900/80 dark:text-amber-100/80">
                {isFailed
                  ? 'Your earnings are safe. Try confirming your Mobile Money account again, or use another number.'
                  : 'Add your Mobile Money account once. Simame will send earnings automatically after completed orders.'}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="min-h-10 shrink-0 gap-2 bg-amber-700 px-4 text-sm font-bold text-white shadow-xs hover:bg-amber-800"
          >
            {isFailed ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Try again
              </>
            ) : (
              <>
                Set up payout account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <PayoutSetupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={onRefresh}
        currentPhone={laundry.payout_phone || ''}
        currentProvider={laundry.payout_provider || 'MTN'}
        businessPhone={laundry.phone_number || ''}
      />
    </>
  )
}