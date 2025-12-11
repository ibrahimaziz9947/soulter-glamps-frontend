'use client'

import { useState } from 'react'

export default function IncomePage() {
  const [filterMonth, setFilterMonth] = useState('all')

  // Mock income data
  const incomeEntries = [
    { id: 'INC-001', source: 'Booking Payment', customer: 'Sarah Johnson', bookingId: 'BK-001', amount: 75000, date: '2025-12-04', method: 'EasyPaisa', status: 'received' },
    { id: 'INC-002', source: 'Booking Payment', customer: 'Michael Chen', bookingId: 'BK-002', amount: 50000, date: '2025-12-03', method: 'Manual', status: 'pending' },
    { id: 'INC-003', source: 'Booking Payment', customer: 'Emily Davis', bookingId: 'BK-003', amount: 75000, date: '2025-12-02', method: 'EasyPaisa', status: 'received' },
    { id: 'INC-004', source: 'Event Booking', customer: 'Corporate Event - Tech Co', bookingId: 'EVT-001', amount: 250000, date: '2025-12-01', method: 'Bank Transfer', status: 'received' },
    { id: 'INC-005', source: 'Booking Payment', customer: 'Robert Wilson', bookingId: 'BK-004', amount: 62500, date: '2025-11-30', method: 'EasyPaisa', status: 'received' },
    { id: 'INC-006', source: 'Additional Services', customer: 'Lisa Anderson', bookingId: 'BK-005', amount: 15000, date: '2025-11-29', method: 'Cash', status: 'received' },
    { id: 'INC-007', source: 'Booking Payment', customer: 'James Martinez', bookingId: 'BK-006', amount: 50000, date: '2025-11-28', method: 'Manual', status: 'received' },
    { id: 'INC-008', source: 'Package Deal', customer: 'Patricia Lee', bookingId: 'PKG-001', amount: 150000, date: '2025-11-27', method: 'Bank Transfer', status: 'received' },
  ]

  const filteredIncome = incomeEntries.filter(entry => {
    if (filterMonth === 'all') return true
    const entryMonth = new Date(entry.date).getMonth()
    return entryMonth === parseInt(filterMonth)
  })

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0)
  const receivedIncome = incomeEntries.filter(e => e.status === 'received').reduce((sum, e) => sum + e.amount, 0)
  const pendingIncome = incomeEntries.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Income Tracking</h1>
          <p className="text-text-light mt-1">Monitor all revenue streams and income sources</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Income
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-text-light text-sm">Total Income</p>
              <p className="font-serif text-2xl font-bold text-green">PKR {totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-text-light text-sm">Received</p>
              <p className="font-serif text-2xl font-bold text-green">PKR {receivedIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-text-light text-sm">Pending</p>
              <p className="font-serif text-2xl font-bold text-yellow">PKR {pendingIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-text-dark">Filter by Month:</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
          >
            <option value="all">All Months</option>
            <option value="11">December 2025</option>
            <option value="10">November 2025</option>
            <option value="9">October 2025</option>
          </select>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Income ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Source</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Customer/Event</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Reference</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Method</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncome.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-light">
                    No income entries found
                  </td>
                </tr>
              ) : (
                filteredIncome.map((income) => (
                  <tr key={income.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6">
                      <span className="font-medium text-yellow">{income.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green/10 text-green">
                        {income.source}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-dark">{income.customer}</td>
                    <td className="py-4 px-6 text-text-light text-sm">{income.bookingId}</td>
                    <td className="py-4 px-6 font-semibold text-green">PKR {income.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-text-light text-sm">{income.date}</td>
                    <td className="py-4 px-6 text-text-dark">{income.method}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        income.status === 'received' 
                          ? 'bg-green/10 text-green' 
                          : 'bg-yellow/10 text-yellow'
                      }`}>
                        {income.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
