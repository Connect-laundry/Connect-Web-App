import { User, Phone, Calendar, FileText, MapPin } from "lucide-react";
import { formatDate } from "@/shared/lib/format";
import { Order } from "@/shared/types";

export const OrderInfoGrids = ({ order }: { order: Order }) => {
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

            {/* Handover Code Banner — shown when backend returns the code */}
            {order.handover_code && (
                <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Delivery Handover Code
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Customer reads this code aloud when receiving their clothes to confirm delivery.
                            </p>
                        </div>
                        <div className="flex items-center justify-center bg-primary text-primary-foreground font-black text-2xl tracking-[0.35em] px-6 py-3 rounded-xl min-w-[120px] shadow-lg shadow-primary/20 select-all">
                            {order.handover_code}
                        </div>
                    </div>
                </div>
            )}

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
        </>
    );
}