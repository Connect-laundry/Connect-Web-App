"use client";

import { useOrderDetailModal } from "@/features/orders/hooks/useOrderDetailModal";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle, CheckCircle, Clock, Receipt } from "lucide-react";
import { OrderWeighingCard } from "./OrderWeighingCard";
import { OrderModalHeader } from "./OrderModalHeader";
import { OrderLifecycleStepper } from "./OrderLifecycleStepper";
import { OrderInfoGrids } from "./OrderInfoGrid";
import { OrderModalFooter } from "./OrderModalFooter";
import { OrderDetailModalProps } from "../interfaces";
import { formatDate } from "@/shared/lib/format"

export function OrderDetailModal({
  order,
  open,
  onOpenChange,
  onOrderUpdated,
}: OrderDetailModalProps) {
  const {
    isLoading,
    error,
    successMessage,
    weight,
    setWeight,
    orderTimeline,
    priceBreakdown,
    availableActions,
    currentStepIndex,
    handleAction,
    displayTotal,
  } = useOrderDetailModal(order, onOrderUpdated, onOpenChange);

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col p-0 overflow-hidden rounded-2xl border-border/40 shadow-2xl bg-background">
        <OrderModalHeader order={order} displayTotal={displayTotal} />

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="font-semibold">{successMessage}</AlertDescription>
            </Alert>
          )}

          {order.status !== "CANCELLED" && order.status !== "REJECTED" && (
            <OrderLifecycleStepper currentStepIndex={currentStepIndex} />
          )}

          <OrderWeighingCard status={order.status} weight={weight} setWeight={setWeight} />

          <OrderInfoGrids order={order} />

          {priceBreakdown && (
            <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
                <Receipt className="w-4 h-4 text-primary" />
                <span>Price Breakdown</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {Object.entries(priceBreakdown).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-1 border-b border-border/20 last:border-none"
                  >
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-bold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
              <Clock className="w-4 h-4 text-primary" />
              <span>Audit Trail & History</span>
            </div>
            {!orderTimeline || orderTimeline.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-2">
                No historical events recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {orderTimeline.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 text-xs">
                    <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="font-bold">{item.status_display}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <OrderModalFooter
          onClose={() => onOpenChange(false)}
          availableActions={availableActions}
          isLoading={isLoading}
          onAction={handleAction}
        />
      </DialogContent>
    </Dialog>
  );
}