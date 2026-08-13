import { User, Phone, Calendar, FileText, MapPin, Banknote } from "lucide-react";
import { formatDate } from "@/shared/lib/format";
import { Order } from "@/shared/interfaces";

export function OrderInfoGrids({ order }: { order: Order }) {
    const isCash = order.payment_method === 'CASH';
    const paymentMethodLabel = isCash
        ? 'Cash on Delivery'
        : order.payment_method === 'BANK_TRANSFER'
          ? 'Bank Transfer'
          : 'Paystack';
    const displayedAmount = isCash
        ? Number(
            order.payment_status === 'PAID'
                ? (order.amount_collected ?? order.total_amount)
                : (order.amount_due ?? order.total_amount)
          )
        : Number(order.total_amount);

    return (
        <>
            {/* Customer & Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
                        <User className="w-4 h-4 text-primary" />
                        <span>Customer Information</span>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div>
                            <span className="text-muted-foreground font-medium block">Name</span>
                            <span className="font-bold text-sm text-foreground">{order.customer_name}</span>
                        </div>
                        {order.customer_phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="font-semibold">{order.customer_phone}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Schedule & Dates</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-muted-foreground font-medium block">Pickup Window</span>
                            <span className="font-bold">
                                {order.pickup_date ? formatDate(order.pickup_date) : "N/A"}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-medium block">Target Delivery</span>
                            <span className="font-bold">
                                {order.delivery_date ? formatDate(order.delivery_date) : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
                    <Banknote className="w-4 h-4 text-primary" />
                    <span>Payment</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                        <span className="text-muted-foreground font-medium block">Method</span>
                        <span className="font-bold">
                            {paymentMethodLabel}
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground font-medium block">Status</span>
                        <span className="font-bold">
                            {order.payment_state === "CASH_COLLECTED" ? "Paid in cash" :
                             order.payment_state === "CASH_DUE" ? "Cash due" :
                             order.payment_status || "Unpaid"}
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground font-medium block">
                            {isCash ? (order.payment_status === "PAID" ? "Collected" : "Due") : "Order Total"}
                        </span>
                        <span className="font-bold">
                            GHS {displayedAmount.toFixed(2)}
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground font-medium block">{isCash ? "Collected At" : "Provider"}</span>
                        <span className="font-bold">
                            {isCash
                                ? (order.cash_collected_at ? formatDate(order.cash_collected_at) : 'Not collected')
                                : paymentMethodLabel}
                        </span>
                    </div>
                </div>
            </div>
            {/* Service Details & Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
                        <FileText className="w-4 h-4 text-primary" />
                        <span>Service Details</span>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div>
                            <span className="text-muted-foreground font-medium block">Service Type</span>
                            <span className="font-bold">{order.service_type || "Standard Laundry"}</span>
                        </div>
                        {order.special_instructions && (
                            <div>
                                <span className="text-muted-foreground font-medium block">Instructions</span>
                                <p className="font-medium bg-muted/30 p-2 rounded-md border border-border/30 mt-1">
                                    {order.special_instructions}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Pickup & Delivery Address</span>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div>
                            <span className="text-muted-foreground font-medium block">Address</span>
                            <span className="font-medium text-foreground">
                                {order.customer_address || order.pickup_address || "Standard Address"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}