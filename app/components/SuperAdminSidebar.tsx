'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface SuperAdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function SuperAdminSidebar({ isOpen = false, onClose }: SuperAdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menu = [
    { label: 'Dashboard', href: '/super-admin/dashboard' },
    { label: 'Admins', href: '/super-admin/admins' },
    { label: 'Agents', href: '/super-admin/agents' },
    { label: 'Bookings', href: '/super-admin/bookings' },
    { label: 'Finance', href: '/super-admin/finance' },
    { label: 'Commissions', href: '/super-admin/commissions' },
    { label: 'Settings', href: '/super-admin/settings' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.replace('/super-admin/login')
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
        fixed inset-y-0 left-0 z-50 w-64 bg-[#2f4f1f] text-white flex flex-col justify-between min-h-screen transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top */}
        <div>
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-yellow-400">Super Admin</h2>
              <p className="text-sm text-white/70">Control Panel</p>
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

          <nav className="mt-4 space-y-1 px-3 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none">
            {menu.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block px-4 py-2 rounded-md transition ${
                    active
                      ? 'bg-yellow-500 text-black font-semibold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-white/10 bg-[#2f4f1f]">
          <div className="text-sm text-white/70 mb-3">
            Logged in as:
            <div className="font-semibold text-white">
              super@soulterglamps.com
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
