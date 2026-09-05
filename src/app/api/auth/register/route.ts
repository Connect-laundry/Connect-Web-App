import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connect-full-backend-production.onrender.com/api/v1'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // DEBUG: log what we're sending to the backend
    console.log('[register] sending to backend:', JSON.stringify(body))
    console.log('[register] hitting URL:', `${BACKEND_URL}/auth/register/`)

    const res = await fetch(`${BACKEND_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    // DEBUG: log what the backend returned
    console.log('[register] backend status:', res.status)
    console.log('[register] backend response:', JSON.stringify(data))

    if (!res.ok) {
      // Pass the backend's validation errors straight through (status + body).
      return NextResponse.json(data, { status: res.status })
    }

    // The register endpoint already returns tokens, so we set the session cookies
    // here directly — no separate login round-trip needed.
    const accessToken = data.data?.accessToken || data.accessToken || data.access
    const refreshToken = data.data?.refreshToken || data.refreshToken || data.refresh
    const user = data.data?.user || data.user

    if (accessToken && refreshToken) {
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

    // Return user only; tokens stay in HttpOnly cookies (never in the JSON body).
    return NextResponse.json({
      status: 'success',
      user: user || null,
    })
  } catch (error: any) {
    console.error('[register] caught error:', error.message)
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    )
  }
}