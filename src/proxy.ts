import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/orders', '/earnings', '/settings', '/staff', '/onboarding']
// Routes that are accessible only for unauthenticated users
const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = request.cookies.has('access_token') || request.cookies.has('refresh_token')

  // 1. Redirect unauthenticated users trying to access protected routes
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  if (isProtected && !hasToken) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // 2. Redirect authenticated users away from auth pages
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
