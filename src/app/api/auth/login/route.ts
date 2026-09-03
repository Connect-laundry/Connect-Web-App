import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connect-full-backend-production.onrender.com/api/v1'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await fetch(`${BACKEND_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    // The backend provides tokens either directly or wrapped in a 'data' object
    const accessToken = data.data?.accessToken || data.access
    const refreshToken = data.data?.refreshToken || data.refresh
    const user = data.data?.user || data.user

    if (accessToken && refreshToken) {
      // Set HttpOnly cookies
      const cookieStore = await cookies()
      
      cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })

      cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    // Return the user data to the client, but DO NOT return the sensitive tokens in JSON body
    // This forces the frontend to rely on the HttpOnly cookies for security.
    return NextResponse.json({
      status: 'success',
      user: user || null
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    )
  }
}
