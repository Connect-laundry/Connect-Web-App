import { apiGet, apiPost } from "@/shared/api/client";
import { Order, OrderListResponse, OrderTimeline } from "@/shared/types";

/**
 * Get all orders for the owner
 */
export async function getOrders(params?: {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
}): Promise<OrderListResponse> {
  const queryString = new URLSearchParams();

  if (params?.limit) queryString.append("limit", params.limit.toString());
  if (params?.offset) queryString.append("offset", params.offset.toString());
  if (params?.status) queryString.append("status", params.status);
  if (params?.search) queryString.append("search", params.search);

  const query = queryString.toString();
  const endpoint = `/booking/bookings/${query ? "?" + query : ""}`;

  return apiGet<OrderListResponse>(endpoint);
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order> {
  return apiGet<Order>(`/booking/bookings/${orderId}/`);
}

/**
 * Accept an order
 */
export async function acceptOrder(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/accept/`);
}

/**
 * Reject an order
 */
export async function rejectOrder(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/reject/`);
}

/**
 * Mark order as picked up
 */
export async function markPickedUp(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/mark-picked-up/`);
}

/**
 * Mark order as washed/in process
 */
export async function markWashed(
  orderId: string,
  weight?: string,
): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/mark-washed/`, {
    weight,
  });
}

/**
 * Mark order as out for delivery
 */
export async function markOutForDelivery(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/mark-out-for-delivery/`);
}

/**
 * Mark order as delivered
 */
export async function markDelivered(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/mark-delivered/`);
}

/**
 * Get order timeline
 * @param orderId - The ID of the order
 * @description Get order timeline for a specific order
 */
export const getOrderTimeline = (orderId: string) => {
  return apiGet<OrderTimeline[]>(`/booking/lifecycle/${orderId}/timeline/`);
};

/**
 * Mark order as completed
 */
export async function completeOrder(orderId: string): Promise<Order> {
  return apiPost<Order>(`/booking/lifecycle/${orderId}/complete/`);
}

/**
 * Get available actions for an order based on its current status
 */
export function getAvailableActions(status: string): string[] {
  const actions: Record<string, string[]> = {
    PENDING: ["accept", "reject"],
    CONFIRMED: ["markPickedUp"],
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

/**
 * Execute an order action
 * @param orderId - The ID of the order
 * @param action - The action to perform
 * @param weight - The weight of the order entered by owner (optional)
 */
export async function executeOrderAction(
  orderId: string,
  action: string,
  weight?: string,
): Promise<Order> {
  const actionMap: Record<
    string,
    (id: string, weight?: string) => Promise<Order>
  > = {
    accept: acceptOrder,
    reject: rejectOrder,
    markPickedUp,
    markWashed,
    markOutForDelivery,
    markDelivered,
    complete: completeOrder,
  };

  const actionFn = actionMap[action];
  if (!actionFn) {
    throw new Error(`Unknown action: ${action}`);
  }

  return actionFn(orderId, weight);
}
