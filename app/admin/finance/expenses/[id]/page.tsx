'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/src/services/apiClient'

interface Expense {
  id: string
  title: string
  category: string | { id: string; name: string }
  amount: number
  date: string
  addedBy: string
  status: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export default function ExpenseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const expenseId = params.id as string

  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiClient<any>(`/finance/expenses/${expenseId}`, {
          method: 'GET',
        })

        console.log('[Expense Detail] API response:', response)

        // Handle different response structures
        let expenseData = null
        if (response.data) {
          expenseData = response.data
        } else if (response.expense) {
          expenseData = response.expense
        } else {
          expenseData = response
        }

        setExpense(expenseData)
      } catch (err: any) {
        console.error('[Expense Detail] Failed to fetch:', err)
        setError(err.message || 'Failed to load expense details')
      } finally {
        setLoading(false)
      }
    }

    if (expenseId) {
      fetchExpense()
    }
  }, [expenseId])

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow border-t-transparent"></div>
            <p className="mt-4 text-text-light">Loading expense details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !expense) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">Failed to load expense</h3>
              <p className="text-red-600 text-sm mt-1">{error || 'Expense not found'}</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/admin/finance/expenses')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
          >
            Back to Expenses
          </button>
        </div>
      </div>
    )
  }

  // Get category name
  const categoryName = typeof expense.category === 'string' 
    ? expense.category 
    : expense.category?.name || 'N/A'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Expense Details</h1>
          <p className="text-text-light mt-1">View expense information</p>
        </div>
        <button
          onClick={() => router.push('/admin/finance/expenses')}
          className="inline-flex items-center justify-center gap-2 bg-cream text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow/20 transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Expenses
        </button>
      </div>

      {/* Expense Details Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expense ID */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Expense ID</label>
            <p className="text-lg font-medium text-yellow">{expense.id}</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Status</label>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              expense.status === 'approved' 
                ? 'bg-green/10 text-green' 
                : 'bg-yellow/10 text-yellow'
            }`}>
              {expense.status}
            </span>
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-text-light mb-2">Title</label>
            <p className="text-xl font-serif font-bold text-green">{expense.title}</p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Amount</label>
            <p className="text-2xl font-bold text-red-500">PKR {expense.amount.toLocaleString()}</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Category</label>
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-cream text-text-dark">
              {categoryName}
            </span>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Date</label>
            <p className="text-lg text-text-dark">{expense.date}</p>
          </div>

          {/* Added By */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Added By</label>
            <p className="text-lg text-text-dark">{expense.addedBy}</p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-text-light mb-2">Description</label>
            <p className="text-text-dark whitespace-pre-wrap">
              {expense.description || '—'}
            </p>
          </div>

          {/* Timestamps if available */}
          {expense.createdAt && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Created At</label>
              <p className="text-sm text-text-light">{new Date(expense.createdAt).toLocaleString()}</p>
            </div>
          )}

          {expense.updatedAt && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Last Updated</label>
              <p className="text-sm text-text-light">{new Date(expense.updatedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/admin/finance/expenses')}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-text-dark hover:bg-gray-50 transition-smooth"
        >
          Back to List
        </button>
      </div>
    </div>
  )
}
