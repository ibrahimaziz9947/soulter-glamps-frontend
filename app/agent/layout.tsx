'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { API_BASE_URL } from '../config/api'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const isLoginPage = pathname === '/agent/login'

  // Verify authorization with backend for protected pages
  useEffect(() => {
    if (isLoginPage) {
      setIsChecking(false)
      return
    }

    const verifyAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user && data.user.role === 'AGENT') {
            setIsAuthorized(true)
          } else {
            router.push('/agent/login?redirect=' + pathname)
          }
        } else {
          // Not authorized - redirect to login
          router.push('/agent/login?redirect=' + pathname)
        }
      } catch (error) {
        console.error('[Agent] Auth verification failed:', error)
        router.push('/agent/login?redirect=' + pathname)
      } finally {
        setIsChecking(false)
      }
    }

    verifyAuth()
  }, [pathname, isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading while checking authorization
  if (isChecking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
          <p className="text-text-light">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authorized
  if (!isAuthorized) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/agent/dashboard', icon: '📊' },
    { name: 'Bookings', href: '/agent/bookings', icon: '📅' },
    { name: 'Add Booking', href: '/agent/add-booking', icon: '➕' },
    { name: 'Commissions', href: '/agent/commissions', icon: '💰' },
    { name: 'Profile', href: '/agent/profile', icon: '👤' },
  ]

  const layoutContent = (
    <div className="min-h-screen bg-cream">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-green z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-cream">Agent Portal</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-cream p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-green text-cream w-64 z-50 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-green/20">
          <h1 className="text-2xl font-bold text-yellow">Agent Portal</h1>
          <p className="text-sm text-cream/80 mt-1">Sales Agent Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-yellow text-green font-semibold' 
                    : 'text-cream hover:bg-green-dark hover:text-yellow'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-green/20">
          <div className="bg-green-dark rounded-lg p-4">
            <p className="text-sm text-cream/80">Logged in as:</p>
            <p className="font-semibold text-yellow">Agent User</p>
            <p className="text-xs text-cream/60 mt-1">agent@soulterglamps.com</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )

  return layoutContent
}
