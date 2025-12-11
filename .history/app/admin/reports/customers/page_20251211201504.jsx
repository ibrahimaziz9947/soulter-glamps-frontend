'use client'

import { useState } from 'react'

export default function CustomersReportPage() {
  const [sortBy, setSortBy] = useState('revenue')

  // Mock customer data
  const customers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+92-300-1234567', totalBookings: 5, totalRevenue: 375000, lastBooking: '2025-12-04', status: 'active' },
    { id: 2, name: 'Michael Chen', email: 'michael@email.com', phone: '+92-321-7654321', totalBookings: 4, totalRevenue: 300000, lastBooking: '2025-12-03', status: 'active' },
    { id: 3, name: 'Emily Davis', email: 'emily@email.com', phone: '+92-333-9876543', totalBookings: 4, totalRevenue: 300000, lastBooking: '2025-12-02', status: 'active' },
    { id: 4, name: 'Robert Wilson', email: 'robert@email.com', phone: '+92-345-1122334', totalBookings: 3, totalRevenue: 225000, lastBooking: '2025-12-01', status: 'active' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@email.com', phone: '+92-300-5566778', totalBookings: 3, totalRevenue: 225000, lastBooking: '2025-11-30', status: 'inactive' },
    { id: 6, name: 'James Martinez', email: 'james@email.com', phone: '+92-321-9988776', totalBookings: 3, totalRevenue: 225000, lastBooking: '2025-11-29', status: 'active' },
    { id: 7, name: 'Patricia Lee', email: 'patricia@email.com', phone: '+92-333-4455667', totalBookings: 2, totalRevenue: 150000, lastBooking: '2025-11-28', status: 'active' },
    { id: 8, name: 'David Brown', email: 'david@email.com', phone: '+92-345-7788990', totalBookings: 2, totalRevenue: 150000, lastBooking: '2025-11-27', status: 'active' },
  ]

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue
    if (sortBy === 'bookings') return b.totalBookings - a.totalBookings
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0)
  const totalBookings = customers.reduce((sum, c) => sum + c.totalBookings, 0)
  const avgRevenuePerCustomer = Math.round(totalRevenue / totalCustomers)

  const topCustomers = [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Customer Report</h1>
          <p className="text-text-light mt-1">Customer data and booking history analysis</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Customers</p>
          <p className="font-serif text-3xl font-bold text-green">{totalCustomers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Active Customers</p>
          <p className="font-serif text-3xl font-bold text-green">{activeCustomers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Bookings</p>
          <p className="font-serif text-3xl font-bold text-green">{totalBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Revenue</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Avg per Customer</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {avgRevenuePerCustomer.toLocaleString()}</p>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Top Customers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCustomers.map((customer, index) => (
            <div key={customer.id} className="p-6 bg-cream rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-green">{customer.name}</h3>
                  <p className="text-sm text-text-light">{customer.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-light text-sm">Bookings:</span>
                  <span className="font-semibold text-green">{customer.totalBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light text-sm">Revenue:</span>
                  <span className="font-semibold text-green">PKR {customer.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-green mb-4">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
        >
          <option value="revenue">Total Revenue (High to Low)</option>
          <option value="bookings">Total Bookings (High to Low)</option>
          <option value="name">Name (A to Z)</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Customer Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Phone</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Bookings</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Total Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Last Booking</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-medium text-text-dark">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{customer.email}</td>
                  <td className="py-4 px-6 text-text-light text-sm">{customer.phone}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-yellow/10 text-yellow rounded-full font-semibold">
                      {customer.totalBookings}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-green">PKR {customer.totalRevenue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-text-light text-sm">{customer.lastBooking}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      customer.status === 'active' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {customer.status}
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
