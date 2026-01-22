'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/src/services/apiClient'
import { formatMoney } from '@/src/utils/currency'

interface Event {
  id: string
  type: string
  description: string
  performedBy: string | { name?: string; email?: string }
  byUser?: { name?: string; email?: string }
  timestamp: string
  metadata?: any
}

interface Income {
  id: string
  source: string // BOOKING | MANUAL | OTHER
  status: string // DRAFT | CONFIRMED | CANCELLED | SUBMITTED
  amount: number // In cents
  currency: string // PKR | USD | EUR | GBP
  dateReceived?: string // ISO date string (YYYY-MM-DD)
  reference?: string
  notes?: string
  bookingId?: string
  booking?: {
    id: string
    bookingCode: string
    customerName?: string
    glampsiteName?: string
  }
  
  // Audit fields
  createdBy?: string | { id?: string; name?: string; email?: string }
  updatedBy?: string | { id?: string; name?: string; email?: string }
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  
  // Approval metadata
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

// Helper to safely extract user label from string or object
function getUserLabel(user: any): string {
  if (!user) return '—'
  if (typeof user === 'string') return user
  if (user.name) return user.name
  if (user.email) return user.email
  return '—'
}

// Helper to generate derived title
function getDerivedTitle(income: Income): string {
  let title = ''
  
  // Generate title based on source
  if (income.source === 'BOOKING') {
    title = 'Booking Income'
  } else if (income.source === 'MANUAL') {
    title = 'Manual Income'
  } else {
    title = 'Other Income'
  }
  
  // Append reference or booking info if available
  if (income.booking?.bookingCode) {
    title += ` — ${income.booking.bookingCode}`
    if (income.booking.customerName) {
      title += ` (${income.booking.customerName})`
    }
  } else if (income.reference) {
    title += ` — ${income.reference}`
  }
  
  return title
}

export default function IncomeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const incomeId = params?.id as string | undefined

