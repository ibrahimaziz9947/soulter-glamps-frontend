'use client'

import { useState } from 'react'

export default function SuperAdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock bookings data
  const bookings = [
    { id: 'BK-001', date: '2025-12-04', guest: 'Sarah Johnson', email: 'sarah@email.com', glamp: 'Luxury Safari Tent', nights: 3, amount: 75000, status: 'confirmed', paymentMethod: 'EasyPaisa', admin: 'Ahmad Khan' },
    { id: 'BK-002', date: '2025-12-03', guest: 'Michael Chen', email: 'michael@email.com', glamp: 'Geodesic Dome', nights: 2, amount: 50000, status: 'confirmed', paymentMethod: 'Bank Transfer', admin: 'Sarah Ali' },
    { id: 'BK-003', date: '2025-12-02', guest: 'Emily Davis', email: 'emily@email.com', glamp: 'Treehouse Suite', nights: 3, amount: 75000, status: 'pending', paymentMethod: 'Manual', admin: 'Hassan Malik' },
    { id: 'BK-004', date: '2025-12-01', guest: 'Robert Wilson', email: 'robert@email.com', glamp: 'Woodland Cabin', nights: 2, amount: 50000, status: 'confirmed', paymentMethod: 'Cash', admin: 'Ahmad Khan' },
    { id: 'BK-005', date: '2025-11-30', guest: 'Lisa Anderson', email: 'lisa@email.com', glamp: 'Luxury Safari Tent', nights: 3, amount: 75000, status: 'cancelled', paymentMethod: 'EasyPaisa', admin: 'Sarah Ali' },
    { id: 'BK-006', date: '2025-11-29', guest: 'James Martinez', email: 'james@email.com', glamp: 'Geodesic Dome', nights: 2, amount: 50000, status: 'confirmed', paymentMethod: 'Bank Transfer', admin: 'Ahmad Khan' },
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesSearch = booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length
  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">All Bookings</h1>
        <p className="text-text-light mt-1">View and manage all bookings across the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Bookings</p>
          <p className="font-serif text-3xl font-bold text-green">{totalBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Confirmed</p>
          <p className="font-serif text-3xl font-bold text-green">{confirmedBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Pending</p>
          <p className="font-serif text-3xl font-bold text-yellow">{pendingBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Cancelled</p>
          <p className="font-serif text-3xl font-bold text-red-500">{cancelledBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Revenue</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by booking ID or guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Booking ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Guest</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Glamp</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Nights</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Payment</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Admin</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <span className="font-medium text-yellow">{booking.id}</span>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{booking.date}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-text-dark">{booking.guest}</p>
                      <p className="text-sm text-text-light">{booking.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-dark">{booking.glamp}</td>
                  <td className="py-4 px-6 text-text-dark">{booking.nights}</td>
                  <td className="py-4 px-6 font-semibold text-green">PKR {booking.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm text-text-light">{booking.paymentMethod}</td>
                  <td className="py-4 px-6 text-sm text-text-light">{booking.admin}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' 
                        ? 'bg-green/10 text-green' 
                        : booking.status === 'pending'
                        ? 'bg-yellow/10 text-yellow'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
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
