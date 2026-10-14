"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import {
  Calculator,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Order } from "@/shared/types";
import { submitOrderQuote, QuoteItemInput } from "../api";

interface OrderQuoteCardProps {
  order: Order;
  onOrderUpdated?: (order: Order) => void;
}

export const OrderQuoteCard: React.FC<OrderQuoteCardProps> = ({
  order,
  onOrderUpdated,
}) => {
  const isCustomQuote = order.pricing_mode === "CUSTOM_QUOTE";
  const isAwaitingQuote =
    isCustomQuote &&
    (!order.priced_at ||
      order.payment_state === "AWAITING_QUOTE" ||
      !order.items ||
      order.items.length === 0);

  const [items, setItems] = useState<QuoteItemInput[]>([
    { name: "", quantity: 1, price: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isCustomQuote) {
    return null;
  }

  const handleAddItem = () => {
    setItems((prev) => [...prev, { name: "", quantity: 1, price: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof QuoteItemInput,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [field]: value };
      }),
    );
  };

  const subtotal = items.reduce((acc, item) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const p = Math.max(0, Number(item.price) || 0);
    return acc + qty * p;
  }, 0);

  const canSubmit =
    items.length > 0 &&
    items.every(
      (it) => it.name.trim().length > 0 && Number(it.price) > 0 && Number(it.quantity) > 0,
    );

  const handleSubmitQuote = async () => {
    if (!canSubmit) {
      setError("Please provide a name and valid price for all items.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await submitOrderQuote(order.id, items);
      setSuccess("Quotation sent to customer successfully! Customer notified to review & pay.");
      if (onOrderUpdated && updated) {
        onOrderUpdated({
          ...order,
          ...updated,
          priced_at: new Date().toISOString(),
          payment_state:
            order.payment_method === "CASH" ? "CASH_DUE" : "ONLINE_REQUIRED",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Failed to submit quotation. Please check item prices and try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Case A: Quote has already been priced
  if (!isAwaitingQuote) {
    const isPaid = order.payment_status === "PAID";
    const isCod = order.payment_method === "CASH" || order.payment_method === "CASH_ON_DELIVERY";

    return (
      <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-xs">
        <CardHeader className="pb-3 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Quotation Submitted to Customer</span>
            </CardTitle>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isPaid
                  ? "bg-emerald-500/20 text-emerald-700"
                  : isCod
                    ? "bg-amber-500/20 text-amber-700"
                    : "bg-blue-500/20 text-blue-700"
              }`}
            >
              {isPaid
                ? "Paid"
                : isCod
                  ? "Cash on Delivery"
                  : "Awaiting Customer Payment"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="text-xs text-muted-foreground">
            {isPaid ? (
              <p className="font-medium text-emerald-700 dark:text-emerald-300">
                ✓ Customer approved and paid this invoice online via Paystack.
              </p>
            ) : isCod ? (
              <p className="font-medium text-amber-700 dark:text-amber-300">
                ✓ Quotation approved for Cash on Delivery. Collect cash when delivering clean laundry.
              </p>
            ) : (
              <p className="font-medium text-blue-700 dark:text-blue-300">
                • Digital invoice sent to the customer app. The customer can review, approve, and complete payment.
              </p>
            )}
          </div>

          {order.items && order.items.length > 0 && (
            <div className="rounded-lg border border-border/30 bg-card p-3 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border/20">
                Quoted Item Lines
              </div>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs py-1 border-b border-border/10 last:border-none"
                >
                  <span className="font-medium text-foreground">
                    {item.name}{" "}
                    <span className="text-muted-foreground font-normal">
                      x{item.quantity}
                    </span>
                  </span>
                  <span className="font-bold text-foreground">
                    GH₵{(Number(item.price ?? item.unit_price ?? 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Case B: Awaiting Quotation from Owner
  return (
    <Card className="border-amber-500/40 bg-amber-500/5 shadow-xs">
      <CardHeader className="pb-3 border-b border-amber-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>Pay After Pickup — Customer Quotation</span>
          </CardTitle>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300">
            Quote Required
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {order.special_instructions && (
          <div className="p-3 rounded-lg bg-background border border-amber-500/20 text-xs">
            <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
              <FileText className="w-3.5 h-3.5" />
              Customer Notes &amp; Bag Count:
            </div>
            <p className="font-medium text-foreground">
              {order.special_instructions}
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Examine, count, or weigh the customer&apos;s laundry items at the shop. Enter the priced items below to generate the invoice and send it to the customer&apos;s phone.
        </p>

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-xs font-semibold">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 py-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <AlertDescription className="text-xs font-semibold">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Item Rows */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
            <div className="col-span-6">Item / Service Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-3 text-right">Price (GH₵)</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <Input
                  type="text"
                  placeholder="e.g. 5 Shirts (Wash & Iron)"
                  value={item.name}
                  onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                  className="h-9 text-xs bg-background"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(idx, "quantity", e.target.value)
                  }
                  className="h-9 text-xs text-center bg-background"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(idx, "price", e.target.value)
                  }
                  className="h-9 text-xs text-right bg-background font-bold"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(idx)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="w-full text-xs h-8 border-dashed border-amber-500/40 hover:bg-amber-500/10"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Another Item Line
          </Button>
        </div>

        {/* Subtotal Preview */}
        <div className="pt-3 border-t border-amber-500/20 flex justify-between items-center text-sm">
          <span className="font-bold text-muted-foreground">Items Total:</span>
          <span className="font-extrabold text-lg text-foreground">
            GH₵{subtotal.toFixed(2)}
          </span>
        </div>

        <Button
          type="button"
          onClick={handleSubmitQuote}
          disabled={!canSubmit || isSubmitting}
          className="w-full h-10 font-bold bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSubmitting ? (
            "Sending Quotation..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Quotation to Customer (GH₵{subtotal.toFixed(2)})
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
