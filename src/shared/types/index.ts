// Auth Interfaces
export interface User {
  id: string;
  email: string;
  fullName: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: "OWNER" | "ADMIN" | "CUSTOMER" | "DRIVER";
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "ORDER" | "SYSTEM" | "PROMO" | string;
  audience?: "USER" | "ADMIN";
  category?: string;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  action_url?: string;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
  related_order?: string | null;
  campaign?: string | null;
  push_status?: string;
  delivered_at?: string | null;
  opened_at?: string | null;
  clicked_at?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "OWNER" | "CUSTOMER";
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Dashboard Interfaces
export interface DashboardStats {
  pending_count: number;
  confirmed_count: number;
  picked_up_count: number;
  in_process_count: number;
  out_for_delivery_count: number;
  delivered_count: number;
  total_orders: number;
  revenue_today?: number;
  revenue_this_month?: number;
  average_order_value?: number;
  most_popular_items?: Array<{ name: string; quantity: number }>;
  repeat_customer_rate?: number;
  pending_pickups?: number;
  pending_deliveries?: number;
  average_turnaround_time?: number;
}

export interface DashboardEarnings {
  today: number;
  this_week: number;
  this_month: number;
  total_revenue: number;
}

// Order Types & Interfaces
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "PICKED_UP"
  | "IN_PROCESS"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type MachineType = "WASHER" | "DRYER" | "IRONER" | "OTHER";

export type MachineStatus = "IDLE" | "BUSY" | "MAINTENANCE" | "OUT_OF_ORDER";

export interface OrderTimeline {
  id: string;
  order_id: string;
  status: OrderStatus;
  status_display: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  /** Backend returns 'name' (snapshot of item name at order time). */
  name: string;
  /** Legacy alias kept for any callers that used the old field name. */
  item_name?: string;
  quantity: number;
  /** Backend returns 'price' (unit price at order time). */
  price: number;
  /** Legacy alias kept for any callers that used the old field name. */
  unit_price?: number;
  item?: string | null;
  service_type?: string | null;
}

export interface Order {
  id: string;
  order_no: string;
  customer_name: string;
  customer_phone?: string;
  customer_address?: string;
  pickup_address?: string;
  delivery_address?: string;
  status: OrderStatus;
  status_display: string;
  payment_status?: "UNPAID" | "PAID" | "REFUNDED";
  total_amount: number;
  pickup_date: string;
  delivery_date: string;
  items?: OrderItem[];
  service_type?: string;
  special_instructions?: string;
  assigned_staff?: string;
  notes?: string;
  actual_weight?: number;
  estimated_weight?: number;
  order_timeline?: OrderTimeline[];
  rejection_reason?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Order[];
}

// Business Interfaces
export interface OperatingHour {
  id?: string;
  day: number;
  opening_time: string | null;
  closing_time: string | null;
  is_closed: boolean;
  is_overnight: boolean;
}

export interface Laundry {
  id: string;
  name: string;
  description: string;
  phone_number: string;
  address: string;
  city: string;
  latitude: string | number;
  longitude: string | number;
  image?: string | null;
  imageUrl?: string | null;
  cover_photo?: string | null;
  is_active: boolean;
  vacation_mode: boolean;
  pricing_model: "BY_ITEM" | "BY_WEIGHT" | "HYBRID";
  delivery_fee: number | string;
  pickup_fee: number | string;
  min_order: number | string;
  service_radius_km: number | string;
  price_range: "$" | "$$" | "$$$";
  estimated_delivery_hours: number;
  express_available?: boolean;
  express_delivery_hours?: number | null;
  express_surcharge_percent?: number | string | null;
  is_eco_friendly: boolean;
  ironing_available: boolean;
  operating_hours?: OperatingHour[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingItem {
  id: string;
  item_name: string;
  category: string;
  image?: string | null;
  imageUrl?: string | null;
  unit_price: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface WeightPricing {
  id: string;
  base_price_per_kg: string;
  minimum_charge: string;
  minimum_order_weight_kg: string | null;
  rounding_strategy: "NONE" | "UP_0_5_KG" | "UP_1_KG";
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessSettings {
  business_name: string;
  description: string;
  phone_number: string;
  address: string;
  email: string;
  bank_account?: string;
  bank_code?: string;
  is_active: boolean;
}

// Service Interfaces
export interface Service {
  id: string;
  name: string;
  wash_price: number;
  iron_price: number;
  dry_clean_price: number;
  is_active: boolean;
}

// Staff Interfaces
export type StaffRole = "LaundryStaff" | "Driver";

export interface StaffMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: StaffRole;
  phone_number?: string;
  is_active: boolean;
  current_status?: "Idle" | "In-Transit" | "At Shop";
  assigned_orders?: string[];
}

// Earnings Interfaces
export interface Transaction {
  id: string;
  order_id: string;
  order_no: string;
  customer_name: string;
  amount: number;
  status: "DELIVERED" | "COMPLETED";
  date: string;
}

export interface EarningsResponse {
  today: number;
  this_week: number;
  this_month: number;
  total_revenue: number;
  transactions?: Transaction[];
}

// Hours Interfaces
export interface BusinessHours {
  [day: string]: {
    open: string | null;
    close: string | null;
    is_closed: boolean;
  };
}

// Machine Interfaces
export interface Machine {
  id: string;
  name: string;
  machine_type: MachineType;
  typeDisplay: string;
  status: MachineStatus;
  statusDisplay: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// API Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  detail?: string;
  error?: string;
  [key: string]: any;
}
