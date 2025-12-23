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






'use client'

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
}








/*'use client'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  console.log('[AGENT LAYOUT] NO AUTH LOGIC — PASS THROUGH')
  return <>{children}</>
} */
