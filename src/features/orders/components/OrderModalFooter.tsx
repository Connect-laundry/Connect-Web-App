import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { DialogFooter } from "@/shared/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Banknote, User } from "lucide-react";
import { ACTION_LABELS } from "../data";
import { OrderModalFooterProps } from "../interfaces";


export function OrderModalFooter({
    orderId,
    onClose,
    availableActions,
    isLoading,
    onAction,
    canCollectCash,
    cashAmount,
    onCollectCash,
}: OrderModalFooterProps) {
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
                    <Link href={"/staff?orderId=" + orderId + "&assign=1"}>
                        <User className="w-3.5 h-3.5" />
                        Assign Driver
                    </Link>
                </Button>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
                {canCollectCash && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={isLoading} variant="secondary" className="font-bold text-xs h-10">
                                <Banknote className="w-4 h-4 mr-2" />
                                Confirm cash received
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm cash received?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Confirm that GHS {cashAmount.toFixed(2)} was received from the customer.
                                    This marks the order paid and records the collection time.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                                <AlertDialogAction disabled={isLoading} onClick={onCollectCash}>
                                    {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                                    Confirm collection
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

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
        </DialogFooter>
    );
}
