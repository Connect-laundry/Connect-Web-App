import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connect-full-backend.onrender.com/api/v1'

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
    
    // Extract everything after /api/proxy to safely retain exact slashes
    // Next.js params.path strips trailing slashes which causes backend redirects (into GET mode).
    const exactPathMatch = reqUrl.pathname.match(/\/api\/proxy\/(.*)/)
    const exactPath = exactPathMatch ? exactPathMatch[1] : params.path.join('/')
    
    const searchParams = reqUrl.searchParams.toString()
    const query = searchParams ? `?${searchParams}` : ''
    
    const targetUrl = new URL(`${BACKEND_URL}/${exactPath}${query}`)
    // Django REST Framework strictly requires trailing slashes for directory endpoints.
    // If we omit it, Django returns a 301 relative redirect to `/api/v1/...`
    // which causes the browser to redirect to `localhost:3000/api/v1/...` as a GET.
    if (!targetUrl.pathname.endsWith('/')) {
      targetUrl.pathname += '/'
    }

    // Get the tokens from HttpOnly cookies
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    
    const headers = new Headers(req.headers)
    
    // Remove headers that might interfere with the proxying
    headers.delete('host')
    headers.delete('cookie')
    headers.delete('referer')
    headers.delete('origin')
    // Prevent backend from returning compressed responses to avoid stream decoding errors
    headers.delete('accept-encoding') 
    
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      // Use arrayBuffer for the request body to ensure the full payload is captured before proxying
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer(),
      redirect: 'manual',
    }

    const response = await fetch(targetUrl, fetchOptions)

    const responseHeaders = new Headers(response.headers)
    
    // Crucial: remove all headers that could cause browser-side body truncation
    responseHeaders.delete('content-length')
    responseHeaders.delete('transfer-encoding')
    responseHeaders.delete('content-encoding')
    responseHeaders.delete('access-control-allow-origin')

    // Parse JSON correctly to ensure it's fully received before sending back to client
    let responseData: any
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      // Cloned to allow fallbacks if json() fails
      try {
        responseData = await response.json()
        return NextResponse.json(responseData, {
          status: response.status,
          headers: responseHeaders,
        })
      } catch (e) {
        // Fallback to text if JSON parsing fails on proxy side
        const text = await response.text()
        return new NextResponse(text, {
          status: response.status,
          headers: responseHeaders,
        })
      }
    } else {
      responseData = await response.text()
      return new NextResponse(responseData, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      })
    }
                                              
  } catch (error: any) {
    console.error('[Proxy Error]', error)
    return NextResponse.json(
      { error: 'Bad Gateway', message: 'Failed to connect to the upstream backend' },
      { status: 502 }
    ) 
  }
}
