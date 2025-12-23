'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function SuperAdminSidebar() {
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
    <aside className="w-64 bg-[#2f4f1f] text-white flex flex-col justify-between min-h-screen">
      {/* Top */}
      <div>
        <div className="px-6 py-5 border-b border-white/10">
          <h2 className="text-xl font-bold text-yellow-400">Super Admin</h2>
          <p className="text-sm text-white/70">Control Panel</p>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {menu.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
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
      <div className="px-4 py-4 border-t border-white/10">
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
  )
}
