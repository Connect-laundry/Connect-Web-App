import { User, Phone, Calendar, FileText, MapPin, Banknote } from "lucide-react";
import { formatDate } from "@/shared/lib/format";
import { Order } from "@/shared/types";

export const OrderInfoGrids = ({ order }: { order: Order }) => {
    const isCod = order.payment_method === 'CASH' || order.payment_method === 'CASH_ON_DELIVERY';
    const isPaid = order.payment_status === 'PAID';

    return (
        <>
            {/* Customer & Schedule Grid */}
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
                                <a
                                    href={`tel:${order.customer_phone}`}
                                    className="font-semibold text-primary hover:underline"
                                >
                                    {order.customer_phone}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Schedule &amp; Dates</span>
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

            {/* The handover code is the customer's secret: the backend never sends it to
                owners (OrderHandoverCodeCard collects it from the customer instead). */}

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
                        <span>Pickup &amp; Delivery</span>
                    </div>
                    <div className="space-y-3 text-xs">
                        <div>
                            <span className="text-muted-foreground font-medium block mb-0.5">📦 Pickup Address</span>
                            <span className="font-medium text-foreground">
                                {order.pickup_address || order.customer_address || "—"}
                            </span>
                        </div>
                        {order.delivery_address && order.delivery_address !== order.pickup_address && (
                            <div>
                                <span className="text-muted-foreground font-medium block mb-0.5">🚚 Delivery Address</span>
                                <span className="font-medium text-foreground">{order.delivery_address}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="p-4 rounded-xl border border-border/40 bg-card shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/30">
                    <Banknote className="w-4 h-4 text-primary" />
                    <span>Payment Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <span className="text-muted-foreground font-medium block">Payment Method</span>
                        <span className="font-bold text-foreground">
                            {isCod ? 'Cash on Delivery (COD)' : 'Card / Mobile Money'}
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground font-medium block">Payment Status</span>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            isPaid
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : isCod
                                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                    : 'bg-blue-500/10 text-blue-600'
                        }`}>
                            {isPaid
                                ? (isCod ? 'Paid in Cash' : 'Paid Online')
                                : (isCod ? 'Cash Due on Delivery' : 'Unpaid')}
                        </span>
                    </div>
                </div>
                {isCod && !isPaid && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium">
                        Please collect <strong className="font-bold">GH₵{Number(order.total_amount).toFixed(2)}</strong> in cash upon delivery, then click &ldquo;Confirm Cash Received&rdquo;.
                    </div>
                )}
                {isCod && isPaid && order.cash_collected_at && (
                    <p className="text-[11px] text-muted-foreground">
                        Cash collected on {formatDate(order.cash_collected_at)}
                    </p>
                )}
            </div>
        </>
    );
}