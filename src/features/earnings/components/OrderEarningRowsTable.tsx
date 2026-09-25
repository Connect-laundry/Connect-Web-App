'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { Badge } from '@/shared/ui/badge'
import { formatCurrency } from '@/shared/lib/format'
import { AlertTriangle, CheckCircle2, Clock, Loader2, Wallet } from 'lucide-react'
import { SettlementRow } from '../api'

interface OrderEarningRowsTableProps {
  settlements: SettlementRow[]
  isLoading?: boolean
}

const friendlyStatus = (s: SettlementRow) => {
  const effectiveStatus = s.payout_status || s.status
  switch (effectiveStatus) {
    case 'PAID':
      return { label: 'Paid', description: 'Money sent', tone: 'paid' }
    case 'PROCESSING':
      return { label: 'Processing', description: 'Payout on the way', tone: 'processing' }
    case 'PENDING':
      return { label: 'Available', description: 'Ready for payout', tone: 'available' }
    case 'HELD':
      return { label: 'Pending', description: 'Customer protection period', tone: 'pending' }
    case 'WAITING_FOR_FUNDS':
    case 'DRAFT':
    case 'SCHEDULED':
      return { label: 'Processing', description: 'Payout being prepared', tone: 'processing' }
    case 'FAILED':
    case 'REVERSED':
      return { label: 'Needs attention', description: 'Your money is safe', tone: 'attention' }
    default:
      return { label: 'Pending', description: 'In progress', tone: 'pending' }
  }
}

export const OrderEarningRowsTable = ({ settlements, isLoading }: OrderEarningRowsTableProps) => {
  const renderStatusBadge = (s: SettlementRow) => {
    const status = friendlyStatus(s)
    switch (status.tone) {
      case 'paid':
        return (
          <Badge className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            {status.label}
          </Badge>
        )
      case 'processing':
        return (
          <Badge className="gap-1 border-blue-500/20 bg-blue-500/10 text-[11px] font-bold text-blue-700 dark:text-blue-300">
            <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
            {status.label}
          </Badge>
        )
      case 'available':
        return (
          <Badge className="gap-1 border-primary/20 bg-primary/10 text-[11px] font-bold text-primary">
            <Wallet className="h-3 w-3" />
            {status.label}
          </Badge>
        )
      case 'attention':
        return (
          <Badge className="gap-1 border-destructive/20 bg-destructive/10 text-[11px] font-bold text-destructive">
            <AlertTriangle className="h-3 w-3" />
            {status.label}
          </Badge>
        )
      default:
        return (
          <Badge className="gap-1 border-border bg-muted text-[11px] font-medium text-muted-foreground">
            <Clock className="h-3 w-3" />
            {status.label}
          </Badge>
        )
    }
  }

  return (
    <Card className="overflow-hidden border-border/60 shadow-xs">
      <CardHeader className="border-b border-border/60 bg-muted/10">
        <CardTitle className="text-lg font-bold tracking-tight">Recent earnings</CardTitle>
        <CardDescription className="text-xs">
          Order earnings and payout status in plain language.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : settlements.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 text-xs">
                  <TableHead className="font-bold">Order</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((s) => {
                  const status = friendlyStatus(s)
                  return (
                    <TableRow key={s.id} className="text-sm transition-colors hover:bg-muted/5">
                      <TableCell className="font-mono font-bold text-primary">
                        #{s.order_no || s.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="font-black text-foreground">
                        {formatCurrency(Number(s.net))}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <div>{renderStatusBadge(s)}</div>
                          <span className="text-[10px] text-muted-foreground">{status.description}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
              <Clock className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-bold text-foreground">No earnings yet</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Completed orders will appear here with the amount and payout status.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}