'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/src/services/apiClient'
import SuperAdminSidebar from '@/app/components/SuperAdminSidebar'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const isLoginPage = pathname.startsWith('/super-admin/login')

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      return
    }

    let cancelled = false

    const verify = async () => {
      try {
        const res = await api.get('/auth/me')

        if (
          !cancelled &&
          res?.data?.success &&
          res.data.user?.role === 'SUPER_ADMIN'
        ) {
          setAuthorized(true)
        } else {
          router.replace('/super-admin/login')
        }
      } catch {
        router.replace('/super-admin/login')
      } finally {
        if (!cancelled) setChecking(false)
      }
    }

    verify()

    return () => {
      cancelled = true
    }
  }, [router, isLoginPage])

  // ✅ Login page renders freely
  if (isLoginPage) {
    return <>{children}</>
  }

  // ⏳ Auth check loader
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying access…</p>
      </div>
    )
  }

  if (!authorized) return null

  // ✅ FINAL LAYOUT (SIDEBAR + CONTENT)
  return (
    <div className="flex min-h-screen bg-[#f6f3ea]">
      <SuperAdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
