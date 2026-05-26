import { apiGet, apiPatch } from "@/shared/api/client";
import { Order, OrderListResponse, OrderTimeline, OrderStatus } from "@/shared/types";

function parseLifecycleResponse(res: unknown, orderId: string): Order {
  const payload = res as { data?: { id?: string; status?: OrderStatus } };
  const data = payload?.data ?? (res as { id?: string; status?: OrderStatus });
  return {
    id: data?.id ?? orderId,
    status: (data?.status ?? "PENDING") as OrderStatus,
  } as Order;
}

async function lifecyclePatch(
  orderId: string,
  action: string,
  body?: Record<string, unknown>,
): Promise<Order> {
  const res = await apiPatch(`/booking/lifecycle/${orderId}/${action}/`, body);
  return parseLifecycleResponse(res, orderId);
}

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
  return lifecyclePatch(orderId, "accept");
}

/**
 * Reject an order
 */
export async function rejectOrder(
  orderId: string,
  reason?: string,
): Promise<Order> {
  return lifecyclePatch(orderId, "reject", reason ? { reason } : undefined);
}

/**
 * Mark order as picked up
 */
export async function markPickedUp(orderId: string): Promise<Order> {
  return lifecyclePatch(orderId, "mark-picked-up");
}

/**
 * Mark order as washed/in process
 */
export async function markWashed(
  orderId: string,
  weight?: string,
): Promise<Order> {
  return lifecyclePatch(
    orderId,
    "mark-washed",
    weight ? { metadata: { weight } } : undefined,
  );
}

/**
 * Mark order as out for delivery
 */
export async function markOutForDelivery(orderId: string): Promise<Order> {
  return lifecyclePatch(orderId, "mark-out-for-delivery");
}

/**
 * Mark order as delivered
 */
export async function markDelivered(orderId: string): Promise<Order> {
  return lifecyclePatch(orderId, "mark-delivered");
}

/**
 * Get order timeline
 * @param orderId - The ID of the order
 * @description Get order timeline for a specific order
 */
export async function getOrderTimeline(
  orderId: string,
): Promise<OrderTimeline[]> {
  const res = await apiGet<{
    data?: Array<{
      id: string;
      new_status: string;
      previous_status?: string;
      timestamp: string;
      changed_by_name?: string;
    }>;
  }>(`/booking/lifecycle/${orderId}/timeline/`);

  const items = Array.isArray(res?.data) ? res.data : [];
  return items.map((item) => ({
    id: item.id,
    order_id: orderId,
    status: item.new_status as OrderStatus,
    status_display: item.new_status.replace(/_/g, " "),
    created_at: item.timestamp,
  }));
}

/**
 * Mark order as completed
 */
export async function completeOrder(orderId: string): Promise<Order> {
  return lifecyclePatch(orderId, "complete");
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
  reason?: string,
): Promise<Order> {
  const actionMap: Record<
    string,
    (id: string, arg?: string) => Promise<Order>
  > = {
    accept: acceptOrder,
    reject: (id) => rejectOrder(id, reason),
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
