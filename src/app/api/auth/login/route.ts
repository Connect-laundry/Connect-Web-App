import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connect-full-backend.onrender.com/api/v1'

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

    if (data.access && data.refresh) {
      // Set HttpOnly cookies
      const cookieStore = await cookies()
      
      cookieStore.set('access_token', data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        // Usually, access tokens expire quickly (e.g., 15m to 1h)
        maxAge: 60 * 60 * 24, // 1 day as a fallback
      })

      cookieStore.set('refresh_token', data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    // Return the user data to the client, but DO NOT return the tokens
    const clientData = { ...data }
    delete clientData.access
    delete clientData.refresh

    return NextResponse.json(clientData)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    )
  }
}
