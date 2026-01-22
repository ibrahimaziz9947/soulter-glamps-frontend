'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { fetchPurchaseById, deletePurchase, restorePurchase } from '@/src/services/purchases.api'
import { formatMoney } from '@/src/utils/currency'

interface Purchase {
  id: string
  vendorName: string
  category: string
  status: string
  amount: number // In cents
  currency: string
  purchaseDate?: string
  reference?: string
  notes?: string
  
  // Audit fields
  createdBy?: string | { id?: string; name?: string; email?: string }
  updatedBy?: string | { id?: string; name?: string; email?: string }
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

// Helper to safely extract user label from string or object
function getUserLabel(user: any): string {
  if (!user) return '—'
  if (typeof user === 'string') return user
  if (user.name) return user.name
  if (user.email) return user.email
  return '—'
}

export default function PurchaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const purchaseId = params?.id as string | undefined

  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  useEffect(() => {
    const fetchPurchase = async () => {
      // Guard against undefined id
      if (!purchaseId) {
        setError('Invalid purchase ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        setErrorCode(null)

        const response = await fetchPurchaseById(purchaseId)

        console.log('[Purchase Detail] API response:', response)

        // Handle different response structures safely
        let purchaseData: Purchase | null = null
        if (response?.success && response?.data) {
          purchaseData = response.data
        } else if (response?.data) {
          purchaseData = response.data
        }

        if (!purchaseData || !purchaseData.id) {
          throw new Error('Invalid purchase data received from server')
        }

        setPurchase(purchaseData)
      } catch (err: any) {
        console.error('[Purchase Detail] Failed to fetch:', err)
        const statusCode = err.statusCode || err.status || err.response?.status
        setErrorCode(statusCode)
        
        if (statusCode === 401) {
          setError('Authentication required. Please log in again.')
        } else if (statusCode === 403) {
          setError('You do not have permission to view this purchase record.')
        } else if (statusCode === 404) {
          setError('Purchase record not found. It may have been deleted.')
        } else {
          setError(err.message || 'Failed to load purchase details')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPurchase()
  }, [purchaseId])

  const handleDelete = async () => {
    if (!purchaseId) return

    setIsDeleting(true)
    try {
      await deletePurchase(purchaseId)

      setToast({
        message: 'Purchase record deleted successfully',
        type: 'success',
      })

      setTimeout(() => {
        router.push('/admin/finance/purchases')
      }, 1500)
    } catch (err: any) {
      console.error('[Purchase Detail] Delete failed:', err)
      setToast({
        message: err.message || 'Failed to delete purchase record',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleRestore = async () => {
    if (!purchaseId) return

    setIsRestoring(true)
    try {
      await restorePurchase(purchaseId)

      setToast({
        message: 'Purchase record restored successfully',
        type: 'success',
      })

      // Refresh the page
      window.location.reload()
    } catch (err: any) {
      console.error('[Purchase Detail] Restore failed:', err)
      setToast({
        message: err.message || 'Failed to restore purchase record',
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
            <p className="mt-4 text-text-light">Loading purchase details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !purchase) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">
                {errorCode === 404 ? 'Purchase Not Found' : 
                 errorCode === 403 ? 'Access Denied' :
                 errorCode === 401 ? 'Authentication Required' :
                 'Failed to load purchase'}
              </h3>
              <p className="text-red-600 text-sm mt-1">{error || 'Purchase record not found'}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => router.push('/admin/finance/purchases')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
            >
              Back to Purchases
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

  // Extract safe labels for rendering
  const createdByLabel = getUserLabel(purchase?.createdBy)
  const updatedByLabel = getUserLabel(purchase?.updatedBy)

  // Format date helper
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

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
              Are you sure you want to delete this purchase record from <strong>{purchase.vendorName}</strong>? This action can be undone if a restore endpoint is available.
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
      {purchase.deletedAt && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <div>
                <p className="font-semibold text-red-800">This purchase record has been deleted</p>
                <p className="text-sm text-red-600">Deleted on {new Date(purchase.deletedAt).toLocaleString()}</p>
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
          <h1 className="font-serif text-3xl font-bold text-green">Purchase Details</h1>
          <p className="text-text-light mt-1">View purchase record information</p>
        </div>
        <button
          onClick={() => router.push('/admin/finance/purchases')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-text-dark hover:bg-gray-100 rounded-lg transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-cream px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-dark">{purchase.vendorName}</h2>
              <p className="text-text-light text-sm mt-1">Purchase ID: {purchase.id}</p>
            </div>
            <div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase ${
                purchase.status === 'DRAFT' 
                  ? 'bg-gray-200 text-gray-700' 
                  : purchase.status === 'CONFIRMED' 
                  ? 'bg-green/10 text-green' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {purchase.status}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-1">Amount</label>
              <p className="text-2xl font-bold text-green">
                {formatMoney(purchase.amount, purchase.currency || 'PKR')}
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-1">Currency</label>
              <p className="text-lg text-text-dark">{purchase.currency || 'PKR'}</p>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-1">Purchase Date</label>
              <p className="text-lg text-text-dark">{formatDate(purchase.purchaseDate)}</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-1">Category</label>
              <p className="text-lg text-text-dark">{purchase.category || '—'}</p>
            </div>

            {/* Reference */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-1">Reference</label>
              <p className="text-lg text-text-dark">{purchase.reference || '—'}</p>
            </div>

            {/* Created By */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-1">Created By</label>
              <p className="text-lg text-text-dark">{createdByLabel}</p>
            </div>

            {/* Created At */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-1">Created At</label>
              <p className="text-lg text-text-dark">{formatDate(purchase.createdAt)}</p>
            </div>

            {/* Updated At */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-1">Last Updated</label>
              <p className="text-lg text-text-dark">{formatDate(purchase.updatedAt)}</p>
            </div>
          </div>

          {/* Notes Section */}
          {purchase.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-semibold text-text-light mb-2">Notes</label>
              <p className="text-text-dark whitespace-pre-wrap">{purchase.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href={`/admin/finance/purchases/${purchase.id}/edit`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Purchase
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={!!purchase.deletedAt}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Purchase
        </button>
      </div>
    </div>
  )
}
