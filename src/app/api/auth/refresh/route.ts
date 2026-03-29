import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connect-full-backend.onrender.com/api/v1'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const currentRefreshToken = cookieStore.get('refresh_token')?.value

    if (!currentRefreshToken) {
      return NextResponse.json({ error: 'No refresh token available' }, { status: 401 })
    }

    const res = await fetch(`${BACKEND_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: currentRefreshToken }),
    })

    const rawData = await res.json()
    const data = rawData.data || rawData

    if (!res.ok) {
      // Clear invalid tokens
      cookieStore.delete('access_token')
      cookieStore.delete('refresh_token')
      return NextResponse.json(rawData, { status: res.status })
    }

    const accessToken = data.accessToken || data.access
    const newRefreshToken = data.refreshToken || data.refresh

    if (accessToken) {
      cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })
    }
    
    // Some backends rotate refresh tokens as well
    if (newRefreshToken) {
      cookieStore.set('refresh_token', newRefreshToken, {
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
