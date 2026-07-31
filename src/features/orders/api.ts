import { apiGet, apiPatch } from "@/shared/api/client";
import { unwrap } from "@/shared/api/unwrap";
import { Order, OrderListResponse, OrderTimeline } from "@/shared/interfaces";
import { getDashboardOrders } from "@/features/dashboard/api";

/**
 * Get all orders for the owner (same source as the dashboard orders list).
 */
export async function getOrders(params?: {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
}): Promise<OrderListResponse> {
  return getDashboardOrders(params);
}

/**
 * Get a single order by ID from the owner dashboard orders endpoint.
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const response = await apiGet<any>(`/laundries/dashboard/orders/${orderId}/`);
  return unwrap<Order>(response);
}

async function lifecycleAction(
  orderId: string,
  action: string,
  body?: Record<string, unknown>,
): Promise<Partial<Order>> {
  const response = await apiPatch<any>(
    `/booking/lifecycle/${orderId}/${action}/`,
    body,
  );
  return unwrap<Partial<Order>>(response);
}

export async function acceptOrder(orderId: string): Promise<Partial<Order>> {
  return lifecycleAction(orderId, "accept");
}

export async function rejectOrder(
  orderId: string,
  reason?: string,
): Promise<Partial<Order>> {
  return lifecycleAction(orderId, "reject", reason ? { reason } : undefined);
}

export async function markPickedUp(orderId: string): Promise<Partial<Order>> {
  return lifecycleAction(orderId, "mark-picked-up");
}

export async function markWashed(
  orderId: string,
  weight?: string,
): Promise<Partial<Order>> {
  return lifecycleAction(orderId, "mark-washed", weight ? { weight } : undefined);
}

export async function markOutForDelivery(
  orderId: string,
): Promise<Partial<Order>> {
  return lifecycleAction(orderId, "mark-out-for-delivery");
}

export async function markDelivered(orderId: string): Promise<Partial<Order>> {
  return lifecycleAction(orderId, "mark-delivered");
}

export const getOrderTimeline = async (orderId: string) => {
  const response = await apiGet<any>(`/booking/lifecycle/${orderId}/timeline/`);
  return unwrap<OrderTimeline[]>(response);
};

export async function completeOrder(orderId: string): Promise<Partial<Order>> {
  return lifecycleAction(orderId, "complete");
}

export async function cancelOrder(orderId: string, reason?: string): Promise<Partial<Order>> {
  return lifecycleAction(orderId, "cancel", reason ? { reason } : undefined);
}

export async function getOrderPriceBreakdown(orderId: string) {
  const response = await apiGet<any>(`/booking/${orderId}/price-breakdown/`);
  return unwrap<Record<string, unknown>>(response);
}

export function getAvailableActions(status: string): string[] {
  const actions: Record<string, string[]> = {
    PENDING: ["accept", "reject", "cancel"],
    CONFIRMED: ["markPickedUp", "cancel"],
    PICKED_UP: ["markWashed"],
    IN_PROCESS: ["markOutForDelivery"],
    OUT_FOR_DELIVERY: ["markDelivered"],
    DELIVERED: ["complete"],
    COMPLETED: [],
    REJECTED: [],
    CANCELLED: [],
  };

  return actions[status] || [];
}

const STATUS_DISPLAY: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
  PICKED_UP: "Picked Up",
  IN_PROCESS: "In Process",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export async function executeOrderAction(
  orderId: string,
  action: string,
  existingOrder: Order,
  weight?: string,
  reason?: string,
): Promise<Order> {
  const actionMap: Record<
    string,
    (id: string, weight?: string) => Promise<Partial<Order>>
  > = {
    accept: acceptOrder,
    reject: (id) => rejectOrder(id, reason),
    markPickedUp,
    markWashed,
    markOutForDelivery,
    markDelivered,
    complete: completeOrder,
    cancel: (id) => cancelOrder(id, reason),
  };

  const actionFn = actionMap[action];
  if (!actionFn) {
    throw new Error(`Unknown action: ${action}`);
  }

  const patch = await actionFn(orderId, weight);
  const status = patch.status ?? existingOrder.status;
  return {
    ...existingOrder,
    ...patch,
    status,
    status_display: STATUS_DISPLAY[status] ?? existingOrder.status_display,
  };
}
