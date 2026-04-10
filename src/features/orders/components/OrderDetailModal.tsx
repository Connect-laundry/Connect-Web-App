"use client";

import { useState, useEffect } from "react";
import { Order, OrderTimeline as OrderTimelineType } from "@/shared/types";
import {
  executeOrderAction,
  getAvailableActions,
  getOrderTimeline,
} from "@/features/orders/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Spinner } from "@/shared/ui/spinner";
import { OrderCustomerInfo } from "./OrderCustomerInfo";
import { OrderDates } from "./OrderDates";
import { OrderTimeline } from "./OrderTimeline";
import { OrderWeighingCard } from "./OrderWeighingCard";
import { AlertCircle, CheckCircle } from "lucide-react";

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated?: (order: Order) => void;
}

const ACTION_LABELS: Record<string, string> = {
  accept: "Accept Order",
  reject: "Reject Order",
  markPickedUp: "Mark Picked Up",
  markWashed: "Mark In Process",
  markOutForDelivery: "Mark Out for Delivery",
  markDelivered: "Mark Delivered",
  complete: "Complete Order",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PICKED_UP: "bg-purple-100 text-purple-800",
  IN_PROCESS: "bg-orange-100 text-orange-800",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
};

export function OrderDetailModal({
  order,
  open,
  onOpenChange,
  onOrderUpdated,
}: OrderDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [weight, setWeight] = useState<string>(
    order?.actual_weight?.toString() || "",
  );
  const [orderTimeline, setOrderTimeline] = useState<OrderTimelineType[] | null>(
    null,
  );

  useEffect(() => {
    if (order?.id) {
      getOrderTimeline(order.id).then((data) => {
        setOrderTimeline(data);
      });
    }
  }, [order?.id]);

  if (!order) return null;

  const availableActions = getAvailableActions(order.status);

  const handleAction = async (action: string) => {
    setIsLoading(true);
    setWeight("");
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedOrder = await executeOrderAction(order.id, action, weight);
      setSuccessMessage(
        `Order ${ACTION_LABELS[action].toLowerCase()} successfully`,
      );
      setTimeout(() => {
        onOrderUpdated?.(updatedOrder);
        onOpenChange(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order #{order.order_no}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          {/* Status */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
              >
                {order.status_display}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Total</p>
              <p className="text-2xl font-bold">
                ₦{order.total_amount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <OrderCustomerInfo order={order} />

          {/* Dates */}
          <OrderDates order={order} />

          {/* Order History */}
          <OrderTimeline timeline={orderTimeline} />

          {/* Service Details */}
          {order.service_type && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-xs text-muted-foreground">Service Type</p>
                  <p className="font-medium">{order.service_type}</p>
                </div>
                {order.special_instructions && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      Special Instructions
                    </p>
                    <p className="font-medium">{order.special_instructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <OrderWeighingCard
          status={order.status}
          weight={weight}
          setWeight={setWeight}
        />

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {availableActions.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-end">
              {availableActions.map((action) => (
                <Button
                  key={action}
                  onClick={() => handleAction(action)}
                  disabled={isLoading}
                  variant={action === "reject" ? "destructive" : "default"}
                >
                  {isLoading ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    ACTION_LABELS[action]
                  )}
                </Button>
              ))}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
