'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface AgentSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AgentSidebar({ isOpen = false, onClose }: AgentSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('auth_token')
    router.replace('/agent/login')
  }

  const navItem = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
          ${active ? 'bg-yellow text-green font-semibold' : 'text-white hover:bg-green-700'}
        `}
      >
        {label}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-green text-white flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* TOP */}
        <div>
          <div className="p-6 border-b border-green-700 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Agent Portal</h1>
              <p className="text-sm opacity-80">Sales Agent Dashboard</p>
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={onClose}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none">
            {navItem('/agent/dashboard', 'Dashboard')}
            {navItem('/agent/bookings', 'Bookings')}
            {navItem('/agent/add-booking', 'Add Booking')}
            {navItem('/agent/commissions', 'Commissions')}
            {navItem('/agent/profile', 'Profile')}
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="p-4 border-t border-green-700 bg-green">
          <div className="mb-4 text-sm">
            <p className="opacity-70">Logged in as</p>
            <p className="font-semibold">Agent User</p>
          </div>

          <button
            onClick={logout}
            className="w-full bg-yellow text-green py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
