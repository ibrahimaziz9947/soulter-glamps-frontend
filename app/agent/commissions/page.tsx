'use client'

import { useState } from 'react'

export default function AgentCommissions() {
  const [filterStatus, setFilterStatus] = useState('all')

  const commissions = [
    { id: 1, bookingId: 'BK-2401', customer: 'Ali Hassan', glamping: 'Luxury Tent', bookingDate: '2025-11-20', checkIn: '2025-12-15', bookingAmount: 'PKR 25,000', commissionRate: '10%', commissionAmount: 'PKR 2,500', status: 'Paid', paidDate: '2025-12-01' },
    { id: 2, bookingId: 'BK-2402', customer: 'Sara Ahmed', glamping: 'Tree House', bookingDate: '2025-11-22', checkIn: '2025-12-18', bookingAmount: 'PKR 32,000', commissionRate: '10%', commissionAmount: 'PKR 3,200', status: 'Pending', paidDate: null },
    { id: 3, bookingId: 'BK-2403', customer: 'Usman Khan', glamping: 'Safari Tent', bookingDate: '2025-11-25', checkIn: '2025-12-20', bookingAmount: 'PKR 28,000', commissionRate: '10%', commissionAmount: 'PKR 2,800', status: 'Paid', paidDate: '2025-12-03' },
    { id: 4, bookingId: 'BK-2404', customer: 'Fatima Noor', glamping: 'Dome Tent', bookingDate: '2025-11-28', checkIn: '2025-12-25', bookingAmount: 'PKR 30,000', commissionRate: '10%', commissionAmount: 'PKR 3,000', status: 'Paid', paidDate: '2025-12-04' },
    { id: 5, bookingId: 'BK-2405', customer: 'Ahmed Malik', glamping: 'Cabin', bookingDate: '2025-12-01', checkIn: '2025-12-28', bookingAmount: 'PKR 35,000', commissionRate: '10%', commissionAmount: 'PKR 3,500', status: 'Pending', paidDate: null },
    { id: 6, bookingId: 'BK-2301', customer: 'Hassan Ali', glamping: 'Luxury Tent', bookingDate: '2025-10-15', checkIn: '2025-11-10', bookingAmount: 'PKR 24,000', commissionRate: '10%', commissionAmount: 'PKR 2,400', status: 'Paid', paidDate: '2025-11-20' },
  ]

  const filteredCommissions = filterStatus === 'all'
    ? commissions
    : commissions.filter(c => c.status.toLowerCase() === filterStatus)

  const totalEarned = commissions
    .filter(c => c.status === 'Paid')
    .reduce((sum, c) => sum + parseFloat(c.commissionAmount.replace(/[^\d]/g, '')), 0)

  const totalPending = commissions
    .filter(c => c.status === 'Pending')
    .reduce((sum, c) => sum + parseFloat(c.commissionAmount.replace(/[^\d]/g, '')), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green mb-2">Commission History</h1>
        <p className="text-text-light">Track all your commission earnings</p>
      </div>

      {/* Total Commission Summary Card */}
      <div className="bg-gradient-to-r from-green to-green-dark rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cream/80 text-lg mb-2">Total Commission Earned</p>
            <p className="text-5xl font-bold mb-4">PKR {totalEarned.toLocaleString()}</p>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-cream/70">Pending: </span>
                <span className="font-bold text-yellow">PKR {totalPending.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-cream/70">Total Bookings: </span>
                <span className="font-bold">{commissions.length}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-6xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-text-dark">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
            >
              <option value="all">All Commissions</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <button className="px-6 py-2 bg-green text-cream rounded-lg font-semibold hover:bg-green-dark transition-smooth">
            📥 Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50 border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Booking ID</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Commission %</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Earned Amount</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Status</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map((commission) => (
                <tr key={commission.id} className="border-b border-gray-100 hover:bg-cream/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-green text-lg">{commission.bookingId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-text-dark">{commission.commissionRate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-yellow text-lg">{commission.commissionAmount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                      commission.status === 'Paid' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-yellow/20 text-yellow'
                    }`}>
                      {commission.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="font-medium text-text-dark">{commission.paidDate || commission.bookingDate}</div>
                      <div className="text-xs text-text-light">{commission.paidDate ? 'Paid on' : 'Booked on'}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCommissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-light text-lg">No commissions found</p>
          </div>
        )}
      </div>

      {/* Commission Info */}
      <div className="bg-yellow/10 border border-yellow rounded-lg p-6">
        <h3 className="font-bold text-green mb-3">📌 Commission Policy</h3>
        <ul className="space-y-2 text-sm text-text-dark">
          <li>✓ Standard commission rate: <strong>10%</strong> of booking amount</li>
          <li>✓ Commissions are paid within <strong>7 days</strong> after customer check-in</li>
          <li>✓ Cancelled bookings do not earn commission</li>
          <li>✓ Payment is processed via bank transfer to your registered account</li>
        </ul>
      </div>
    </div>
  )
}
