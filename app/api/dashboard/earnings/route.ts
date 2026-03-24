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
      today: 125000,
      this_week: 450000,
      this_month: 1850000,
      total_revenue: 2500000,
      total_transactions: 142,
    })
  } catch (error: any) {
    console.error('Earnings error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
