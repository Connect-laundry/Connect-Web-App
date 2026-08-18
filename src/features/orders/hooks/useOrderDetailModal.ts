import { useState, useEffect } from "react";
import { Order, OrderTimeline as OrderTimelineType } from "@/shared/types";
import {
    executeOrderAction,
    getAvailableActions,
    getOrderPriceBreakdown,
    getOrderTimeline,
} from "@/features/orders/api";
import { LIFECYCLE_STEPS, ACTION_LABELS } from "../data";

export function useOrderDetailModal(
    order: Order | null,
    onOrderUpdated?: (order: Order) => void,
    onOpenChange?: (open: boolean) => void
) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [weight, setWeight] = useState<string>("");
    const [orderTimeline, setOrderTimeline] = useState<OrderTimelineType[] | null>(null);
    const [priceBreakdown, setPriceBreakdown] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        let isMounted = true;
        if (order?.id) {
            Promise.resolve().then(() => {
                if (isMounted) setWeight(order.actual_weight?.toString() || "");
            });
            getOrderTimeline(order.id)
                .then((tl) => { if (isMounted) setOrderTimeline(tl); })
                .catch(() => { if (isMounted) setOrderTimeline(null); });
            getOrderPriceBreakdown(order.id)
                .then((pb) => { if (isMounted) setPriceBreakdown(pb); })
                .catch((pb) => { if (isMounted) setPriceBreakdown(pb); });
        }
        return () => {
            isMounted = false;
        };
    }, [order?.id, order?.actual_weight]);

    const availableActions = order ? getAvailableActions(order.status) : [];
    const currentStepIndex = order
        ? LIFECYCLE_STEPS.findIndex((s) => s.id === order.status)
        : -1;

    const handleAction = async (action: string) => {
        if (!order) return;
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const updatedOrder = await executeOrderAction(order.id, action, order, weight);
            const actionTitle = ACTION_LABELS[action] || action;
            setSuccessMessage(`${actionTitle} successfully processed`);
            setTimeout(() => {
                onOrderUpdated?.(updatedOrder);
                onOpenChange?.(false);
            }, 1200);
        } catch (err: any) {
            setError(err.message || "Failed to update order status");
        } finally {
            setIsLoading(false);
        }
    };

    const calculatedItemsTotal =
        order?.items?.reduce(
            (acc, it) => acc + Number(it.quantity) * Number(it.price ?? it.unit_price ?? 0),
            0
        ) || 0;
    const displayTotal =
        order && Number(order.total_amount) > 0
            ? Number(order.total_amount)
            : calculatedItemsTotal;

    return {
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
    };
}