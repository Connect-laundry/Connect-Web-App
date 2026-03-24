import { NextRequest, NextResponse } from 'next/server'

const mockOrders = [
  {
    id: 1,
    order_no: 'ORD-2024-001',
    customer_name: 'Chioma Okafor',
    customer_email: 'chioma@example.com',
    customer_phone: '+2348012345678',
    status: 'COMPLETED',
    status_display: 'Completed',
    pickup_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    delivery_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    total_amount: 15000,
    items: 5,
  },
  {
    id: 2,
    order_no: 'ORD-2024-002',
    customer_name: 'Uche Kalu',
    customer_email: 'uche@example.com',
    customer_phone: '+2348087654321',
    status: 'OUT_FOR_DELIVERY',
    status_display: 'Out for Delivery',
    pickup_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    delivery_date: new Date().toISOString(),
    total_amount: 22500,
    items: 8,
  },
  {
    id: 3,
    order_no: 'ORD-2024-003',
    customer_name: 'Amara Eze',
    customer_email: 'amara@example.com',
    customer_phone: '+2349012345678',
    status: 'IN_PROCESS',
    status_display: 'In Process',
    pickup_date: new Date().toISOString(),
    delivery_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    total_amount: 18750,
    items: 6,
  },
  {
    id: 4,
    order_no: 'ORD-2024-004',
    customer_name: 'Kwame Mensah',
    customer_email: 'kwame@example.com',
    customer_phone: '+2349876543210',
    status: 'PICKED_UP',
    status_display: 'Picked Up',
    pickup_date: new Date().toISOString(),
    delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    total_amount: 25000,
    items: 9,
  },
  {
    id: 5,
    order_no: 'ORD-2024-005',
    customer_name: 'Zainab Hassan',
    customer_email: 'zainab@example.com',
    customer_phone: '+2349123456789',
    status: 'CONFIRMED',
    status_display: 'Confirmed',
    pickup_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    total_amount: 12500,
    items: 4,
  },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')

    let filtered = mockOrders

    if (status) {
      filtered = filtered.filter((order) => order.status === status)
    }

    const start = (page - 1) * limit
    const end = start + limit
    const results = filtered.slice(start, end)

    return NextResponse.json({
      count: filtered.length,
      next: end < filtered.length ? `/api/dashboard/orders?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `/api/dashboard/orders?page=${page - 1}&limit=${limit}` : null,
      results,
    })
  } catch (error: any) {
    console.error('Orders error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
