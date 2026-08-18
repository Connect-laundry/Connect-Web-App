import { DialogTitle } from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { STATUS_BADGE_STYLE } from "../data";
import { Order } from "@/shared/types";

export const OrderModalHeader = ({ order, displayTotal }: { order: Order; displayTotal: number }) => {
    return (
        <div className="px-6 py-5 pr-14 border-b border-border/40 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <div className="flex items-center gap-3 flex-wrap">
                    <DialogTitle className="text-xl font-black tracking-tight">
                        Order #{order.order_no}
                    </DialogTitle>
                    <Badge
                        variant="outline"
                        className={cn(
                            "px-3 py-0.5 font-bold text-xs uppercase tracking-wider rounded-full border",
                            STATUS_BADGE_STYLE[order.status] || "bg-gray-100 text-gray-800"
                        )}
                    >
                        {order.status_display}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                    Placed on {formatDate(order.created_at || new Date().toISOString())}
                </p>
            </div>
            <div className="text-left sm:text-right">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Order Total
                </span>
                <span className="text-2xl font-black text-primary tracking-tight">
                    {formatCurrency(displayTotal)}
                </span>
            </div>
        </div>
    );
}