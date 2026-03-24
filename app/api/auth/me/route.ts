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

    // In a real app, you'd validate the JWT token
    // For now, return mock user data
    const mockUser = {
      id: 1,
      email: 'owner@laundry.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'OWNER',
      business_name: 'Clean Fresh Laundry',
      phone_number: '+2348012345678',
    }

    return NextResponse.json(mockUser)
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
