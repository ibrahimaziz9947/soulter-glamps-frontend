/*'use client'

import { useState } from 'react'

export default function AgentBookings() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const bookings = [
    { id: 'BK-2401', customer: 'Ali Hassan', email: 'ali@example.com', phone: '0300-1234567', glamping: 'Luxury Tent', checkIn: '2025-12-15', checkOut: '2025-12-17', guests: 2, total: 'PKR 25,000', commission: 'PKR 2,500', status: 'Confirmed' },
    { id: 'BK-2402', customer: 'Sara Ahmed', email: 'sara@example.com', phone: '0301-2345678', glamping: 'Tree House', checkIn: '2025-12-18', checkOut: '2025-12-20', guests: 3, total: 'PKR 32,000', commission: 'PKR 3,200', status: 'Pending' },
    { id: 'BK-2403', customer: 'Usman Khan', email: 'usman@example.com', phone: '0302-3456789', glamping: 'Safari Tent', checkIn: '2025-12-20', checkOut: '2025-12-22', guests: 4, total: 'PKR 28,000', commission: 'PKR 2,800', status: 'Confirmed' },
    { id: 'BK-2404', customer: 'Fatima Noor', email: 'fatima@example.com', phone: '0303-4567890', glamping: 'Dome Tent', checkIn: '2025-12-25', checkOut: '2025-12-27', guests: 2, total: 'PKR 30,000', commission: 'PKR 3,000', status: 'Confirmed' },
    { id: 'BK-2405', customer: 'Ahmed Malik', email: 'ahmed@example.com', phone: '0304-5678901', glamping: 'Cabin', checkIn: '2025-12-28', checkOut: '2025-12-30', guests: 5, total: 'PKR 35,000', commission: 'PKR 3,500', status: 'Cancelled' },
    { id: 'BK-2406', customer: 'Zainab Ali', email: 'zainab@example.com', phone: '0305-6789012', glamping: 'Luxury Tent', checkIn: '2025-12-10', checkOut: '2025-12-12', guests: 2, total: 'PKR 25,000', commission: 'PKR 2,500', status: 'Confirmed' },
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status.toLowerCase() === filterStatus
    const matchesSearch = searchQuery === '' || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.glamping.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  }

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green mb-2">My Bookings</h1>
            <p className="text-text-light">Manage all bookings created by you</p>
          </div>
          <a
            href="/agent/add-booking"
            className="px-6 py-3 bg-green text-cream rounded-lg font-semibold hover:bg-green-dark transition-smooth"
          >
            + Add New Booking
          </a>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-text-light text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-green mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-text-light text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-green mt-1">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-text-light text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-text-light text-sm">Cancelled</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{stats.cancelled}</p>
        </div>
      </div>

      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Booking ID, Customer Name, or Glamp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          
          <div className="flex items-center gap-3">
            <label className="font-semibold text-text-dark whitespace-nowrap">Filter Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-transparent min-w-[160px]"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50 border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Booking ID</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Customer Name</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Glamp</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Dates</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Status</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Commission</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-cream/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-green">{booking.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-text-dark">{booking.customer}</div>
                    <div className="text-xs text-text-light">{booking.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-text-dark">{booking.glamping}</div>
                    <div className="text-xs text-text-light">{booking.guests} guests</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="font-medium text-text-dark">{booking.checkIn}</div>
                      <div className="text-xs text-text-light">to {booking.checkOut}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      booking.status === 'Confirmed' ? 'bg-green/10 text-green' :
                      booking.status === 'Pending' ? 'bg-yellow/20 text-yellow' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-yellow text-lg">{booking.commission}</div>
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-4 py-2 bg-green/10 text-green rounded-lg text-sm font-semibold hover:bg-green hover:text-white transition-smooth">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-light text-lg">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  )
} 








'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/src/services/apiClient'

type Booking = {
  id: string
  customerName: string
  customerEmail: string
  glampName?: string
  checkInDate: string
  checkOutDate: string
  guests: number
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
}

export default function AgentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  /* =========================
     FETCH BOOKINGS
  ========================= *
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await api.get<{ success: boolean; data: Booking[] }>('/agent/bookings')
        setBookings(res.data || [])
      } catch (err) {
        console.error('Failed to fetch agent bookings', err)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  /* =========================
     FILTERED BOOKINGS
  ========================= *
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus =
        filterStatus === 'all' || booking.status.toLowerCase() === filterStatus

      const matchesSearch =
        searchQuery === '' ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.glampName?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [bookings, filterStatus, searchQuery])

  /* =========================
     STATS
  ========================= *
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
      pending: bookings.filter((b) => b.status === 'PENDING').length,
      cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
    }
  }, [bookings])

  /* =========================
     RENDER
  ========================= *
  return (
    <div className="space-y-6">
      {/* Header *
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green mb-2">My Bookings</h1>
            <p className="text-text-light">Manage all bookings created by you</p>
          </div>
          <a
            href="/agent/add-booking"
            className="px-6 py-3 bg-green text-cream rounded-lg font-semibold hover:bg-green-dark transition-smooth"
          >
            + Add New Booking
          </a>
        </div>
      </div>

      {/* Stats *
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.total} color="green" />
        <StatCard label="Confirmed" value={stats.confirmed} color="green" />
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="Cancelled" value={stats.cancelled} color="red" />
      </div>

      {/* Search & Filter *
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Booking ID, Customer, or Glamp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border rounded-lg min-w-[160px]"
          >
            <option value="all">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table *
        {loading ? (
          <p className="text-center py-12 text-text-light">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center py-12 text-text-light">No bookings found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 border-b">
                  <th className="py-4 px-4 text-left">Booking ID</th>
                  <th className="py-4 px-4 text-left">Customer</th>
                  <th className="py-4 px-4 text-left">Glamp</th>
                  <th className="py-4 px-4 text-left">Dates</th>
                  <th className="py-4 px-4 text-left">Status</th>
                  <th className="py-4 px-4 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="border-b hover:bg-cream/30">
                    <td className="py-4 px-4 font-bold text-green">{b.id}</td>
                    <td className="py-4 px-4">
                      <div>{b.customerName}</div>
                      <div className="text-xs text-text-light">{b.customerEmail}</div>
                    </td>
                    <td className="py-4 px-4">{b.glampName || '—'}</td>
                    <td className="py-4 px-4">
                      {b.checkInDate.slice(0, 10)} → {b.checkOutDate.slice(0, 10)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold">{b.status}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-yellow">
                      PKR {b.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================
   SMALL STAT COMPONENT
========================= *
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-text-light text-sm">{label}</p>
      <p className={`text-2xl font-bold text-${color} mt-1`}>{value}</p>
    </div>
  )
} *







'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/src/services/apiClient'

interface Booking {
  id: string
  customerName: string
  glampName: string
  checkInDate: string
  checkOutDate: string
  status: string
  totalAmount: number
}

export default function AgentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)

        // ✅ CRITICAL FIX: agent-specific endpoint
        const res = await api.get<{ success: boolean; data: Booking[] }>(
          '/agent/bookings'
        )

        setBookings(res.data || [])
      } catch (err: any) {
        console.error('Failed to load agent bookings', err)
        setError(err.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header *
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-green-900">My Bookings</h1>
          <p className="text-sm text-gray-600">
            Manage all bookings created by you
          </p>
        </div>

        <Link
          href="/agent/add-booking"
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
        >
          + Add New Booking
        </Link>
      </div>

      {/* States *
      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && bookings.length === 0 && (
        <p className="text-gray-600">No bookings created by you yet.</p>
      )}

      {/* Table *
      {!loading && bookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Booking ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Glamp</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="p-3 text-green-700 font-medium">{b.id}</td>
                  <td className="p-3">{b.customerName}</td>
                  <td className="p-3">{b.glampName || 'Unknown'}</td>
                  <td className="p-3">
                    {new Date(b.checkInDate).toLocaleDateString()} →{' '}
                    {new Date(b.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-semibold">{b.status}</td>
                  <td className="p-3 text-right font-semibold">
                    PKR {b.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} */








