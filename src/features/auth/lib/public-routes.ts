/** Routes where failed auth checks should not toast or redirect. */
export function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true
  if (pathname.startsWith('/auth/')) return true
  if (pathname.startsWith('/onboarding/')) return true
  return false
}

export function isProtectedAppPath(pathname: string): boolean {
  const protectedPrefixes = [
    '/dashboard',
    '/orders',
    '/notifications',
    '/business',
    '/machines',
    '/earnings',
    '/staff',
    '/settings',
  ]
  return protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
