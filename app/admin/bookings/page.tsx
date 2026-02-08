'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAuthToken } from '../../../src/lib/auth'

interface AdminBooking {
  id: string
  customerName: string
  glampName?: string // Legacy field (may not exist for agent bookings)
  guests: number
  status: string
  createdAt: string
  glamp?: {
    name: string
  }
}

export default function BookingsPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000) // Auto-dismiss after 4 seconds
  }

  /* ---------------- FETCH ADMIN BOOKINGS ---------------- */
  useEffect(() => {
    const fetchBookings = async () => {
      const token = getAuthToken()

      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
        const res = await fetch(
          `${baseUrl}/api/admin/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) {
          throw new Error('Failed to fetch bookings')
        }

        const json = await res.json()
        setBookings(json.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  /* ---------------- UPDATE BOOKING STATUS ---------------- */
  const updateStatus = async (bookingId: string, newStatus: string) => {
    const token = getAuthToken()
    if (!token) {
      alert('Authentication required')
      return
    }

    // Store old status to check if it changed
    const oldBooking = bookings.find(b => b.id === bookingId)
    if (!oldBooking || oldBooking.status === newStatus) {
      return // No change, don't show toast
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const res = await fetch(
        `${baseUrl}/api/admin/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      // Update UI instantly
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      )

      // Show appropriate toast based on status change
      if (oldBooking.status === 'PENDING' && newStatus === 'CONFIRMED') {
        showToast('Booking approved successfully', 'success')
      } else if (newStatus === 'CANCELLED') {
        showToast('Booking cancelled successfully', 'warning')
      }
    } catch (err) {
      // Don't show toast on error, keep existing alert for now
      alert('Could not update booking status')
    }
  }

  /* ---------------- FILTERS ---------------- */
  const filteredBookings = bookings.filter((booking) => {
    if (filter !== 'all' && booking.status.toLowerCase() !== filter) return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !booking.customerName.toLowerCase().includes(q) &&
        !booking.id.toLowerCase().includes(q)
      ) {
        return false
      }
    }

    return true
  })

  const statusCount = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
          toast.type === 'success' ? 'bg-green text-white' : 
          toast.type === 'warning' ? 'bg-orange-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : toast.type === 'warning' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">
          Bookings Management
        </h1>
        <p className="text-text-light mt-1">
          Manage all accommodation bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'All Bookings', count: statusCount.all },
          { label: 'Confirmed', count: statusCount.confirmed },
          { label: 'Pending', count: statusCount.pending },
          { label: 'Cancelled', count: statusCount.cancelled },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <p className="text-2xl font-bold text-green">{stat.count}</p>
            <p className="text-sm text-text-light">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by guest or booking ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <div className="flex gap-2 flex-wrap">
          {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === status
                  ? 'bg-yellow text-green'
                  : 'bg-cream hover:bg-yellow/20'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <p className="p-6 text-text-light">Loading bookings...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : (
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="py-4 px-6 text-left">Booking ID</th>
                <th className="py-4 px-6 text-left">Guest</th>
                <th className="py-4 px-6 text-left">Accommodation</th>
                <th className="py-4 px-6 text-left">Guests</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-cream/50">
                  <td className="py-4 px-6 text-yellow font-medium">
                    {booking.id.slice(0, 8)}
                  </td>
                  <td className="py-4 px-6">{booking.customerName}</td>
                  <td className="py-4 px-6">{booking.glamp?.name ?? booking.glampName ?? 'Unknown'}</td>
                  <td className="py-4 px-6">{booking.guests}</td>
                  <td className="py-4 px-6 text-sm text-text-light">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>

                  {/* STATUS DROPDOWN */}
                  <td className="py-4 px-6">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateStatus(booking.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                      disabled={
                        booking.status === 'CANCELLED' ||
                        booking.status === 'COMPLETED'
                      }
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>

                  <td className="py-4 px-6">
                    <Link
                      href={`/admin/bookings/view/${booking.id}`}
                      className="text-green hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
