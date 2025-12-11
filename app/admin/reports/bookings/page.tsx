'use client'

import { useState } from 'react'

export default function BookingsReportPage() {
  const [dateRange, setDateRange] = useState('this-month')
  const [glampType, setGlampType] = useState('all')

  // Mock bookings data for report
  const bookings = [
    { id: 'BK-001', date: '2025-12-04', guest: 'Sarah Johnson', email: 'sarah@email.com', glamp: 'Luxury Safari Tent', nights: 3, amount: 75000, status: 'confirmed' },
    { id: 'BK-002', date: '2025-12-03', guest: 'Michael Chen', email: 'michael@email.com', glamp: 'Geodesic Dome', nights: 2, amount: 50000, status: 'confirmed' },
    { id: 'BK-003', date: '2025-12-02', guest: 'Emily Davis', email: 'emily@email.com', glamp: 'Treehouse Suite', nights: 3, amount: 75000, status: 'confirmed' },
    { id: 'BK-004', date: '2025-12-01', guest: 'Robert Wilson', email: 'robert@email.com', glamp: 'Woodland Cabin', nights: 2, amount: 50000, status: 'confirmed' },
    { id: 'BK-005', date: '2025-11-30', guest: 'Lisa Anderson', email: 'lisa@email.com', glamp: 'Luxury Safari Tent', nights: 3, amount: 75000, status: 'cancelled' },
    { id: 'BK-006', date: '2025-11-29', guest: 'James Martinez', email: 'james@email.com', glamp: 'Geodesic Dome', nights: 2, amount: 50000, status: 'confirmed' },
    { id: 'BK-007', date: '2025-11-28', guest: 'Patricia Lee', email: 'patricia@email.com', glamp: 'Treehouse Suite', nights: 4, amount: 100000, status: 'confirmed' },
    { id: 'BK-008', date: '2025-11-27', guest: 'David Brown', email: 'david@email.com', glamp: 'Woodland Cabin', nights: 2, amount: 50000, status: 'confirmed' },
  ]

  const filteredBookings = bookings.filter(booking => {
    if (glampType !== 'all' && booking.glamp !== glampType) return false
    return true
  })

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.amount, 0)
  const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed').length
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Booking Report</h1>
          <p className="text-text-light mt-1">Comprehensive booking analytics and trends</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Bookings</p>
          <p className="font-serif text-3xl font-bold text-green">{filteredBookings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Confirmed</p>
          <p className="font-serif text-3xl font-bold text-green">{confirmedBookings}</p>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-green mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Glamp Type</label>
            <select
              value={glampType}
              onChange={(e) => setGlampType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            >
              <option value="all">All Glamps</option>
              <option value="Luxury Safari Tent">Luxury Safari Tent</option>
              <option value="Geodesic Dome">Geodesic Dome</option>
              <option value="Treehouse Suite">Treehouse Suite</option>
              <option value="Woodland Cabin">Woodland Cabin</option>
            </select>
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
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Guest</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Glamp</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Nights</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <span className="font-medium text-yellow">{booking.id}</span>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{booking.date}</td>
                  <td className="py-4 px-6 text-text-dark font-medium">{booking.guest}</td>
                  <td className="py-4 px-6 text-text-light text-sm">{booking.email}</td>
                  <td className="py-4 px-6 text-text-dark">{booking.glamp}</td>
                  <td className="py-4 px-6 text-text-dark">{booking.nights}</td>
                  <td className="py-4 px-6 font-semibold text-green">PKR {booking.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {booking.status}
                    </span>
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
