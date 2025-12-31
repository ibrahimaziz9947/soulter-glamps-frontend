/*'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAuthToken } from '../../../src/lib/auth'

interface AdminBooking {
  id: string
  customerName: string
  glampName: string
  guests: number
  status: string
  createdAt: string
}

export default function BookingsPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  

  /* ---------------- FETCH ADMIN BOOKINGS ---------------- *
  useEffect(() => {
    const fetchBookings = async () => {
      const token = getAuthToken()

      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/bookings`,
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

  /* ---------------- FILTERS ---------------- *
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

  /* ---------------- UI ---------------- *
  return (
    <div className="space-y-6">
      {/* Header *
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Bookings Management</h1>
          <p className="text-text-light mt-1">Manage all accommodation bookings</p>
        </div>
      </div>

      {/* Stats *
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'All Bookings', count: statusCount.all, color: 'bg-green' },
          { label: 'Confirmed', count: statusCount.confirmed, color: 'bg-green' },
          { label: 'Pending', count: statusCount.pending, color: 'bg-yellow' },
          { label: 'Cancelled', count: statusCount.cancelled, color: 'bg-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stat.color} rounded-full`} />
              <div>
                <p className="text-2xl font-bold text-green">{stat.count}</p>
                <p className="text-sm text-text-light">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters *
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

      {/* Table *
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
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-text-light">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-cream/50">
                    <td className="py-4 px-6 text-yellow font-medium">
                      {booking.id.slice(0, 8)}
                    </td>
                    <td className="py-4 px-6">{booking.customerName}</td>
                    <td className="py-4 px-6">{booking.glampName}</td>
                    <td className="py-4 px-6">{booking.guests}</td>
                    <td className="py-4 px-6 text-sm text-text-light">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs bg-green/10 text-green">
                        {booking.status}
                      </span>
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
} */






'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAuthToken } from '../../../src/lib/auth'

interface AdminBooking {
  id: string
  customerName: string
  glampName: string
  guests: number
  status: string
  createdAt: string
}

export default function BookingsPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/bookings`,
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

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/bookings/${bookingId}/status`,
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
    } catch (err) {
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
                  <td className="py-4 px-6">{booking.glampName}</td>
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
