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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isLoginPage = pathname === '/super-admin/login'

  useEffect(() => {
    // Close sidebar on route change
    setSidebarOpen(false)
  }, [pathname])

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
      <SuperAdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <span className="font-serif font-bold text-green-900">Super Admin</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
