'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { type UserRole } from '@/src/services/auth.api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole: UserRole
  loginPath: string
}

export default function AuthGuard({ children, requiredRole, loginPath }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Map role to test endpoint
        const roleEndpoints: Record<UserRole, string> = {
          SUPER_ADMIN: '/super-admin/test',
          ADMIN: '/admin/test',
          AGENT: '/agent/test',
          CUSTOMER: '/'
        }

        const testEndpoint = roleEndpoints[requiredRole]
        if (!testEndpoint || requiredRole === 'CUSTOMER') {
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}${testEndpoint}`, {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          setIsAuthorized(true)
        } else {
          router.push(`${loginPath}?redirect=${encodeURIComponent(pathname)}`)
        }
      } catch (error) {
        router.push(`${loginPath}?redirect=${encodeURIComponent(pathname)}`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, requiredRole, loginPath, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-green mb-4"></div>
          <p className="text-text-light">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
