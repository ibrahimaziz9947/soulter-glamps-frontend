'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    finance: pathname.includes('/admin/finance'),
  })

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Bookings', href: '/admin/bookings' },
    { label: 'Agents', href: '/admin/agents' },
    { label: 'Commissions', href: '/admin/commissions' },
    { label: 'Settings', href: '/admin/settings' },
  ]

  const financeSubItems = [
    { label: 'Dashboard', href: '/admin/finance/dashboard' },
    { label: 'Expenses', href: '/admin/finance/expenses' },
    { label: 'Income', href: '/admin/finance/income' },
    { label: 'Purchases', href: '/admin/finance/purchases' },
    { label: 'Payables', href: '/admin/finance/payables' },
    { label: 'Profit & Loss', href: '/admin/finance/profit-loss' },
    { label: 'Statements', href: '/admin/finance/statements' },
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

        {/* Finance Menu */}
        <div className="pt-2">
          <button
            onClick={() => toggleMenu('finance')}
            className={`w-full text-left rounded px-4 py-2 text-sm transition flex items-center justify-between ${
              pathname.includes('/admin/finance')
                ? 'bg-[#d4a62a] text-black font-medium'
                : 'hover:bg-white/10'
            }`}
          >
            <span>Finance</span>
            <svg
              className={`w-4 h-4 transition-transform ${expandedMenus.finance ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {expandedMenus.finance && (
            <div className="ml-2 mt-1 space-y-1">
              {financeSubItems.map(item => {
                const active = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded px-4 py-2 text-sm text-left transition ${
                      active
                        ? 'bg-[#d4a62a] text-black font-medium'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
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
