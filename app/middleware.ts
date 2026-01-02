/*import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // We only care about agent routes
  if (pathname.startsWith('/agent')) {
    const authToken = request.cookies.get('auth_token')?.value

    // If token exists but user is trying to access agent routes
    // after visiting admin, force clean agent session
    if (!authToken && pathname !== '/agent/login') {
      return NextResponse.redirect(new URL('/agent/login', request.url))
    }
  }

  return NextResponse.next()
}

// Apply only to agent routes
export const config = {
  matcher: ['/agent/:path*'],
} */





import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Prevent admin → agent route switching via URL
  if (pathname.startsWith('/agent')) {
    const referer = request.headers.get('referer') || ''

    // If user comes to agent routes from admin routes,
    // force fresh agent context
    if (referer.includes('/admin')) {
      return NextResponse.redirect(
        new URL('/agent/login', request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/agent/:path*'],
}
