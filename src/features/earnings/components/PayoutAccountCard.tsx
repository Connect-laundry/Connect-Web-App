'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { AlertCircle, Edit3, ShieldCheck, Wallet } from 'lucide-react'
import { PayoutAccountInfo } from '../api'
import { PayoutSetupModal } from './PayoutSetupModal'
import { useAuth } from '@/features/auth/context/AuthContext'

interface PayoutAccountCardProps {
  account?: PayoutAccountInfo
  onRefresh?: () => void
}

const providerName = (provider?: string) => {
  switch ((provider || '').toUpperCase()) {
    case 'MTN':
      return 'MTN Mobile Money'
    case 'VOD':
      return 'Telecel Cash'
    case 'ATL':
      return 'ATMoney'
    default:
      return provider || 'Mobile Money'
  }
}

const friendlyStatus = (status?: string, isReady?: boolean) => {
  if (isReady || status === 'PAYOUT_READY') return 'Verified'
  if (status === 'PAYOUT_FAILED_RETRYABLE') return 'Needs attention'
  if (status === 'PAYOUT_SETUP_PENDING') return 'Checking account'
  return 'Not set up'
}

export const PayoutAccountCard = ({ account, onRefresh }: PayoutAccountCardProps) => {
  const { laundry } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const isReady = account?.is_ready || false
  const provider = account?.provider || laundry?.payout_provider || 'MTN'
  const maskedPhone = account?.masked_phone || laundry?.masked_payout_phone || 'Add payout phone'
  const status = account?.status || laundry?.payout_status || 'PAYOUT_SETUP_REQUIRED'
  const needsAttention = status === 'PAYOUT_FAILED_RETRYABLE'

  return (
    <>
      <Card className="border-border/60 shadow-xs bg-card">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Payout account</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Where Simame sends your earnings</p>
            </div>
          </div>
          <Badge
            className={
              needsAttention
                ? 'border-destructive/20 bg-destructive/10 text-destructive gap-1 font-bold'
                : isReady
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 gap-1 font-bold'
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
            }
          >
            {needsAttention ? <AlertCircle className="h-3.5 w-3.5" /> : isReady ? <ShieldCheck className="h-3.5 w-3.5" /> : null}
            {friendlyStatus(status, isReady)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-border/80 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">{providerName(provider)}</p>
              <p className="mt-1 text-lg font-black tracking-tight text-primary">{maskedPhone}</p>
              {isReady && <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">Payout account ready</p>}
              {needsAttention && (
                <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
                  We could not confirm this payout account. Your earnings are safe. Try again or use a different Mobile Money number.
                </p>
              )}
            </div>

            <Button
              variant={isReady ? 'outline' : 'default'}
              size="sm"
              onClick={() => setModalOpen(true)}
              className="min-h-10 gap-2 self-start font-bold sm:self-auto"
            >
              <Edit3 className="h-3.5 w-3.5" />
              {isReady ? 'Change payout account' : 'Set up payout account'}
            </Button>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Changing your payout account affects future payouts only. Any payout already processing continues to the account used when it started.
          </p>
        </CardContent>
      </Card>

      <PayoutSetupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={onRefresh}
        currentPhone={account?.phone || laundry?.payout_phone || ''}
        currentProvider={account?.provider || laundry?.payout_provider || 'MTN'}
        businessPhone={laundry?.phone_number || ''}
      />
    </>
  )
}