import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      total_orders: 156,
      completed_orders: 142,
      pending_orders: 8,
      in_process_orders: 6,
      total_earnings: 2500000,
      earnings_today: 125000,
      earnings_this_week: 450000,
      average_completion_time: '2.5 days',
      customer_satisfaction: 4.8,
    })
  } catch (error: any) {
    console.error('Dashboard overview error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
