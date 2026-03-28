import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connect-full-backend.onrender.com/api/v1'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token available' }, { status: 401 })
    }

    const res = await fetch(`${BACKEND_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    const data = await res.json()

    if (!res.ok) {
      // Clear invalid tokens
      cookieStore.delete('access_token')
      cookieStore.delete('refresh_token')
      return NextResponse.json(data, { status: res.status })
    }

    if (data.access) {
      cookieStore.set('access_token', data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })
    }
    
    // Some backends rotate refresh tokens as well
    if (data.refresh) {
      cookieStore.set('refresh_token', data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    )
  }
}
