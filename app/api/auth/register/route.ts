import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, first_name, last_name, phone_number } = body

    // Validation
    if (!email || !password || !first_name || !last_name || !phone_number) {
      return NextResponse.json(
        { detail: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { detail: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // In a real app, you'd check if user exists in database
    // For now, we accept any new registration
    const userId = Math.floor(Math.random() * 10000) + 100

    const user = {
      id: userId,
      email,
      first_name,
      last_name,
      phone_number,
      role: 'OWNER',
      business_name: `${first_name}'s Laundry`,
    }

    // Generate mock JWT tokens
    const accessToken = Buffer.from(
      JSON.stringify({
        sub: userId,
        email,
        role: 'OWNER',
        exp: Date.now() + 86400000, // 24 hours
      })
    ).toString('base64')

    const refreshToken = Buffer.from(
      JSON.stringify({
        sub: userId,
        type: 'refresh',
        exp: Date.now() + 604800000, // 7 days
      })
    ).toString('base64')

    return NextResponse.json(
      {
        access: accessToken,
        refresh: refreshToken,
        user,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
