import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { resolveBackendBaseUrl } from '@/shared/lib/backend-url'

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params)
}

async function handleProxyRequest(req: NextRequest, params: { path: string[] }) {
  try {
    const reqUrl = new URL(req.url)
    const backendUrl = resolveBackendBaseUrl(req.headers.get('host'))

    const exactPathMatch = reqUrl.pathname.match(/\/api\/proxy\/(.*)/)
    const exactPath = exactPathMatch ? exactPathMatch[1] : params.path.join('/')

    const searchParams = reqUrl.searchParams.toString()
    const query = searchParams ? `?${searchParams}` : ''

    const targetUrl = new URL(`${backendUrl}/${exactPath}${query}`)
    if (!targetUrl.pathname.endsWith('/')) {
      targetUrl.pathname += '/'
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    const headers = new Headers(req.headers)

    headers.delete('host')
    headers.delete('cookie')
    headers.delete('referer')
    headers.delete('origin')
    headers.delete('accept-encoding')

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer(),
      redirect: 'manual',
    }

    const response = await fetch(targetUrl, fetchOptions)

    const responseHeaders = new Headers(response.headers)
    responseHeaders.delete('content-length')
    responseHeaders.delete('transfer-encoding')
    responseHeaders.delete('content-encoding')
    responseHeaders.delete('access-control-allow-origin')

    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      try {
        const responseData = await response.json()
        return NextResponse.json(responseData, {
          status: response.status,
          headers: responseHeaders,
        })
      } catch (_e) {
        const text = await response.text()
        return new NextResponse(text, {
          status: response.status,
          headers: responseHeaders,
        })
      }
    }

    const responseData = await response.text()
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error: unknown) {
    console.error('[Proxy Error]', error)
    return NextResponse.json(
      { error: 'Bad Gateway', message: 'Failed to connect to the upstream backend' },
      { status: 502 },
    )
  }
}
