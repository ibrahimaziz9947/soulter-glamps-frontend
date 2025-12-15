'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllBookings } from '../../utils/mockBooking'

interface Booking {
  id: string
  firstName: string
  lastName: string
  email: string
  glampName: string
  nights: number
  guests: number
  checkIn: string
  status: string
  amountPaid?: number
  remainingAmount?: number
}

export default function BookingsPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    // Get real bookings from mockBookings.js
    const realBookings = getAllBookings() as Booking[]
    setBookings(realBookings)
  }, [])

  const filteredBookings = bookings.filter(booking => {
    if (filter !== 'all' && booking.status !== filter) return false
    const guestName = `${booking.firstName || ''} ${booking.lastName || ''}`.toLowerCase()
    if (searchQuery && !guestName.includes(searchQuery.toLowerCase()) && !booking.id.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const statusCount = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed' || b.status === 'advance-paid').length,
    pending: bookings.filter(b => b.status === 'pending' || b.status === 'manual').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Bookings Management</h1>
          <p className="text-text-light mt-1">Manage all accommodation bookings</p>
        </div>
        <Link 
          href="/admin/bookings/add"
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'All Bookings', count: statusCount.all, color: 'bg-green' },
          { label: 'Confirmed', count: statusCount.confirmed, color: 'bg-green' },
          { label: 'Pending', count: statusCount.pending, color: 'bg-yellow' },
          { label: 'Cancelled', count: statusCount.cancelled, color: 'bg-red-500' },
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-green">{stat.count}</p>
                <p className="text-sm text-text-light">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by guest name or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
              />
              <svg className="w-5 h-5 text-text-light absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth capitalize ${
                  filter === status
                    ? 'bg-yellow text-green'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Booking ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Guest</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Accommodation</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Check-in</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Guests</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Payment Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount Paid</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-text-light">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6">
                      <span className="font-medium text-yellow">{booking.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-text-dark">{booking.firstName} {booking.lastName}</p>
                        <p className="text-sm text-text-light">{booking.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-text-dark">{booking.glampName}</p>
                        <p className="text-xs text-text-light">{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-light text-sm">{booking.checkIn}</td>
                    <td className="py-4 px-6 text-text-dark">{booking.guests}</td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {booking.status === 'manual' ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow/20 text-yellow border border-yellow">
                            ⚠ Manual Follow-Up Needed
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green/10 text-green">
                            {booking.status === 'advance-paid' ? '50% Advance Paid' : booking.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-green">PKR {booking.amountPaid?.toLocaleString() || 0}</p>
                        {(booking.remainingAmount ?? 0) > 0 && (
                          <p className="text-xs text-text-light">PKR {booking.remainingAmount?.toLocaleString()} due</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'advance-paid' 
                          ? 'bg-green/10 text-green' 
                          : booking.status === 'manual'
                          ? 'bg-yellow/10 text-yellow'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {booking.status === 'advance-paid' ? 'Confirmed' : booking.status === 'manual' ? 'Pending' : booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/admin/bookings/view/${booking.id}`}
                          className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button 
                          className="p-2 text-yellow hover:bg-cream rounded-lg transition-smooth"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 text-red-500 hover:bg-cream rounded-lg transition-smooth"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-text-light">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-text-dark hover:bg-cream transition-smooth disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-yellow text-green rounded-lg font-semibold">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-text-dark hover:bg-cream transition-smooth">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-text-dark hover:bg-cream transition-smooth">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
