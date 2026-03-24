import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { detail: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Mock user database
    const mockUsers: Record<string, { password: string; user: any }> = {
      'owner@laundry.com': {
        password: 'password123',
        user: {
          id: 1,
          email: 'owner@laundry.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'OWNER',
          business_name: 'Clean Fresh Laundry',
          phone_number: '+2348012345678',
        },
      },
      'test@laundry.com': {
        password: 'test123456',
        user: {
          id: 2,
          email: 'test@laundry.com',
          first_name: 'Jane',
          last_name: 'Smith',
          role: 'OWNER',
          business_name: 'Premium Wash Services',
          phone_number: '+2348087654321',
        },
      },
    }

    const userRecord = mockUsers[email]

    if (!userRecord || userRecord.password !== password) {
      return NextResponse.json(
        { detail: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate mock JWT tokens
    const accessToken = Buffer.from(
      JSON.stringify({
        sub: userRecord.user.id,
        email: userRecord.user.email,
        role: userRecord.user.role,
        exp: Date.now() + 86400000, // 24 hours
      })
    ).toString('base64')

    const refreshToken = Buffer.from(
      JSON.stringify({
        sub: userRecord.user.id,
        type: 'refresh',
        exp: Date.now() + 604800000, // 7 days
      })
    ).toString('base64')

    return NextResponse.json({
      access: accessToken,
      refresh: refreshToken,
      user: userRecord.user,
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
