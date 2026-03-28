// Auth Types
export interface User {
  id: string
  email: string
  fullName: string
  first_name?: string
  last_name?: string
  role: 'OWNER' | 'ADMIN' | 'CUSTOMER' | 'DRIVER'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  phone: string
  role: 'OWNER' | 'CUSTOMER'
}

export interface AuthTokens {
  access: string
  refresh: string
}

// Dashboard Types
export interface DashboardStats {
  pending_count: number
  confirmed_count: number
  picked_up_count: number
  delivered_count: number
  total_orders: number
}

export interface DashboardEarnings {
  today: number
  this_week: number
  this_month: number
  total_revenue: number
}

// Order Types
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'PICKED_UP'
  | 'IN_PROCESS'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface Order {
  id: string
  order_no: string
  customer_name: string
  customer_phone?: string
  customer_address?: string
  status: OrderStatus
  status_display: string
  total_amount: number
  pickup_date: string
  delivery_date: string
  items?: OrderItem[]
  service_type?: string
  special_instructions?: string
  assigned_staff?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  item_name: string
  quantity: number
  unit_price: number
  service: string
}

export interface OrderListResponse {
  count: number
  next?: string
  previous?: string
  results: Order[]
}

// Business Types
export interface Laundry {
  id: string
  name: string
  description: string
  phone_number: string
  address: string
  image?: string
  cover_photo?: string
  is_active: boolean
  delivery_fee: number
  min_order: number
  price_range: '$' | '$$' | '$$$'
  owner_id: string
  created_at: string
  updated_at: string
}

export interface BusinessSettings {
  business_name: string
  description: string
  phone_number: string
  address: string
  email: string
  bank_account?: string
  bank_code?: string
  is_active: boolean
}

// Service Types
export interface Service {
  id: string
  name: string
  wash_price: number
  iron_price: number
  dry_clean_price: number
  is_active: boolean
}

// Staff Types
export type StaffRole = 'LaundryStaff' | 'Driver'

export interface StaffMember {
  id: string
  email: string
  first_name: string
  last_name: string
  role: StaffRole
  phone_number?: string
  is_active: boolean
  current_status?: 'Idle' | 'In-Transit' | 'At Shop'
  assigned_orders?: string[]
}

// Earnings Types
export interface Transaction {
  id: string
  order_id: string
  order_no: string
  customer_name: string
  amount: number
  status: 'DELIVERED' | 'COMPLETED'
  date: string
}

export interface EarningsResponse {
  today: number
  this_week: number
  this_month: number
  total_revenue: number
  transactions?: Transaction[]
}

// Hours Types
export interface BusinessHours {
  [day: string]: {
    open: string | null
    close: string | null
    is_closed: boolean
  }
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// API Error response
export interface ApiError {
  detail?: string
  error?: string
  [key: string]: any
}
