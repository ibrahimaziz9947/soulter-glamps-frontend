'use client'

import { useState } from 'react'

export default function CommissionPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock commission data
  const commissions = [
    { id: 1, agentName: 'Ali Raza', agentEmail: 'ali@agent.com', bookings: 12, totalRevenue: 300000, commissionRate: 10, commissionAmount: 30000, status: 'pending', period: 'November 2025' },
    { id: 2, agentName: 'Ayesha Khan', agentEmail: 'ayesha@agent.com', bookings: 9, totalRevenue: 225000, commissionRate: 10, commissionAmount: 22500, status: 'pending', period: 'November 2025' },
    { id: 3, agentName: 'Bilal Ahmed', agentEmail: 'bilal@agent.com', bookings: 15, totalRevenue: 375000, commissionRate: 10, commissionAmount: 37500, status: 'paid', period: 'October 2025' },
    { id: 4, agentName: 'Sana Malik', agentEmail: 'sana@agent.com', bookings: 8, totalRevenue: 200000, commissionRate: 10, commissionAmount: 20000, status: 'pending', period: 'November 2025' },
    { id: 5, agentName: 'Zainab Noor', agentEmail: 'zainab@agent.com', bookings: 11, totalRevenue: 275000, commissionRate: 10, commissionAmount: 27500, status: 'paid', period: 'October 2025' },
    { id: 6, agentName: 'Kamran Shah', agentEmail: 'kamran@agent.com', bookings: 6, totalRevenue: 150000, commissionRate: 10, commissionAmount: 15000, status: 'processing', period: 'November 2025' },
  ]

  const filteredCommissions = statusFilter === 'all' 
    ? commissions 
    : commissions.filter(c => c.status === statusFilter)

  const totalCommissions = commissions.reduce((sum, c) => sum + c.commissionAmount, 0)
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0)
  const paidCommissions = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0)
  const processingCommissions = commissions.filter(c => c.status === 'processing').reduce((sum, c) => sum + c.commissionAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Agent Commissions</h1>
          <p className="text-text-light mt-1">Manage agent commission payments</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Process All Pending
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Commissions</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalCommissions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Pending</p>
          <p className="font-serif text-3xl font-bold text-orange-500">PKR {pendingCommissions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Processing</p>
          <p className="font-serif text-3xl font-bold text-yellow">PKR {processingCommissions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Paid</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {paidCommissions.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-green mb-4">Filter by Status</h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
        >
          <option value="all">All Commissions</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Agent</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Period</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Bookings</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Total Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Rate</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Commission</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map((commission) => (
                <tr key={commission.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <span className="font-medium text-yellow">#{commission.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-text-dark">{commission.agentName}</p>
                      <p className="text-sm text-text-light">{commission.agentEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-dark">{commission.period}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-yellow/10 text-yellow rounded-full font-semibold">
                      {commission.bookings}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-green">PKR {commission.totalRevenue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-text-dark">{commission.commissionRate}%</td>
                  <td className="py-4 px-6 font-bold text-green">PKR {commission.commissionAmount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      commission.status === 'paid' 
                        ? 'bg-green/10 text-green' 
                        : commission.status === 'processing'
                        ? 'bg-yellow/10 text-yellow'
                        : 'bg-orange-50 text-orange-600'
                    }`}>
                      {commission.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {commission.status === 'pending' && (
                      <button className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green-dark transition-smooth text-sm font-semibold">
                        Process
                      </button>
                    )}
                    {commission.status === 'processing' && (
                      <button className="px-4 py-2 bg-yellow text-green rounded-lg hover:bg-yellow-light transition-smooth text-sm font-semibold">
                        Mark Paid
                      </button>
                    )}
                    {commission.status === 'paid' && (
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}
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