'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/src/services/apiClient'

/* =========================
   TYPES
========================= */

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

interface Booking {
  id: string
  customerName: string
  glampName: string
  checkInDate: string
  checkOutDate: string
  status: BookingStatus
  totalAmount: number
}

/* =========================
   PAGE
========================= */

export default function AgentBookingsPage() {
  const router = useRouter()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL')

  /* =========================
     FETCH BOOKINGS
  ========================= */

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Booking[] }>(
          '/agent/bookings'
        )
        setBookings(res.data)
      } catch (err) {
        console.error('Failed to fetch agent bookings', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  /* =========================
     FILTERING
  ========================= */

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.glampName.toLowerCase().includes(search.toLowerCase()) ||
        b.id.includes(search)

      const matchesStatus =
        statusFilter === 'ALL' || b.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [bookings, search, statusFilter])

  /* =========================
     STATS
  ========================= */

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    }
  }, [bookings])

  /* =========================
     RENDER
  ========================= */

  if (loading) {
    return <p className="p-6">Loading bookings...</p>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
        <div>
          <h1 className="text-2xl font-semibold text-green-900">
            My Bookings
          </h1>
          <p className="text-sm text-gray-600">
            Manage all bookings created by you
          </p>
        </div>

        <button
          onClick={() => router.push('/agent/add-booking')}
          className="bg-green-800 text-white px-5 py-2 rounded-lg hover:bg-green-900"
        >
          + Add New Booking
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.total} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Cancelled" value={stats.cancelled} />
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-xl shadow">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by Booking ID, Customer, or Glamp..."
          className="flex-1 border rounded-lg px-4 py-2"
        />

        <select
          value={statusFilter}
          onChange={e =>
            setStatusFilter(e.target.value as 'ALL' | BookingStatus)
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="ALL">All Bookings</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Booking ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Glamp</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id} className="border-t">
                <td className="p-4 font-mono text-green-800">{b.id}</td>
                <td className="p-4">{b.customerName}</td>
                <td className="p-4">{b.glampName || 'Unknown'}</td>
                <td className="p-4">
                  {new Date(b.checkInDate).toLocaleDateString()} →{' '}
                  {new Date(b.checkOutDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <StatusBadge status={b.status} />
                </td>
                <td className="p-4 text-right font-semibold text-yellow-700">
                  PKR {b.totalAmount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* =========================
   SMALL COMPONENTS
========================= */

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-green-900">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    CONFIRMED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  )
}



