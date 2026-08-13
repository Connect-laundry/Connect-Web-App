'use client'

import { useState, useCallback } from 'react'
import { useSilentPolling } from '@/shared/hooks/useSilentPolling'
import { getDashboardEarnings } from '@/features/dashboard/api'
import {
  exportEarningsCSV,
  getPayoutOverview,
  getTransactionHistory,
  type PayoutOverview,
} from '@/features/earnings/api'
import { DashboardEarnings, Transaction } from '@/shared/interfaces'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle, TrendingUp, Download, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { formatCurrency } from '@/shared/lib/format'
import { TransactionHistory } from '@/features/earnings/components/TransactionHistory'

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<DashboardEarnings>({
    today: 0,
    this_week: 0,
    this_month: 0,
    total_revenue: 0
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [payoutOverview, setPayoutOverview] = useState<PayoutOverview | null>(null)
  
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEarningsData = useCallback(async () => {
    try {
      setError(null)
      let fetchedEarnings = null;
      let fetchedTransactions: Transaction[] = [];
      
      try {
        fetchedEarnings = await getDashboardEarnings()
      } catch (err: any) {
        console.warn('Earnings API Error:', err)
        setError(err.message || 'Failed to sync recent earnings metrics')
      }

      try {
        setPayoutOverview(await getPayoutOverview())
      } catch (err: any) {
        console.warn('Payouts API Error:', err)
        setError(err.message || 'Failed to load payout balances')
      }

      try {
        const txResponse = await getTransactionHistory({ limit: 50 });
        fetchedTransactions = Array.isArray(txResponse) 
          ? txResponse 
          : (txResponse as any).results || (txResponse as any).data || [];
      } catch (_err: any) {
        console.warn('Transactions API endpoint not available yet (404). Falling back to empty state.')
      }

      // Fallback calculation from orders/transactions if backend stats are strictly filtering DELIVERED
      const totalTx = fetchedTransactions.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0)
      if (!fetchedEarnings || fetchedEarnings.total_revenue === 0 || fetchedEarnings.today === 0) {
        if (totalTx > 0) {
          fetchedEarnings = {
            today: fetchedEarnings?.today || totalTx,
            this_week: fetchedEarnings?.this_week || totalTx,
            this_month: fetchedEarnings?.this_month || totalTx,
            total_revenue: fetchedEarnings?.total_revenue || totalTx,
          }
        }
      }

      if (fetchedEarnings) setEarnings(fetchedEarnings)
      if (fetchedTransactions) setTransactions(fetchedTransactions)
      
    } catch (err: any) {
      console.error('Critical page error:', err)
    }
  }, [])

  const { isInitialLoading } = useSilentPolling(fetchEarningsData, 30000)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await exportEarningsCSV()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `connect-earnings-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      alert('Failed to export report: ' + (err.message || 'Unknown error'))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Earnings</h1>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Track your revenue and completed payouts</p>
        </div>
        <Button 
          onClick={handleExport} 
          disabled={isExporting || transactions.length === 0}
          className="gap-2 shadow-sm font-bold bg-primary hover:bg-primary/90 transition-all active:scale-95"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isExporting ? 'Generating CSV...' : 'Export Report'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8 border-destructive/20 bg-destructive/5 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Today" value={earnings.today} description="From completed orders" />
        <StatCard title="This Week" value={earnings.this_week} />
        <StatCard title="This Month" value={earnings.this_month} />
        <StatCard title="Total Revenue" value={earnings.total_revenue} highlight />
      </div>

      <PayoutOverviewPanel overview={payoutOverview} isLoading={isInitialLoading} />

      {/* Transaction History Table */}
      <TransactionHistory transactions={transactions} isLoading={isInitialLoading} />
    </div>
  )
}

function PayoutOverviewPanel({ overview, isLoading }: { overview: PayoutOverview | null; isLoading: boolean }) {
  return (
    <Card className="mb-8 border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Payout position</CardTitle>
        <p className="text-sm text-muted-foreground">
          Customer funds held, available for payout, and already paid.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && !overview ? (
          <div className="h-20 animate-pulse bg-muted/40" />
        ) : overview ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <PayoutMetric label="Held" value={overview.summary.held} />
              <PayoutMetric label="Available" value={overview.summary.available} />
              <PayoutMetric label="Paid" value={overview.summary.paid} />
            </div>
            <div className="mt-6 border-t pt-4">
              <h2 className="text-sm font-bold">Recent settlements</h2>
              {overview.settlements.length ? (
                <div className="mt-3 divide-y">
                  {overview.settlements.map((settlement) => (
                    <div key={`${settlement.order_no}-${settlement.created_at}`} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                      <div>
                        <p className="font-semibold">{settlement.order_no || 'Settlement'}</p>
                        <p className="text-muted-foreground">
                          Gross {formatCurrency(Number(settlement.gross))} · Commission {formatCurrency(Number(settlement.commission))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black">{formatCurrency(Number(settlement.net))}</p>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">{settlement.status} · {settlement.route}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No settlement records are available yet.</p>
              )}
            </div>
            <div className="mt-6 border-t pt-4">
              <h2 className="text-sm font-bold">Recent payouts</h2>
              {overview.payouts.length ? (
                <div className="mt-3 divide-y">
                  {overview.payouts.map((payout) => (
                    <div key={payout.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                      <div>
                        <p className="font-semibold">{payout.reference || 'Payout'}</p>
                        <p className="text-muted-foreground">
                          {payout.method} · {new Date(payout.paid_at || payout.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black">{formatCurrency(Number(payout.amount))}</p>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">{payout.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No payouts have been recorded yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Payout balances are currently unavailable.</p>
        )}
      </CardContent>
    </Card>
  )
}

function PayoutMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-4 border-primary px-4 py-2">
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black">{formatCurrency(Number(value))}</p>
    </div>
  )
}
function StatCard({ title, value, description, highlight }: { title: string, value: number, description?: string, highlight?: boolean }) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-8 -translate-y-8 group-hover:bg-primary/10 transition-colors duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground tracking-tight">{title}</CardTitle>
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-black tracking-tight ${highlight ? 'text-primary' : ''}`}>
          {formatCurrency(value)}
        </div>
        {description && <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tighter mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
