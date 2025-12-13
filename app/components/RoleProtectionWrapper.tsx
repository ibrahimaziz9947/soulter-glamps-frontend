'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { decodeToken, isTokenExpired } from '@/app/utils/auth'

interface RoleProtectionWrapperProps {
  children: React.ReactNode
  requiredRoles: string[]
  loginPage: string
}

/**
 * Client-side role protection wrapper
 * Checks JWT token and validates user role
 * Redirects to login if not authenticated or to unauthorized if role doesn't match
 */
export default function RoleProtectionWrapper({
  children,
  requiredRoles,
  loginPage,
}: RoleProtectionWrapperProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get token from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1]

    // No token - redirect to login
    if (!token) {
      router.push(loginPage)
      return
    }

    // Decode token
    const payload = decodeToken(token)

    // Invalid token or missing role - redirect to login
    if (!payload || !payload.role) {
      router.push(loginPage)
      return
    }

    // Check if token is expired
    if (isTokenExpired(payload)) {
      router.push(loginPage)
      return
    }

    // Check if user role is authorized
    if (!requiredRoles.includes(payload.role)) {
      router.push('/unauthorized')
      return
    }

    // All checks passed
    setIsAuthorized(true)
    setIsLoading(false)
  }, [router, loginPage, requiredRoles])

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-green border-t-yellow rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-text-light font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  // User is authorized
  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
