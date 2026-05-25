import { Transaction } from '@/shared/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { Badge } from '@/shared/ui/badge'
import { formatCurrency } from '@/shared/lib/format'
import { Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface TransactionHistoryProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/50">
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent transactions and completed orders</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
             <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold">Order ID</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-medium text-primary">#{tx.order_no}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{tx.customer_name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "uppercase tracking-wider text-[10px] pr-3 border-none gap-1 bg-emerald-100/50 text-emerald-700"
                        )}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-black">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
             <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3">
               <Clock className="w-8 h-8 text-muted-foreground/30" />
             </div>
             <p className="text-sm font-bold text-muted-foreground">No transactions yet</p>
             <p className="text-xs text-muted-foreground mt-1 max-w-sm">
               Completed orders and deliveries will appear here as your business grows.
             </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
