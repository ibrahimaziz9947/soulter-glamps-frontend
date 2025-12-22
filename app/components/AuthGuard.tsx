'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { type UserRole } from '@/src/services/auth.api'
import { API_BASE_URL } from '../config/api'

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
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization header is set by apiClient globally
          },
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user && data.user.role === requiredRole) {
            setIsAuthorized(true)
          } else {
            router.push(`${loginPath}?redirect=${encodeURIComponent(pathname)}`)
          }
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
