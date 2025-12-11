'use client'

import { useState } from 'react'

export default function StaffPayablesPage() {
  const [filterStatus, setFilterStatus] = useState('all')

  const payables = [
    { id: 1, staffName: 'Ahmad Khan', role: 'Manager', salary: 65000, bonuses: 5000, deductions: 0, netPayable: 70000, month: 'December 2025', status: 'pending' },
    { id: 2, staffName: 'Sara Ahmed', role: 'Receptionist', salary: 45000, bonuses: 3000, deductions: 0, netPayable: 48000, month: 'December 2025', status: 'pending' },
    { id: 3, staffName: 'Hassan Ali', role: 'Maintenance', salary: 38000, bonuses: 2000, deductions: 500, netPayable: 39500, month: 'December 2025', status: 'pending' },
    { id: 4, staffName: 'Fatima Malik', role: 'Housekeeper', salary: 32000, bonuses: 1500, deductions: 0, netPayable: 33500, month: 'December 2025', status: 'pending' },
    { id: 5, staffName: 'Usman Shah', role: 'Chef', salary: 55000, bonuses: 4000, deductions: 0, netPayable: 59000, month: 'December 2025', status: 'paid' },
    { id: 6, staffName: 'Ayesha Siddiqui', role: 'Housekeeper', salary: 32000, bonuses: 1000, deductions: 0, netPayable: 33000, month: 'December 2025', status: 'paid' },
  ]

  const filteredPayables = filterStatus === 'all' 
    ? payables 
    : payables.filter(p => p.status === filterStatus)

  const totalPayables = filteredPayables.reduce((sum, p) => sum + p.netPayable, 0)
  const pendingPayables = payables.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netPayable, 0)
  const paidPayables = payables.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netPayable, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Staff Payables</h1>
          <p className="text-text-light mt-1">Manage staff salaries and payables</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Process All Payments
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Payables</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalPayables.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Pending</p>
          <p className="font-serif text-3xl font-bold text-orange-500">PKR {pendingPayables.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Paid</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {paidPayables.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-green mb-4">Filter by Status</h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
        >
          <option value="all">All Payables</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Payables Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Staff Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Base Salary</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Bonuses</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Deductions</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Net Payable</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayables.map((payable) => (
                <tr key={payable.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <span className="font-medium text-yellow">#{payable.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center text-white font-bold">
                        {payable.staffName.charAt(0)}
                      </div>
                      <span className="font-medium text-text-dark">{payable.staffName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{payable.role}</td>
                  <td className="py-4 px-6 text-green font-semibold">PKR {payable.salary.toLocaleString()}</td>
                  <td className="py-4 px-6 text-green">PKR {payable.bonuses.toLocaleString()}</td>
                  <td className="py-4 px-6 text-red-500">{payable.deductions > 0 ? `PKR ${payable.deductions.toLocaleString()}` : '-'}</td>
                  <td className="py-4 px-6 font-bold text-green">PKR {payable.netPayable.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      payable.status === 'paid' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-orange-50 text-orange-600'
                    }`}>
                      {payable.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {payable.status === 'pending' && (
                      <button className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green-dark transition-smooth text-sm font-semibold">
                        Mark Paid
                      </button>
                    )}
                    {payable.status === 'paid' && (
                      <button className="px-4 py-2 border border-gray-300 text-text-dark rounded-lg hover:bg-cream transition-smooth text-sm">
                        View Receipt
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
