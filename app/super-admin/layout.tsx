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

  const isLoginPage = pathname === '/super-admin/login'

  useEffect(() => {
    // ✅ Allow login page freely
    if (isLoginPage) {
      setChecking(false)
      return
    }

    let active = true

    const verify = async () => {
      try {
        const res = await api.get('/auth/me')

        if (
          active &&
          res?.success &&
          res.user?.role === 'SUPER_ADMIN'
        ) {
          setAuthorized(true)
        } else {
          router.replace('/super-admin/login')
        }
      } catch {
        router.replace('/super-admin/login')
      } finally {
        if (active) setChecking(false)
      }
    }

    verify()

    return () => {
      active = false
    }
    // 🚫 DO NOT add router or pathname here
  }, [isLoginPage, router]) // ✅ RUN ONCE ONLY

  // ✅ Login page
  if (isLoginPage) {
    return <>{children}</>
  }

  // ⏳ Loading
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying access…</p>
      </div>
    )
  }

  if (!authorized) return null

  // ✅ Final layout
  return (
    <div className="flex min-h-screen bg-[#f6f3ea]">
      <SuperAdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
