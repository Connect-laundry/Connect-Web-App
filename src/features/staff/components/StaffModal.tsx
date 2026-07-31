'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { AlertCircle } from 'lucide-react'
import { Order } from '@/shared/interfaces'

interface StaffModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  orders: Order[]
  uniqueDrivers: Set<string>
  selectedOrderId: string
  setSelectedOrderId: (id: string) => void
  driverId: string
  setDriverId: (id: string) => void
  assignmentType: string
  setAssignmentType: (type: string) => void
  isSubmitting: boolean
  modalError: string | null
  onSubmit: (e: React.FormEvent) => void
}

export function StaffModal({
  isOpen,
  onOpenChange,
  orders,
  uniqueDrivers,
  selectedOrderId,
  setSelectedOrderId,
  driverId,
  setDriverId,
  assignmentType,
  setAssignmentType,
  isSubmitting,
  modalError,
  onSubmit,
}: StaffModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">Assign Driver to Order</DialogTitle>
          <DialogDescription className="text-xs">
            Select an active customer order and enter the Driver Account ID or email to create a delivery task.
          </DialogDescription>
        </DialogHeader>

        {modalError && (
          <Alert variant="destructive" className="py-2 text-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-semibold">{modalError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Order
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">-- Choose active order --</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order #{o.order_no} ({o.customer_name} - {o.status_display})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Driver Account Email or UUID
            </label>

            {Array.from(uniqueDrivers).length > 0 && (
              <div className="mb-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) setDriverId(e.target.value)
                  }}
                  className="w-full h-9 rounded-lg border border-input bg-muted/40 px-3 text-xs font-medium mb-1.5"
                >
                  <option value="">-- Or pick from active couriers --</option>
                  {Array.from(uniqueDrivers).map((driverStr) => (
                    <option key={driverStr} value={driverStr}>
                      {driverStr}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Input
              placeholder="Enter driver email or UUID..."
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="h-10 text-sm font-medium"
              required
            />
            <p className="text-[10px] text-muted-foreground">
              Driver accounts (<code className="px-1 bg-muted rounded">role: DRIVER</code>) are provisioned by system admins.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Assignment Type
            </label>
            <select
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium focus:ring-2 focus:ring-primary"
            >
              <option value="BOTH">Both Pickup & Delivery</option>
              <option value="PICKUP">Pickup Only</option>
              <option value="DELIVERY">Delivery Only</option>
            </select>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-bold text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="font-bold text-xs">
              {isSubmitting ? <Spinner className="w-4 h-4 mr-2" /> : 'Confirm Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
