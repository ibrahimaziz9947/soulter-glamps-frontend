'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/src/services/apiClient'

interface Event {
  id: string
  type: string
  description: string
  performedBy: string | { name?: string; email?: string }
  byUser?: { name?: string; email?: string }
  timestamp: string
  metadata?: any
}

interface Expense {
  id: string
  title: string
  category: string | { id: string; name: string }
  amount: number
  date: string
  description?: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  
  // Audit fields - can be objects with name/email
  createdBy?: string | { id?: string; name?: string; email?: string }
  createdAt?: string
  updatedAt?: string
  
  // Approval metadata - can be objects with name/email
  submittedAt?: string
  submittedBy?: string | { id?: string; name?: string; email?: string }
  approvedAt?: string
  approvedBy?: string | { id?: string; name?: string; email?: string }
  rejectedAt?: string
  rejectedBy?: string | { id?: string; name?: string; email?: string }
  rejectionReason?: string
  
  // Events timeline
  events?: Event[]
}

export default function ExpenseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const expenseId = params?.id as string | undefined

  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<number | null>(null)

  useEffect(() => {
    const fetchExpense = async () => {
      // Guard against undefined id
      if (!expenseId) {
        setError('Invalid expense ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        setErrorCode(null)

        const response = await apiClient<any>(`/finance/expenses/${expenseId}`, {
          method: 'GET',
        })

        console.log('[Expense Detail] API response:', response)

        // Handle different response structures safely
        let expenseData = null
        if (response?.success && response?.data) {
          // Format: { success: true, data: {...} }
          expenseData = response.data
        } else if (response?.data) {
          // Format: { data: {...} }
          expenseData = response.data
        } else if (response?.expense) {
          // Format: { expense: {...} }
          expenseData = response.expense
        } else if (response && typeof response === 'object' && response.id) {
          // Format: direct expense object
          expenseData = response
        }

        if (!expenseData || !expenseData.id) {
          throw new Error('Invalid expense data received from server')
        }

        setExpense(expenseData)
      } catch (err: any) {
        console.error('[Expense Detail] Failed to fetch:', err)
        const statusCode = err.statusCode || err.status || err.response?.status
        setErrorCode(statusCode)
        
        if (statusCode === 401) {
          setError('Authentication required. Please log in again.')
        } else if (statusCode === 403) {
          setError('You do not have permission to view this expense.')
        } else if (statusCode === 404) {
          setError('Expense not found. It may have been deleted.')
        } else {
          setError(err.message || 'Failed to load expense details')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchExpense()
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
              <h3 className="font-semibold text-red-800">
                {errorCode === 404 ? 'Expense Not Found' : 
                 errorCode === 403 ? 'Access Denied' :
                 errorCode === 401 ? 'Authentication Required' :
                 'Failed to load expense'}
              </h3>
              <p className="text-red-600 text-sm mt-1">{error || 'Expense not found'}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => router.push('/admin/finance/expenses')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
            >
              Back to Expenses
            </button>
            {errorCode === 401 && (
              <button 
                onClick={() => router.push('/admin/login')}
                className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition-smooth"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Get category name safely with null checks
  const categoryName = expense?.category 
    ? (typeof expense.category === 'string' 
        ? expense.category 
        : expense.category?.name || 'Uncategorized')
    : 'Uncategorized'
  
  // Sort events by timestamp (newest first) with safe array handling
  const sortedEvents = (expense?.events && Array.isArray(expense.events))
    ? [...expense.events].sort((a, b) => {
        try {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        } catch {
          return 0
        }
      })
    : []

  // Helper to safely extract user label from string or object
  const getUserLabel = (user: string | { name?: string; email?: string } | undefined | null): string => {
    if (!user) return '—'
    if (typeof user === 'string') return user
    return user.name || user.email || '—'
  }

  // Extract safe labels for rendering
  const createdByLabel = getUserLabel(expense?.createdBy)
  const submittedByLabel = getUserLabel(expense?.submittedBy)
  const approvedByLabel = getUserLabel(expense?.approvedBy)
  const rejectedByLabel = getUserLabel(expense?.rejectedBy)

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
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase ${
              expense.status === 'DRAFT' 
                ? 'bg-gray-200 text-gray-700' 
                : expense.status === 'SUBMITTED'
                ? 'bg-blue-100 text-blue-700'
                : expense.status === 'APPROVED' 
                ? 'bg-green/10 text-green' 
                : expense.status === 'REJECTED'
                ? 'bg-red-100 text-red-700'
                : 'bg-orange-100 text-orange-700'
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

          {/* Created By */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Created By</label>
            <p className="text-lg text-text-dark">{createdByLabel}</p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-text-light mb-2">Description</label>
            <p className="text-text-dark whitespace-pre-wrap">
              {expense.description || '—'}
            </p>
          </div>

          {/* Timestamps */}
          {expense.createdAt && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Created At</label>
              <p className="text-sm text-text-light">{new Date(expense.createdAt).toLocaleString()}</p>
            </div>
          )}

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

      {/* Approval Metadata Card */}
      {(expense?.submittedAt || expense?.approvedAt || expense?.rejectedAt) && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-serif font-bold text-green mb-6">Approval History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Submitted */}
            {expense?.submittedAt && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-light mb-2">Submitted At</label>
                  <p className="text-text-dark">{new Date(expense.submittedAt).toLocaleString()}</p>
                </div>
                {expense?.submittedBy && (
                  <div>
                    <label className="block text-sm font-semibold text-text-light mb-2">Submitted By</label>
                    <p className="text-text-dark">{submittedByLabel}</p>
                  </div>
                )}
              </>
            )}

            {/* Approved */}
            {expense?.approvedAt && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-light mb-2">Approved At</label>
                  <p className="text-text-dark">{new Date(expense.approvedAt).toLocaleString()}</p>
                </div>
                {expense?.approvedBy && (
                  <div>
                    <label className="block text-sm font-semibold text-text-light mb-2">Approved By</label>
                    <p className="text-text-dark">{approvedByLabel}</p>
                  </div>
                )}
              </>
            )}

            {/* Rejected */}
            {expense?.rejectedAt && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-light mb-2">Rejected At</label>
                  <p className="text-text-dark">{new Date(expense.rejectedAt).toLocaleString()}</p>
                </div>
                {expense?.rejectedBy && (
                  <div>
                    <label className="block text-sm font-semibold text-text-light mb-2">Rejected By</label>
                    <p className="text-text-dark">{rejectedByLabel}</p>
                  </div>
                )}
                {expense?.rejectionReason && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-light mb-2">Rejection Reason</label>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">{expense.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Events Timeline */}
      {sortedEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-serif font-bold text-green mb-6">Activity Timeline</h2>
          <div className="space-y-4">
            {sortedEvents.map((event, index) => (
              <div key={event.id || index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    event.type === 'CREATED' ? 'bg-gray-400' :
                    event.type === 'SUBMITTED' ? 'bg-blue-500' :
                    event.type === 'APPROVED' ? 'bg-green' :
                    event.type === 'REJECTED' ? 'bg-red-500' :
                    event.type === 'UPDATED' ? 'bg-yellow' :
                    'bg-gray-400'
                  }`}></div>
                  {index < sortedEvents.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-text-dark">{event.description}</p>
                      <p className="text-sm text-text-light mt-1">
                        by {getUserLabel(event.byUser || event.performedBy)}
                      </p>
                    </div>
                    <span className="text-xs text-text-light whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Event metadata */}
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-2 bg-gray-50 rounded p-3 text-sm">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium text-text-light">{key}:</span>
                          <span className="text-text-dark">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
