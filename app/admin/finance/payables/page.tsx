'use client'

import { useState } from 'react'

export default function PayablesPage() {
  const [filter, setFilter] = useState('all')

  // Mock payables data
  const payables = [
    { id: 'PAY-001', staffName: 'Ahmad Khan', role: 'Head Chef', amountDue: 65000, dueDate: '2025-12-05', status: 'pending', month: 'December 2025' },
    { id: 'PAY-002', staffName: 'Sara Ahmed', role: 'Operations Manager', amountDue: 75000, dueDate: '2025-12-05', status: 'pending', month: 'December 2025' },
    { id: 'PAY-003', staffName: 'Fatima Ali', role: 'Housekeeper', amountDue: 35000, dueDate: '2025-12-05', status: 'pending', month: 'December 2025' },
    { id: 'PAY-004', staffName: 'Hassan Raza', role: 'Maintenance Staff', amountDue: 40000, dueDate: '2025-12-05', status: 'pending', month: 'December 2025' },
    { id: 'PAY-005', staffName: 'Zainab Malik', role: 'Receptionist', amountDue: 38000, dueDate: '2025-12-05', status: 'pending', month: 'December 2025' },
    { id: 'PAY-006', staffName: 'Usman Ali', role: 'Security Guard', amountDue: 32000, dueDate: '2025-12-05', status: 'pending', month: 'December 2025' },
    { id: 'PAY-007', staffName: 'Ahmad Khan', role: 'Head Chef', amountDue: 65000, dueDate: '2025-11-05', status: 'paid', month: 'November 2025' },
    { id: 'PAY-008', staffName: 'Sara Ahmed', role: 'Operations Manager', amountDue: 75000, dueDate: '2025-11-05', status: 'paid', month: 'November 2025' },
  ]

  const filteredPayables = payables.filter(payable => {
    if (filter === 'all') return true
    return payable.status === filter
  })

  const totalDue = payables.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amountDue, 0)
  const totalPaid = payables.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amountDue, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Staff Payables</h1>
          <p className="text-text-light mt-1">Track and manage staff salary payments</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Process Payments
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-text-light text-sm">Pending Payables</p>
              <p className="font-serif text-2xl font-bold text-orange-500">PKR {totalDue.toLocaleString()}</p>
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
              <p className="text-text-light text-sm">Paid This Month</p>
              <p className="font-serif text-2xl font-bold text-green">PKR {totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-text-light text-sm">Staff Members</p>
              <p className="font-serif text-2xl font-bold text-green">{new Set(payables.map(p => p.staffName)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'paid'].map((status) => (
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

      {/* Payables Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Payable ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Staff Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Month</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount Due</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Due Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayables.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-light">
                    No payables found
                  </td>
                </tr>
              ) : (
                filteredPayables.map((payable) => (
                  <tr key={payable.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6">
                      <span className="font-medium text-yellow">{payable.id}</span>
                    </td>
                    <td className="py-4 px-6 font-medium text-text-dark">{payable.staffName}</td>
                    <td className="py-4 px-6 text-text-light">{payable.role}</td>
                    <td className="py-4 px-6 text-text-dark text-sm">{payable.month}</td>
                    <td className="py-4 px-6 font-semibold text-green">PKR {payable.amountDue.toLocaleString()}</td>
                    <td className="py-4 px-6 text-text-light text-sm">{payable.dueDate}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        payable.status === 'paid' 
                          ? 'bg-green/10 text-green' 
                          : 'bg-orange-50 text-orange-500'
                      }`}>
                        {payable.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {payable.status === 'pending' && (
                          <button 
                            className="px-3 py-1 bg-green text-white rounded-lg text-sm font-semibold hover:bg-green-dark transition-smooth"
                            title="Mark as Paid"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button 
                          className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
      </div>

      {/* Upcoming Payments Alert */}
      {payables.filter(p => p.status === 'pending').length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">Upcoming Salary Payments</h3>
              <p className="text-orange-700 text-sm">
                You have {payables.filter(p => p.status === 'pending').length} pending salary payments totaling PKR {totalDue.toLocaleString()}. 
                Please ensure funds are available for processing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
