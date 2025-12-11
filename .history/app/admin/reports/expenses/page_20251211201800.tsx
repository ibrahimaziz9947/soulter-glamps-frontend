'use client'

import { useState } from 'react'

export default function ExpensesReportPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock expense data by category
  const expensesByCategory = [
    { category: 'Food & Beverage', amount: 145000, transactions: 24, percentage: 8.6, color: 'bg-orange-500' },
    { category: 'Utilities', amount: 78000, transactions: 12, percentage: 4.6, color: 'bg-blue-500' },
    { category: 'Housekeeping', amount: 56000, transactions: 18, percentage: 3.3, color: 'bg-purple-500' },
    { category: 'Maintenance', amount: 125000, transactions: 15, percentage: 7.4, color: 'bg-red-500' },
    { category: 'Transportation', amount: 45000, transactions: 8, percentage: 2.7, color: 'bg-yellow' },
    { category: 'Marketing', amount: 85000, transactions: 6, percentage: 5.1, color: 'bg-pink-500' },
    { category: 'Salaries', amount: 450000, transactions: 24, percentage: 26.8, color: 'bg-green' },
    { category: 'Administrative', amount: 32000, transactions: 10, percentage: 1.9, color: 'bg-gray-500' },
  ]

  const detailedExpenses = [
    { id: 'EXP-001', date: '2025-12-04', category: 'Food & Beverage', description: 'Fresh vegetables and fruits', amount: 12500, status: 'approved' },
    { id: 'EXP-002', date: '2025-12-04', category: 'Utilities', description: 'Electricity bill - December', amount: 18500, status: 'approved' },
    { id: 'EXP-003', date: '2025-12-03', category: 'Housekeeping', description: 'Cleaning supplies restock', amount: 8500, status: 'approved' },
    { id: 'EXP-004', date: '2025-12-03', category: 'Maintenance', description: 'AC unit repair - Dome', amount: 25000, status: 'approved' },
    { id: 'EXP-005', date: '2025-12-02', category: 'Transportation', description: 'Fuel and vehicle maintenance', amount: 9500, status: 'pending' },
    { id: 'EXP-006', date: '2025-12-02', category: 'Marketing', description: 'Social media advertising', amount: 15000, status: 'approved' },
    { id: 'EXP-007', date: '2025-12-01', category: 'Salaries', description: 'Staff salaries - December', amount: 150000, status: 'approved' },
    { id: 'EXP-008', date: '2025-12-01', category: 'Administrative', description: 'Office supplies', amount: 4500, status: 'approved' },
  ]

  const filteredExpenses = selectedCategory === 'all' 
    ? detailedExpenses 
    : detailedExpenses.filter(exp => exp.category === selectedCategory)

  const totalExpenses = expensesByCategory.reduce((sum, cat) => sum + cat.amount, 0)
  const totalTransactions = expensesByCategory.reduce((sum, cat) => sum + cat.transactions, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Expense Report</h1>
          <p className="text-text-light mt-1">Detailed expense analysis by category</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Expenses</p>
          <p className="font-serif text-3xl font-bold text-red-500">PKR {totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Transactions</p>
          <p className="font-serif text-3xl font-bold text-green">{totalTransactions}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Categories</p>
          <p className="font-serif text-3xl font-bold text-green">{expensesByCategory.length}</p>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Expenses by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expensesByCategory.map((category) => (
            <div key={category.category} className="p-4 bg-cream rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                  <span className="font-medium text-text-dark">{category.category}</span>
                </div>
                <span className="text-sm font-semibold text-text-light">{category.percentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-2xl font-bold text-red-500">PKR {category.amount.toLocaleString()}</p>
                  <p className="text-sm text-text-light">{category.transactions} transactions</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-green mb-4">Filter by Category</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {expensesByCategory.map((cat) => (
            <option key={cat.category} value={cat.category}>{cat.category}</option>
          ))}
        </select>
      </div>

      {/* Detailed Expenses Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-serif text-2xl font-bold text-green">Detailed Expense Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Expense ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Description</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <span className="font-medium text-yellow">{expense.id}</span>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{expense.date}</td>
                  <td className="py-4 px-6 text-text-dark">{expense.category}</td>
                  <td className="py-4 px-6 text-text-dark">{expense.description}</td>
                  <td className="py-4 px-6 font-semibold text-red-500">PKR {expense.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      expense.status === 'approved' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-yellow/10 text-yellow'
                    }`}>
                      {expense.status}
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
