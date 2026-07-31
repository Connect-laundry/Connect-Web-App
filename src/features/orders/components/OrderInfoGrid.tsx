import { User, Phone, Calendar, FileText, MapPin } from "lucide-react";
import { formatDate } from "@/shared/lib/format";
import { Order } from "@/shared/interfaces";

export function OrderInfoGrids({ order }: { order: Order }) {
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