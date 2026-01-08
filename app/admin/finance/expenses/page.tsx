'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/src/services/apiClient'

interface Expense {
  id: string
  name: string
  category: string
  amount: number
  date: string
  addedBy: string
  status: string
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ExpensesResponse {
  expenses: Expense[]
  pagination: PaginationMeta
  totalAmount: number
  approvedCount: number
  pendingCount: number
}

export default function ExpensesPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)

  // Add expense modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Category mapping to IDs
  const categoryMap: Record<string, string> = {
    'Food & Beverage': 'food-beverage',
    'Utilities': 'utilities',
    'Housekeeping': 'housekeeping',
    'Transportation': 'transportation',
    'Maintenance': 'maintenance',
    'Marketing': 'marketing'
  }

  const categories = ['all', 'Food & Beverage', 'Utilities', 'Housekeeping', 'Transportation', 'Maintenance', 'Marketing']

  // Fetch expenses from API with filters and pagination
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query params
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', '10')
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim())
        }
        
        if (filter !== 'all') {
          const categoryId = categoryMap[filter]
          if (categoryId) {
            params.append('categoryId', categoryId)
          }
        }

        const response = await apiClient<ExpensesResponse>(`/finance/expenses?${params.toString()}`, {
          method: 'GET',
        })

        setExpenses(response.expenses || [])
        setPagination(response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
        setTotalExpenses(response.totalAmount || 0)
        setApprovedCount(response.approvedCount || 0)
        setPendingCount(response.pendingCount || 0)
      } catch (err: any) {
        console.error('Failed to fetch expenses:', err)
        setError(err.message || 'Failed to load expenses')
      } finally {
        setLoading(false)
      }
    }

    // Debounce search input
    const timeoutId = setTimeout(() => {
      fetchExpenses()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [page, searchQuery, filter])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, filter])

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1)
    }
  }

  const handleOpenAddModal = () => {
    setShowAddModal(true)
    setFormData({ title: '', amount: '', category: '', description: '' })
    setFormError(null)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setFormData({ title: '', amount: '', category: '', description: '' })
    setFormError(null)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.trim()) {
      setFormError('Title is required')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setFormError('Valid amount is required')
      return
    }
    if (!formData.category) {
      setFormError('Category is required')
      return
    }

    try {
      setSubmitting(true)
      setFormError(null)

      const payload = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        categoryId: categoryMap[formData.category],
        description: formData.description.trim() || undefined
      }

      await apiClient('/finance/expenses', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      // Success - close modal and refetch
      handleCloseAddModal()
      setPage(1)
      
      // Refetch expenses
      const params = new URLSearchParams()
      params.append('page', '1')
      params.append('limit', '10')
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      
      if (filter !== 'all') {
        const categoryId = categoryMap[filter]
        if (categoryId) {
          params.append('categoryId', categoryId)
        }
      }

      const response = await apiClient<ExpensesResponse>(`/finance/expenses?${params.toString()}`, {
        method: 'GET',
      })

      setExpenses(response.expenses || [])
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
      setTotalExpenses(response.totalAmount || 0)
      setApprovedCount(response.approvedCount || 0)
      setPendingCount(response.pendingCount || 0)
    } catch (err: any) {
      console.error('Failed to add expense:', err)
      setFormError(err.message || 'Failed to add expense. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow border-t-transparent"></div>
            <p className="mt-4 text-text-light">Loading expenses...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">Failed to load expenses</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Daily Expenses</h1>
          <p className="text-text-light mt-1">Track and manage operational expenses</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
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
          <p className="font-serif text-3xl font-bold text-green">{approvedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Pending Approval</p>
          <p className="font-serif text-3xl font-bold text-yellow">{pendingCount}</p>
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
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-light">
                    No expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
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

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-text-light">
              Showing {expenses.length > 0 ? ((pagination.page - 1) * pagination.limit + 1) : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} expenses
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  pagination.page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-text-dark">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.page === pagination.totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  pagination.page === pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl font-bold text-green">Add New Expense</h2>
                <button
                  onClick={handleCloseAddModal}
                  className="text-text-light hover:text-text-dark transition-smooth"
                  disabled={submitting}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitExpense} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{formError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                    placeholder="e.g., Office Supplies"
                    disabled={submitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Amount (PKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={submitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                    disabled={submitting}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.filter(cat => cat !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent resize-none"
                    placeholder="Optional notes..."
                    rows={3}
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-text-dark hover:bg-gray-50 transition-smooth"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-yellow text-green rounded-lg font-semibold hover:bg-yellow-light transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? 'Adding...' : 'Add Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
