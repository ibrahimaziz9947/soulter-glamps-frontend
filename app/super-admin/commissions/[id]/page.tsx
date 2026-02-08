'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  getSuperAdminCommissionById,
  markSuperAdminCommissionPaid,
  markSuperAdminCommissionUnpaid,
  type SuperAdminCommission 
} from '@/src/services/super-admin-commissions.api'
import { formatMoney } from '@/src/utils/currency'

export default function CommissionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const commissionId = params.id as string
  
  // State
  const [commission, setCommission] = useState<SuperAdminCommission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])
  
  // Load commission details
  const loadCommission = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSuperAdminCommissionById(commissionId)
      setCommission(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load commission details')
    } finally {
      setLoading(false)
    }
  }, [commissionId])
  
  useEffect(() => {
    if (commissionId) {
      loadCommission()
    }
  }, [commissionId, loadCommission])
  
  // Handle mark paid
  const handleMarkPaid = async () => {
    if (!commission) return
    
    try {
      setActionLoading(true)
      await markSuperAdminCommissionPaid(commission.id)
      setToast({ message: 'Commission marked as paid successfully!', type: 'success' })
      // Reload commission
      await loadCommission()
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to mark commission as paid', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle mark unpaid
  const handleMarkUnpaid = async () => {
    if (!commission) return
    
    try {
      setActionLoading(true)
      await markSuperAdminCommissionUnpaid(commission.id)
      setToast({ message: 'Commission marked as unpaid successfully!', type: 'success' })
      // Reload commission
      await loadCommission()
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to mark commission as unpaid', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }
  
  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-text-light hover:text-green mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="font-serif text-3xl font-bold text-green">Commission Details</h1>
          <p className="text-text-light mt-1">Commission ID: {commissionId}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Commission</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadCommission}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
          >
            Retry
          </button>
        </div>
      )}

      {/* Commission Details */}
      {commission && !loading && (
        <>
          {/* Status and Actions Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light text-sm mb-2">Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  commission.status === 'PAID' 
                    ? 'bg-green/10 text-green' 
                    : 'bg-orange-50 text-orange-600'
                }`}>
                  {commission.status}
                </span>
              </div>
              <div className="flex gap-3">
                {commission.status === 'UNPAID' && (
                  <button
                    onClick={handleMarkPaid}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Processing...' : 'Mark as Paid'}
                  </button>
                )}
                {commission.status === 'PAID' && (
                  <button
                    onClick={handleMarkUnpaid}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Processing...' : 'Mark as Unpaid'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Commission Amount Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Commission Amount</p>
            <p className="font-serif text-4xl font-bold text-green">
              {formatMoney(commission.amount)}
            </p>
          </div>

          {/* Agent Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green mb-4">Agent Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-text-light text-sm mb-1">Agent ID</p>
                <p className="font-medium text-text-dark">{commission.agentId}</p>
              </div>
              {commission.agentName && (
                <div>
                  <p className="text-text-light text-sm mb-1">Agent Name</p>
                  <p className="font-medium text-text-dark">{commission.agentName}</p>
                </div>
              )}
              {commission.agentEmail && (
                <div>
                  <p className="text-text-light text-sm mb-1">Agent Email</p>
                  <p className="font-medium text-text-dark">{commission.agentEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green mb-4">Related Booking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-text-light text-sm mb-1">Booking ID</p>
                <p className="font-medium text-text-dark">{commission.bookingId}</p>
              </div>
              {commission.bookingCustomerName && (
                <div>
                  <p className="text-text-light text-sm mb-1">Customer Name</p>
                  <p className="font-medium text-text-dark">{commission.bookingCustomerName}</p>
                </div>
              )}
              {commission.glampName && (
                <div>
                  <p className="text-text-light text-sm mb-1">Glamp</p>
                  <p className="font-medium text-text-dark">{commission.glampName}</p>
                </div>
              )}
              {commission.bookingCheckInDate && (
                <div>
                  <p className="text-text-light text-sm mb-1">Check-in Date</p>
                  <p className="font-medium text-text-dark">{formatDate(commission.bookingCheckInDate)}</p>
                </div>
              )}
              {commission.bookingCheckOutDate && (
                <div>
                  <p className="text-text-light text-sm mb-1">Check-out Date</p>
                  <p className="font-medium text-text-dark">{formatDate(commission.bookingCheckOutDate)}</p>
                </div>
              )}
              {commission.bookingTotalAmount && (
                <div>
                  <p className="text-text-light text-sm mb-1">Booking Total Amount</p>
                  <p className="font-medium text-text-dark">{formatMoney(commission.bookingTotalAmount)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          {commission.status === 'PAID' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-green mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commission.paidAt && (
                  <div>
                    <p className="text-text-light text-sm mb-1">Paid At</p>
                    <p className="font-medium text-text-dark">{formatDate(commission.paidAt)}</p>
                  </div>
                )}
                {commission.paidBy && (
                  <div>
                    <p className="text-text-light text-sm mb-1">Paid By</p>
                    <p className="font-medium text-text-dark">{commission.paidBy}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green mb-4">Timestamps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-text-light text-sm mb-1">Created At</p>
                <p className="font-medium text-text-dark">{formatDate(commission.createdAt)}</p>
              </div>
              <div>
                <p className="text-text-light text-sm mb-1">Updated At</p>
                <p className="font-medium text-text-dark">{formatDate(commission.updatedAt)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
