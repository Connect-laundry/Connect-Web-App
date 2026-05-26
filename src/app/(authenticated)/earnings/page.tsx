'use client'

import { useState, useCallback } from 'react'
import { useSilentPolling } from '@/shared/hooks/useSilentPolling'
import { getDashboardEarnings } from '@/features/dashboard/api'
import { getTransactionHistory, exportEarningsCSV } from '@/features/earnings/api'
import { DashboardEarnings, Transaction } from '@/shared/types'
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
  
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEarningsData = useCallback(async () => {
    try {
      setError(null)
      // We wrap these in separate try/catch blocks so one failing API doesn't kill the whole page.
      // This defends against backend 500s when database tables are empty.
      let fetchedEarnings = null;
      let fetchedTransactions = null;
      
      try {
        fetchedEarnings = await getDashboardEarnings()
      } catch (err: any) {
        console.warn('Earnings API Error:', err)
        setError(err.message || 'Failed to sync recent earnings metrics')
      }

      try {
        const txResponse = await getTransactionHistory({ limit: 50 });
        fetchedTransactions = Array.isArray(txResponse) 
          ? txResponse 
          : (txResponse as any).results || (txResponse as any).data || [];
      } catch (_err: any) {
        console.warn('Transactions API endpoint not available yet (404). Falling back to empty state.')
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
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

      {/* Transaction History Table */}
      <TransactionHistory transactions={transactions} isLoading={isInitialLoading} />
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
