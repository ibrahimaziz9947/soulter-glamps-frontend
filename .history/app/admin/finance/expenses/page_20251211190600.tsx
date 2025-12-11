'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ExpensesPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock expense data
  const expenses = [
    { id: 'EXP-001', name: 'Food Supplies - Fresh Vegetables', category: 'Food & Beverage', amount: 12500, date: '2025-12-04', addedBy: 'Ahmad Khan', status: 'approved' },
    { id: 'EXP-002', name: 'Electricity Bill - November', category: 'Utilities', amount: 8900, date: '2025-12-03', addedBy: 'Sara Ahmed', status: 'approved' },
    { id: 'EXP-003', name: 'Cleaning Supplies', category: 'Housekeeping', amount: 4500, date: '2025-12-03', addedBy: 'Fatima Ali', status: 'approved' },
    { id: 'EXP-004', name: 'Vehicle Fuel', category: 'Transportation', amount: 6200, date: '2025-12-02', addedBy: 'Hassan Raza', status: 'pending' },
    { id: 'EXP-005', name: 'Internet & WiFi - Monthly', category: 'Utilities', amount: 3500, date: '2025-12-02', addedBy: 'Ahmad Khan', status: 'approved' },
    { id: 'EXP-006', name: 'Maintenance - Plumbing Repair', category: 'Maintenance', amount: 15000, date: '2025-12-01', addedBy: 'Hassan Raza', status: 'approved' },
    { id: 'EXP-007', name: 'Toiletries & Amenities', category: 'Housekeeping', amount: 8700, date: '2025-12-01', addedBy: 'Fatima Ali', status: 'approved' },
    { id: 'EXP-008', name: 'Marketing - Social Media Ads', category: 'Marketing', amount: 25000, date: '2025-11-30', addedBy: 'Sara Ahmed', status: 'approved' },
  ]

  const filteredExpenses = expenses.filter(expense => {
    if (filter !== 'all' && expense.category !== filter) return false
    if (searchQuery && !expense.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const categories = ['all', 'Food & Beverage', 'Utilities', 'Housekeeping', 'Transportation', 'Maintenance', 'Marketing']

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Daily Expenses</h1>
          <p className="text-text-light mt-1">Track and manage operational expenses</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Expenses (This Month)</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Approved Expenses</p>
          <p className="font-serif text-3xl font-bold text-green">{expenses.filter(e => e.status === 'approved').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Pending Approval</p>
          <p className="font-serif text-3xl font-bold text-yellow">{expenses.filter(e => e.status === 'pending').length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
              />
              <svg className="w-5 h-5 text-text-light absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth capitalize ${
                  filter === category
                    ? 'bg-yellow text-green'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Expense ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Expense Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Added By</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-light">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6">
                      <span className="font-medium text-yellow">{expense.id}</span>
                    </td>
                    <td className="py-4 px-6 text-text-dark">{expense.name}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cream text-text-dark">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-red-500">PKR {expense.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-text-light text-sm">{expense.date}</td>
                    <td className="py-4 px-6 text-text-dark">{expense.addedBy}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        expense.status === 'approved' 
                          ? 'bg-green/10 text-green' 
                          : 'bg-yellow/10 text-yellow'
                      }`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                          title="View"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
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
      </div>
    </div>
  )
}
