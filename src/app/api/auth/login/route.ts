import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { resolveBackendBaseUrl } from '@/shared/lib/backend-url'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const backendUrl = resolveBackendBaseUrl(req.headers.get('host'))

    const res = await fetch(`${backendUrl}/auth/login/`, {
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

    const accessToken = data.data?.accessToken || data.access
    const refreshToken = data.data?.refreshToken || data.refresh
    const user = data.data?.user || data.user

    if (accessToken && refreshToken) {
      const cookieStore = await cookies()

      cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      })

      cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return NextResponse.json({
      status: 'success',
      user: user || null,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected login error'
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 },
    )
  }
}
