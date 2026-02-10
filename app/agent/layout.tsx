/*'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { api }from '@/src/services/apiClient'


  export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/agent/login';

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Login page never requires auth
    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    let cancelled = false;

    const verifyAuth = async () => {
      try {
        const res = await api.get('/auth/me');

        if (
          !res?.data?.success ||
          !res.data.user ||
          res.data.user.role !== 'AGENT'
        ) {
          if (!cancelled) {
            router.replace('/agent/login');
          }
          return;
        }

        if (!cancelled) {
          setIsAuthorized(true);
        }
      } catch (err) {
        if (!cancelled) {
          router.replace('/agent/login');
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    verifyAuth();

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, router]);

  // While auth is being verified, render nothing (or spinner)
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-500 text-sm">Checking authentication…</span>
      </div>
    );
  }

  // If not authorized, layout already redirected
  if (!isAuthorized && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
} */



/*
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/app/config/api'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('auth_token')

      if (!token) {
        router.replace('/agent/login')
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          router.replace('/agent/login')
          return
        }

        const data = await res.json()

        if (!data.success || data.user?.role !== 'agent') {
          router.replace('/agent/login')
          return
        }

        // ✅ Authorized
        setReady(true)
      } catch {
        router.replace('/agent/login')
      }
    }

    verify()
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verifying session…</p>
      </div>
    )
  }

  return <>{children}</>
} */







/*'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { API_BASE_URL } from '@/app/config/api'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // ✅ 1. ALLOW LOGIN PAGE WITHOUT AUTH
    if (pathname === '/agent/login') {
      setReady(true)
      return
    }

    const verify = async () => {
      const token = localStorage.getItem('auth_token')

      if (!token) {
        router.replace('/agent/login')
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          router.replace('/agent/login')
          return
        }

        const data = await res.json()

        if (!data.success || data.user?.role !== 'agent') {
          router.replace('/agent/login')
          return
        }

        // ✅ Authorized
        setReady(true)
      } catch {
        router.replace('/agent/login')
      }
    }

    verify()
  }, [router, pathname])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verifying session…</p>
      </div>
    )
  }

  return <>{children}</>
} */






/*
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')

    // 🚫 No token → go to login ONCE
    if (!token) {
      router.replace('/agent/login')
      return
    }

    // ✅ Token exists → allow render
    setChecked(true)
  }, [router])

  // ⏳ Prevent rendering until auth is checked
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verifying session...
      </div>
    )
  }

  return <>{children}</>
} */






/*'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  // Step 1: ensure browser is ready
  useEffect(() => {
    setMounted(true)
  }, [])

  // Step 2: check auth ONLY after mount
  useEffect(() => {
    if (!mounted) return

    const token = localStorage.getItem('auth_token')

    if (!token) {
      router.replace('/agent/login')
      return
    }

    setAuthorized(true)
  }, [mounted, router])

  // ⛔ Block rendering until browser + auth check complete
  if (!mounted || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verifying session...
      </div>
    )
  }

  return <>{children}</>
} */




/*'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  // Step 1: ensure browser is ready
  useEffect(() => {
    setMounted(true)
  }, [])

  // Step 2: check auth ONLY after mount
  useEffect(() => {
    if (!mounted) return

    const token = localStorage.getItem('auth_token')

    if (!token) {
      router.replace('/agent/login')
      return
    }

    setAuthorized(true)
  }, [mounted, router])

  // ⛔ Block rendering until browser + auth check complete
  if (!mounted || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verifying session...
      </div>
    )
  }

  return <>{children}</>
} */






/*
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  // 🚨 Allow login page to render freely
  if (pathname === '/agent/login') {
    return <>{children}</>
  }

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.replace('/agent/login')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verifying session...
      </div>
    )
  }

  return <>{children}</>
} */




/* Fixed Authentication At last
export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream">
      {children}
    </div>
  )
} */





'use client'

import { usePathname, useRouter } from 'next/navigation'
import AgentSidebar from '@/app/components/AgentSidebar'
import { useState, useEffect } from 'react'

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // 🚫 Login page should NOT show sidebar
  if (pathname === '/agent/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* LEFT SIDEBAR */}
      <AgentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <span className="font-serif font-bold text-green-900">Agent Portal</span>
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







/*'use client'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  console.log('[AGENT LAYOUT] NO AUTH LOGIC — PASS THROUGH')
  return <>{children}</>
} */
