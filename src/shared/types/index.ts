// Auth Types
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
  type: string;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
  related_order?: string | null;
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

// Dashboard Types
export interface DashboardStats {
  pending_count: number;
  confirmed_count: number;
  picked_up_count: number;
  delivered_count: number;
  total_orders: number;
}

export interface DashboardEarnings {
  today: number;
  this_week: number;
  this_month: number;
  total_revenue: number;
}

// Order Types
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

export interface Order {
  id: string;
  order_no: string;
  customer_name: string;
  customer_phone?: string;
  customer_address?: string;
  status: OrderStatus;
  status_display: string;
  total_amount: number;
  pickup_date: string;
  delivery_date: string;
  items?: OrderItem[];
  service_type?: string;
  special_instructions?: string;
  assigned_staff?: string;
  notes?: string;
  actual_weight?: number; // actual weight of the order (entered by laundry owner)
  estimated_weight?: number; // provided by customer at the start of the order
  order_timeline?: OrderTimeline[]; // hisotory of all status changes
  rejection_reason?: string; // why order was rejected (if applicable)
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  service: string;
}

export interface OrderListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Order[];
}

// Business Types
export interface Laundry {
  id: string;
  name: string;
  description: string;
  phone_number: string;
  address: string;
  image?: string;
  cover_photo?: string;
  is_active: boolean;
  delivery_fee: number;
  min_order: number;
  price_range: "$" | "$$" | "$$$";
  status: "PENDING" | "APPROVED" | "REJECTED";
  owner_id: string;
  created_at: string;
  updated_at: string;
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

// Service Types
export interface Service {
  id: string;
  name: string;
  wash_price: number;
  iron_price: number;
  dry_clean_price: number;
  is_active: boolean;
}

// Staff Types
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

// Earnings Types
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

// Hours Types
export interface BusinessHours {
  [day: string]: {
    open: string | null;
    close: string | null;
    is_closed: boolean;
  };
}

// Machine Types
export interface Machine {
  id: string;
  name: string;
  machine_type: MachineType;
  typeDisplay: string; // human readable type ("Washinh")
  status: MachineStatus;
  statusDisplay: string; // human readable status ("Idle")
  notes?: string; // any note about the machine
  created_at: string;
  updated_at: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Error response
export interface ApiError {
  detail?: string;
  error?: string;
  [key: string]: any;
}
