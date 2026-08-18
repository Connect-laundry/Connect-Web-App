'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { ORDER_STATUSES } from '../data'
import { OrdersFiltersProps } from '../types'





export const OrdersFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: OrdersFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Search Order</label>
          <Input
            placeholder="Order no or customer name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={statusFilter || 'ALL'}
            onValueChange={(value) => onStatusChange(value === 'ALL' ? '' : value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
