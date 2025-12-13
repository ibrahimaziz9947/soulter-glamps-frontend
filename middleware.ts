import { NextRequest, NextResponse } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/glamps',
  '/glamps/',
  '/about',
  '/contact',
  '/facilities',
  '/gallery',
  '/policies',
  '/packages',
  '/booking',
]

// Protected route prefixes
const PROTECTED_ROUTES = [
  '/admin',
  '/agent',
  '/super-admin',
]

// Login pages for different route sections
const LOGIN_PAGES = {
  '/admin': '/admin',
  '/agent': '/agent/login',
  '/super-admin': '/super-admin/login',
}

/**
 * Check if route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  // Check if it's a protected route
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route)) {
      // Don't protect login pages themselves
      if (pathname === '/admin' || pathname === '/agent/login' || pathname === '/super-admin/login') {
        return false
      }
      return true
    }
  }
  return false
}

/**
 * Get login page for a protected route
 */
function getLoginPageForPath(pathname: string): string {
  if (pathname.startsWith('/super-admin')) {
    return LOGIN_PAGES['/super-admin']
  }
  if (pathname.startsWith('/agent')) {
    return LOGIN_PAGES['/agent']
  }
  if (pathname.startsWith('/admin')) {
    return LOGIN_PAGES['/admin']
  }
  return LOGIN_PAGES['/admin']
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next()
  }

  // Check if route requires protection
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  // Check for auth_token cookie
  const authToken = request.cookies.get('auth_token')?.value

  // No token - redirect to appropriate login page
  if (!authToken) {
    const loginUrl = new URL(getLoginPageForPath(pathname), request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Token exists - allow request to proceed
  // Role validation will happen in the page/layout components
  return NextResponse.next()
}

/**
 * Configure which routes to apply middleware to
 * Exclude Next.js static assets and API routes that handle their own auth
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.gif|.*\\.svg).*)',
  ],
}
