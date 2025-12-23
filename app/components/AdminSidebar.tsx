'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Bookings', href: '/admin/bookings' },
    { label: 'Agents', href: '/admin/agents' },
    { label: 'Commissions', href: '/admin/commissions' },
    { label: 'Finance', href: '/admin/finance' },
    { label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <aside className="w-64 bg-[#2f4f1e] text-white min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <p className="text-xs text-white/70">Management Console</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-4 py-2 text-sm transition ${
                active
                  ? 'bg-[#d4a62a] text-black font-medium'
                  : 'hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={() => {
            localStorage.removeItem('auth_token')
            window.location.href = '/admin'
          }}
          className="w-full text-left text-sm text-red-200 hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
