/*
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/src/services/apiClient'

/* =========================
   TYPES
========================= *

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
========================= *

export default function AgentBookingsPage() {
  const router = useRouter()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL')

  /* =========================
     FETCH BOOKINGS
  ========================= */
/*
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
  }, []) */

  /* =========================
   FETCH BOOKINGS (ISOLATED)
========================= *

useEffect(() => {
  let isMounted = true

  const fetchBookings = async () => {
    try {
      // 🔒 Clear stale data first (important)
      setBookings([])
      setLoading(true)

      const res = await api.get<{ success: boolean; data: Booking[] }>(
        '/agent/bookings',
        {
          // 🚫 Disable caching completely
          cache: 'no-store',
        }
      )

      if (isMounted) {
        setBookings(res.data)
      }
    } catch (err) {
      console.error('Failed to fetch agent bookings', err)
      if (isMounted) {
        setBookings([])
      }
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }
  }

  fetchBookings()

  // 🧹 Cleanup to prevent bleed-over
  return () => {
    isMounted = false
  }
}, [])


  /* =========================
     FILTERING
  ========================= *

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
  ========================= *

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
  ========================= *

  if (loading) {
    return <p className="p-6">Loading bookings...</p>
  }

  return (
    <div className="space-y-6">
      {/* Header *
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

      {/* Stats *
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.total} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Cancelled" value={stats.cancelled} />
      </div>

      {/* Filters *
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

      {/* Table *
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
========================= *

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
} */








// Most recent correct file

/*'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/src/services/apiClient'

/* =========================
   TYPES
========================= *

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

interface Booking {
  id: string
  customerName: string
  //glampName: string
  glamp?: {
    name: string
  }
  checkInDate: string
  checkOutDate: string
  status: BookingStatus
  totalAmount: number
}

/* =========================
   PAGE
========================= *

export default function AgentBookingsPage() {
  const router = useRouter()
  const pathname = usePathname()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL')

  /* =========================
     FETCH BOOKINGS (FORCED REMOUNT SAFE)
  ========================= *

  useEffect(() => {
    let active = true

    const fetchBookings = async () => {
      try {
        setBookings([])
        setLoading(true)

        const res = await api.get<{ success: boolean; data: Booking[] }>(
          '/agent/bookings'
        )

        if (active) {
          setBookings(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch agent bookings', err)
        active && setBookings([])
      } finally {
        active && setLoading(false)
      }
    }

    fetchBookings()

    return () => {
      active = false
    }
  }, [])


    const filteredBookings = useMemo(() => {
  const q = search.toLowerCase()

  return bookings.filter(b => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(q) ||
      b.glamp?.name?.toLowerCase().includes(q) ||
      b.id.includes(search)

    const matchesStatus =
      statusFilter === 'ALL' || b.status === statusFilter

    return matchesSearch && matchesStatus
  })
}, [bookings, search, statusFilter])


  /* =========================
     STATS
  ========================= *

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
  ========================= *

  if (loading) {
    return <p className="p-6">Loading bookings...</p>
  }

  return (
    <div key={pathname} className="space-y-6">
      {/* Header *
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

      {/* Stats *
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.total} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Cancelled" value={stats.cancelled} />
      </div>

      {/* Filters *
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

      {/* Table *
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
                {/*<td className="p-4">{b.glampName || 'Unknown'}</td>*
                <td className="p-4">{b.glamp?.name || 'Unknown'}</td>

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
========================= *

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
} */








'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/src/services/apiClient'

/* =========================
   TYPES
========================= */

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

interface Booking {
  id: string
  customerName: string
  glamp?: {
    name: string
  }
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
  const pathname = usePathname()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL')

  /* =========================
     FETCH BOOKINGS
  ========================= */

  useEffect(() => {
    let active = true

    const fetchBookings = async () => {
      try {
        setBookings([])
        setLoading(true)

        const res = await api.get<{ success: boolean; data: Booking[] }>(
          '/agent/bookings'
        )

        if (active) {
          setBookings(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch agent bookings', err)
        active && setBookings([])
      } finally {
        active && setLoading(false)
      }
    }

    fetchBookings()

    return () => {
      active = false
    }
  }, [])

  /* =========================
     FILTERING
  ========================= */

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase()

    return bookings.filter(b => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(q) ||
        b.glamp?.name?.toLowerCase().includes(q) ||
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
    <div key={pathname} className="space-y-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.total} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Cancelled" value={stats.cancelled} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow">
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Glamp</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map(b => (
                <tr key={b.id} className="border-t">
                  <td className="p-4 font-mono text-green-800">{b.id}</td>
                  <td className="p-4">{b.customerName}</td>
                  <td className="p-4">{b.glamp?.name || 'Unknown'}</td>

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

                  {/* ✅ ACTION */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() =>
                        router.push(`/agent/bookings/view/${b.id}`)
                      }
                      className="text-green-700 font-semibold hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
