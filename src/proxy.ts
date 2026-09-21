import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/orders',
  '/business',
  '/notifications',
  '/earnings',
  '/settings',
  '/staff',
  '/onboarding',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = request.cookies.has('access_token') || request.cookies.has('refresh_token')

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  if (isProtected && !hasToken) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
