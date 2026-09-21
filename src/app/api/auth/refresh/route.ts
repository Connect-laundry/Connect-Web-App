import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { resolveBackendBaseUrl } from '@/shared/lib/backend-url'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const currentRefreshToken = cookieStore.get('refresh_token')?.value
    const backendUrl = resolveBackendBaseUrl(req.headers.get('host'))

    if (!currentRefreshToken) {
      return NextResponse.json({ error: 'No refresh token available' }, { status: 401 })
    }

    const res = await fetch(`${backendUrl}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: currentRefreshToken }),
    })

    const rawData = await res.json()
    const data = rawData.data || rawData

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        cookieStore.delete('access_token')
        cookieStore.delete('refresh_token')
      }
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
        maxAge: 60 * 60 * 24,
      })
    }

    if (newRefreshToken) {
      cookieStore.set('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected refresh error'
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 },
    )
  }
}
