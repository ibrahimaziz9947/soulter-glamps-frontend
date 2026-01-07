'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// ⚠️ DASHBOARD IS INTENTIONALLY STATIC
// Commission data will be added later when fully tested
// For now, this shows placeholder data only

type Booking = {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  totalAmount: number
  checkInDate: string
  customerName?: string
  customer?: {
    name: string
  }
  glamp?: {
    name: string
  }
}

export default function AgentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.replace('/agent/login')
      return
    }

    // Dashboard loads successfully with auth check only
    setLoading(false)
  }, [router])

  return <DashboardContent loading={loading} />
}

function DashboardContent({
  loading,
}: {
  loading: boolean
}) {
  // ⚠️ STATIC DATA - Dashboard is not connected to backend yet
  const bookings: Booking[] = []
  
  /* -------------------- STATIC STATS -------------------- */
  const totalBookings = 0
  const pendingBookings = 0
  const confirmedBookings = 0
  const recentBookings: Booking[] = []

  /* -------------------- STATIC SUMMARY CARDS -------------------- */
  const summaryCards = [
    { 
      label: 'Total Customers Brought', 
      value: '—',
      icon: '👥', 
      bgColor: 'bg-blue-500',
    },
    { 
      label: 'Total Bookings', 
      value: '—', 
      icon: '📅', 
      bgColor: 'bg-green',
    },
    { 
      label: 'Commission Earned', 
      value: '—', // Will be dynamic when dashboard is converted
      icon: '💰', 
      bgColor: 'bg-yellow',
    },
    { 
      label: 'Pending Commission', 
      value: '—', // Will be dynamic when dashboard is converted
      icon: '⏳', 
      bgColor: 'bg-purple-500',
    },
  ]

  /* -------------------- LOADING STATE -------------------- */
  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-r from-green to-green-dark rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome Back, Agent!</h1>
        <p className="text-cream/90 text-lg">
          Here’s your real-time booking overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`${card.bgColor} w-14 h-14 rounded-lg flex items-center justify-center text-3xl shadow-md`}
              >
                {card.icon}
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">
              {card.label}
            </p>
            <p className="text-3xl font-bold text-green">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green">Recent Bookings</h2>
            <p className="text-text-light text-sm mt-1">
              Your latest customer bookings
            </p>
          </div>
          <a
            href="/agent/bookings"
            className="px-4 py-2 bg-yellow text-green rounded-lg font-semibold hover:bg-yellow/80 transition-smooth text-sm"
          >
            View All →
          </a>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Glamp</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Check-In</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 hover:bg-cream/30 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-green">
                      {booking.id.slice(0, 8)}
                    </td>
                    <td className="py-4 px-4">
                      {booking.customerName || booking.customer?.name || '—'}
                    </td>
                    <td className="py-4 px-4 text-text-light">
                      {booking.glamp?.name || '—'}
                    </td>
                    <td className="py-4 px-4 text-text-light">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green/10 text-green'
                            : 'bg-yellow/20 text-yellow'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/agent/add-booking"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-green group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green rounded-lg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              ➕
            </div>
            <div>
              <h3 className="text-xl font-bold text-green mb-1">
                Add New Booking
              </h3>
              <p className="text-text-light text-sm">
                Create a booking for your customer
              </p>
            </div>
          </div>
        </a>

        <a
          href="/agent/commissions"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-yellow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow rounded-lg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              💰
            </div>
            <div>
              <h3 className="text-xl font-bold text-green mb-1">
                View Commissions
              </h3>
              <p className="text-text-light text-sm">
                Check your earnings and history
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
