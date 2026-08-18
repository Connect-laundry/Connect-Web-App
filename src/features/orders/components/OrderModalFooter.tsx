import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { DialogFooter } from "@/shared/ui/dialog";
import { User } from "lucide-react";
import { ACTION_LABELS } from "../data";
import { OrderModalFooterProps } from "../types";


export const OrderModalFooter = ({ orderId, onClose, availableActions, isLoading, onAction }: OrderModalFooterProps) => {
    return (
        <DialogFooter className="px-6 py-4 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row gap-2 justify-between items-center">
            <div className="flex gap-2 items-center">
                <Button variant="outline" onClick={onClose} className="font-semibold text-xs h-10 px-5">
                    Close
                </Button>
                <Button
                    asChild
                    variant="secondary"
                    className="font-bold text-xs h-10 gap-1.5 border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                >
                    <Link href={`/staff?orderId=${orderId}&assign=1`}>
                        <User className="w-3.5 h-3.5" />
                        Assign Driver
                    </Link>
                </Button>
            </div>

            {availableActions.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-end">
                    {availableActions.map((action) => (
                        <Button
                            key={action}
                            onClick={() => onAction(action)}
                            disabled={isLoading}
                            variant={action === "reject" || action === "cancel" ? "destructive" : "default"}
                            className="font-bold text-xs h-10 shadow-sm"
                        >
                            {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : ACTION_LABELS[action] || action}
                        </Button>
                    ))}
                </div>
            )}
        </DialogFooter>
    );
}