'use client'

import { useEarnings } from '@/features/earnings/hooks/useEarnings'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle, CheckCircle2, Clock, Download, Loader2, Wallet } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { formatCurrency } from '@/shared/lib/format'
import { PayoutStatusBanner } from '@/features/earnings/components/PayoutStatusBanner'
import { PayoutAccountCard } from '@/features/earnings/components/PayoutAccountCard'
import { OrderEarningRowsTable } from '@/features/earnings/components/OrderEarningRowsTable'
import type { PayoutAccountInfo, PayoutItem } from '@/features/earnings/api'

const providerName = (provider?: string) => {
  switch ((provider || '').toUpperCase()) {
    case 'MTN':
      return 'MTN'
    case 'VOD':
      return 'Telecel'
    case 'ATL':
      return 'ATMoney'
    default:
      return provider || 'Mobile Money'
  }
}

const payoutStatusLabel = (status?: string) => {
  switch (status) {
    case 'PAID':
      return 'Paid'
    case 'PROCESSING':
      return 'Processing'
    case 'WAITING_FOR_FUNDS':
    case 'DRAFT':
      return 'Processing'
    case 'FAILED':
    case 'REVERSED':
      return 'Needs attention'
    default:
      return 'Pending'
  }
}

const EarningsPage = () => {
  const {
    payoutsData,
    isExporting,
    error,
    isInitialLoading,
    exportReport,
    refresh,
  } = useEarnings()

  const summary = payoutsData?.summary
  const available = Number(summary?.available ?? 0)
  const pending = Number(summary?.held ?? 0)
  const processing = Number(summary?.processing ?? 0)
  const paidThisMonth = Number(summary?.paid_this_month ?? 0)
  const latestPayout = payoutsData?.payouts?.[0]

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Earnings
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            See what you have earned and where your next payout stands.
          </p>
        </div>
        <Button
          onClick={exportReport}
          disabled={isExporting}
          variant="outline"
          className="min-h-10 gap-2 self-start font-bold sm:self-auto"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isExporting ? 'Preparing...' : 'Export CSV'}
        </Button>
      </div>

      <PayoutStatusBanner onRefresh={refresh} />

      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <PayoutStatCard
          title="Available earnings"
          value={available}
          description="Ready to send"
          highlight
          icon={<Wallet className="h-4 w-4 text-emerald-600" />}
        />
        <PayoutStatCard
          title="Pending earnings"
          value={pending}
          description="Orders still protected"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <PayoutStatCard
          title="Paid this month"
          value={paidThisMonth}
          description="Confirmed payouts"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
        />
      </div>

      <LatestPayoutCard
        payout={latestPayout}
        account={payoutsData?.payout_account}
        processing={processing}
      />

      <PayoutAccountCard account={payoutsData?.payout_account} onRefresh={refresh} />

      <OrderEarningRowsTable
        settlements={payoutsData?.settlements || []}
        isLoading={isInitialLoading && !payoutsData}
      />
    </div>
  )
}

interface PayoutStatCardProps {
  title: string
  value: number
  description: string
  highlight?: boolean
  icon: React.ReactNode
}

const PayoutStatCard = ({ title, value, description, highlight, icon }: PayoutStatCardProps) => {
  return (
    <Card className="border-border/60 bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/60">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-black tracking-tight ${highlight ? 'text-primary' : 'text-foreground'}`}>
          {formatCurrency(value)}
        </div>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface LatestPayoutCardProps {
  payout?: PayoutItem
  account?: PayoutAccountInfo
  processing: number
}

const LatestPayoutCard = ({ payout, account, processing }: LatestPayoutCardProps) => {
  const amount = Number(payout?.amount ?? processing ?? 0)
  const status = payoutStatusLabel(payout?.status)
  const hasPayout = Boolean(payout)
  const accountLine = account?.is_ready
    ? `${providerName(account.provider)} ${account.masked_phone || ''}`.trim()
    : 'Set up a payout account to receive earnings'

  return (
    <Card className="border-border/60 bg-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-tight">Next payout</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-3xl font-black tracking-tight text-foreground">
            {hasPayout ? formatCurrency(amount) : formatCurrency(processing)}
          </p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{accountLine}</p>
        </div>
        <div className="self-start rounded-full border border-border px-3 py-1.5 text-sm font-bold sm:self-auto">
          {hasPayout ? status : processing > 0 ? 'Processing' : 'No payout processing'}
        </div>
      </CardContent>
    </Card>
  )
}

export default EarningsPage