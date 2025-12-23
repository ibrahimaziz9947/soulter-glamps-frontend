'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AgentSidebar() {
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
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
          ${active ? 'bg-yellow text-green font-semibold' : 'text-white hover:bg-green-700'}
        `}
      >
        {label}
      </Link>
    )
  }

  return (
    <aside className="w-64 bg-green text-white flex flex-col justify-between">
      {/* TOP */}
      <div>
        <div className="p-6 border-b border-green-700">
          <h1 className="text-xl font-bold">Agent Portal</h1>
          <p className="text-sm opacity-80">Sales Agent Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItem('/agent/dashboard', 'Dashboard')}
          {navItem('/agent/bookings', 'Bookings')}
          {navItem('/agent/add-booking', 'Add Booking')}
          {navItem('/agent/commissions', 'Commissions')}
          {navItem('/agent/profile', 'Profile')}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-4 border-t border-green-700">
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
  )
}