  const [income, setIncome] = useState<Income | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  useEffect(() => {
    const fetchIncome = async () => {
      // Guard against undefined id
      if (!incomeId) {
        setError('Invalid income ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        setErrorCode(null)

        const response = await apiClient<any>(`/finance/income/${incomeId}`, {
          method: 'GET',
        })

        console.log('[Income Detail] API response:', response)

        // Handle different response structures safely
        let incomeData = null
        if (response?.success && response?.data) {
          incomeData = response.data
        } else if (response?.data) {
          incomeData = response.data
        } else if (response?.income) {
          incomeData = response.income
        } else if (response && typeof response === 'object' && response.id) {
          incomeData = response
        }

        if (!incomeData || !incomeData.id) {
          throw new Error('Invalid income data received from server')
        }

        setIncome(incomeData)
      } catch (err: any) {
        console.error('[Income Detail] Failed to fetch:', err)
        const statusCode = err.statusCode || err.status || err.response?.status
        setErrorCode(statusCode)
        
        if (statusCode === 401) {
          setError('Authentication required. Please log in again.')
        } else if (statusCode === 403) {
          setError('You do not have permission to view this income record.')
        } else if (statusCode === 404) {
          setError('Income record not found. It may have been deleted.')
        } else {
          setError(err.message || 'Failed to load income details')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchIncome()
  }, [incomeId])

  const handleDelete = async () => {
    if (!incomeId) return

    setIsDeleting(true)
    try {
      await apiClient(`/finance/income/${incomeId}`, {
        method: 'DELETE',
      })

      setToast({
        message: 'Income record deleted successfully',
        type: 'success',
      })

      setTimeout(() => {
        router.push('/admin/finance/income')
      }, 1500)
    } catch (err: any) {
      console.error('[Income Detail] Delete failed:', err)
      setToast({
        message: err.message || 'Failed to delete income record',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleRestore = async () => {
    if (!incomeId) return

    setIsRestoring(true)
    try {
      await apiClient(`/finance/income/${incomeId}/restore`, {
        method: 'POST',
      })

      setToast({
        message: 'Income record restored successfully',
        type: 'success',
      })

      // Refresh the page
      window.location.reload()
    } catch (err: any) {
      console.error('[Income Detail] Restore failed:', err)
      setToast({
        message: err.message || 'Failed to restore income record',
        type: 'error',
      })
    } finally {
      setIsRestoring(false)
    }
  }

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green border-t-transparent"></div>
            <p className="mt-4 text-text-light">Loading income details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !income) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">
                {errorCode === 404 ? 'Income Not Found' : 
                 errorCode === 403 ? 'Access Denied' :
                 errorCode === 401 ? 'Authentication Required' :
                 'Failed to load income'}
              </h3>
              <p className="text-red-600 text-sm mt-1">{error || 'Income record not found'}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => router.push('/admin/finance/income')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
            >
              Back to Income
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

  // Sort events by timestamp (newest first)
  const sortedEvents = (income?.events && Array.isArray(income.events))
    ? [...income.events].sort((a, b) => {
        try {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        } catch {
          return 0
        }
      })
    : []

  // Extract safe labels for rendering
  const createdByLabel = getUserLabel(income?.createdBy)
  const updatedByLabel = getUserLabel(income?.updatedBy)
  const submittedByLabel = getUserLabel(income?.submittedBy)
  const approvedByLabel = getUserLabel(income?.approvedBy)
  const rejectedByLabel = getUserLabel(income?.rejectedBy)

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-800 border-2 border-green-600'
                : toast.type === 'error'
                ? 'bg-red-100 text-red-800 border-2 border-red-600'
                : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-600'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-text-dark mb-4">Confirm Delete</h3>
            <p className="text-text-light mb-6">
              Are you sure you want to delete this income record? This action can be undone if a restore endpoint is available.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-200 text-text-dark rounded-lg hover:bg-gray-300 transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deleted Banner */}
      {income.deletedAt && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <div>
                <p className="font-semibold text-red-800">This income record has been deleted</p>
                <p className="text-sm text-red-600">Deleted on {new Date(income.deletedAt).toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={handleRestore}
              disabled={isRestoring}
              className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green-dark transition-smooth disabled:opacity-50"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Income Details</h1>
          <p className="text-text-light mt-1">View income record information</p>
        </div>
        <button
          onClick={() => router.push('/admin/finance/income')}
          className="inline-flex items-center justify-center gap-2 bg-cream text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow/20 transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Income
        </button>
      </div>

      {/* Income Details Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income ID */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Income ID</label>
            <p className="text-lg font-medium text-green">{income.id}</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Status</label>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase ${
              income.status === 'DRAFT' 
                ? 'bg-gray-200 text-gray-700' 
                : income.status === 'SUBMITTED'
                ? 'bg-blue-100 text-blue-700'
                : income.status === 'APPROVED' || income.status === 'CONFIRMED'
                ? 'bg-green/10 text-green' 
                : income.status === 'REJECTED'
                ? 'bg-red-100 text-red-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {income.status || 'CONFIRMED'}
            </span>
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-text-light mb-2">Title</label>
            <p className="text-lg text-text-dark">{getDerivedTitle(income)}</p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Amount</label>
            <p className="text-3xl font-bold text-green">
              {formatMoney(income.amount, income.currency || 'PKR')}
            </p>
          </div>

          {/* Currency */}
          {income.currency && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Currency</label>
              <p className="text-lg text-text-dark">{income.currency}</p>
            </div>
          )}

          {/* Source */}
          {income.source && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Source</label>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                {income.source}
              </span>
            </div>
          )}

          {/* Date Received */}
          <div>
            <label className="block text-sm font-semibold text-text-light mb-2">Date Received</label>
            <p className="text-lg text-text-dark">
              {income.dateReceived ? new Date(income.dateReceived).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : (income.createdAt ? new Date(income.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : '—')}
            </p>
          </div>

          {/* Reference */}
          {income.reference && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Reference</label>
              <p className="text-lg text-text-dark">{income.reference}</p>
            </div>
          )}

          {/* Booking Link */}
          {income.bookingId && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Booking</label>
              <Link
                href={`/admin/bookings/view/${income.bookingId}`}
                className="inline-flex items-center gap-2 text-green hover:text-green-dark font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {income.booking?.bookingCode 
                  ? `View Booking #${income.booking.bookingCode}`
                  : `View Booking #${income.bookingId.substring(0, 8)}`}
              </Link>
            </div>
          )}

          {/* Description/Notes */}
          {income.notes && (
            <div className="md:col-span-2 pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-text-light mb-2">Notes</label>
              <p className="text-text-dark whitespace-pre-wrap">{income.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Audit Information */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-serif font-bold text-green mb-6">Audit Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Created */}
          {income.createdAt && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Created At</label>
              <p className="text-sm text-text-dark">{new Date(income.createdAt).toLocaleString()}</p>
            </div>
          )}

          {income.createdBy && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Created By</label>
              <p className="text-sm text-text-dark">{createdByLabel}</p>
            </div>
          )}

          {/* Updated */}
          {income.updatedAt && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Last Updated</label>
              <p className="text-sm text-text-dark">{new Date(income.updatedAt).toLocaleString()}</p>
            </div>
          )}

          {income.updatedBy && (
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">Updated By</label>
              <p className="text-sm text-text-dark">{updatedByLabel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Metadata Card */}
      {(income?.submittedAt || income?.approvedAt || income?.rejectedAt) && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-serif font-bold text-green mb-6">Approval History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Submitted */}
            {income?.submittedAt && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-light mb-2">Submitted At</label>
                  <p className="text-text-dark">{new Date(income.submittedAt).toLocaleString()}</p>
                </div>
                {income?.submittedBy && (
                  <div>
                    <label className="block text-sm font-semibold text-text-light mb-2">Submitted By</label>
                    <p className="text-text-dark">{submittedByLabel}</p>
                  </div>
                )}
              </>
            )}

            {/* Approved */}
            {income?.approvedAt && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-light mb-2">Approved At</label>
                  <p className="text-text-dark">{new Date(income.approvedAt).toLocaleString()}</p>
                </div>
                {income?.approvedBy && (
                  <div>
                    <label className="block text-sm font-semibold text-text-light mb-2">Approved By</label>
                    <p className="text-text-dark">{approvedByLabel}</p>
                  </div>
                )}
              </>
            )}

            {/* Rejected */}
            {income?.rejectedAt && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-light mb-2">Rejected At</label>
                  <p className="text-text-dark">{new Date(income.rejectedAt).toLocaleString()}</p>
                </div>
                {income?.rejectedBy && (
                  <div>
                    <label className="block text-sm font-semibold text-text-light mb-2">Rejected By</label>
                    <p className="text-text-dark">{rejectedByLabel}</p>
                  </div>
                )}
                {income?.rejectionReason && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-light mb-2">Rejection Reason</label>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">{income.rejectionReason}</p>
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
                    event.type === 'APPROVED' || event.type === 'CONFIRMED' ? 'bg-green' :
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
      <div className="flex flex-wrap gap-4">
        <Link
          href={`/admin/finance/income/${incomeId}/edit`}
          className="px-6 py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition-smooth"
        >
          Edit Income
        </Link>
        
        {!income.deletedAt && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-smooth"
          >
            Delete Income
          </button>
        )}

        <button
          onClick={() => router.push('/admin/finance/income')}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-text-dark hover:bg-gray-50 transition-smooth"
        >
          Back to List
        </button>
      </div>
    </div>
  )
}
