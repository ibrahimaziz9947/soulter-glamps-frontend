'use client'

import { useEffect, useState } from 'react'
import { getAllCommissions, updateCommissionStatus, type Commission } from '@/src/services/commissions.api'

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [updateError, setUpdateError] = useState<string | null>(null)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000) // Auto-dismiss after 4 seconds
  }

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        setLoading(true)
        const data = await getAllCommissions()
        setCommissions(data)
      } catch (err: any) {
        console.error('Failed to fetch commissions:', err)
        setError(err.message || 'Failed to load commissions')
      } finally {
        setLoading(false)
      }
    }

    fetchCommissions()
  }, [])

  const handleMarkAsPaid = async (commissionId: string) => {
    try {
      // Add to updating set
      setUpdatingIds(prev => new Set(prev).add(commissionId))
      setUpdateError(null)

      // Call API
      await updateCommissionStatus(commissionId, 'PAID')

      // Update local state
      setCommissions(prev => 
        prev.map(comm => 
          comm.id === commissionId 
            ? { ...comm, status: 'PAID' as const }
            : comm
        )
      )

      // Show success toast
      showToast('Commission marked as paid', 'success')
    } catch (err: any) {
      console.error('Failed to update commission status:', err)
      setUpdateError(err.message || 'Failed to mark commission as paid')
      
      // Show error toast
      showToast('Failed to update commission status', 'error')
    } finally {
      // Remove from updating set
      setUpdatingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(commissionId)
        return newSet
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
          toast.type === 'success' ? 'bg-green text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Agent Commissions</h1>
          <p className="text-text-light mt-1">Manage and review agent commission payments</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="animate-pulse">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-xl text-text-dark font-semibold mb-2">
              Loading Commissions
            </p>
            <p className="text-text-light">
              Fetching commission data from backend...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-red-50 border border-red-300 rounded-lg p-6">
            <p className="text-red-700 font-semibold mb-2">⚠️ Error Loading Commissions</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && commissions.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-xl text-text-dark font-semibold mb-2">
            No Commissions Found
          </p>
          <p className="text-text-light">
            No agent commissions have been generated yet.
          </p>
        </div>
      )}

      {/* Commissions Cards */}
      {!loading && !error && commissions.length > 0 && (
        <div className="space-y-4">
          {/* Update Error Message */}
          {updateError && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
              <p className="text-red-700 font-semibold text-sm">⚠️ {updateError}</p>
            </div>
          )}

          {commissions.map((commission) => {
            const isUpdating = updatingIds.has(commission.id)
            
            return (
              <div 
                key={commission.id} 
                className="bg-white rounded-lg shadow-lg p-6 hover:bg-cream/30 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Left Column */}
                  <div>
                    <span className="font-semibold text-gray-600">Commission ID:</span>{' '}
                    <span className="text-gray-900">{commission.id.slice(0, 8)}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Amount:</span>{' '}
                    <span className="text-green font-bold text-lg">PKR {Number(commission.amount).toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Status:</span>{' '}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      commission.status === 'PAID' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-yellow/20 text-yellow'
                    }`}>
                      {commission.status}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Created:</span>{' '}
                    <span className="text-gray-900">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Agent ID:</span>{' '}
                    <span className="text-gray-900">{commission.agentId.slice(0, 8)}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Booking ID:</span>{' '}
                    <span className="text-gray-900">{commission.bookingId.slice(0, 8)}</span>
                  </div>
                  
                  {commission.booking && (
                    <>
                      <div>
                        <span className="font-semibold text-gray-600">Customer:</span>{' '}
                        <span className="text-gray-900">{commission.booking.customerName}</span>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-600">Glamp:</span>{' '}
                        <span className="text-gray-900">
                          {commission.booking.glamp?.name || 'N/A'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-600">Check-in:</span>{' '}
                        <span className="text-gray-900">
                          {new Date(commission.booking.checkInDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-600">Booking Total:</span>{' '}
                        <span className="text-gray-900">
                          PKR {Number(commission.booking.totalAmount).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Button - Only show for UNPAID */}
                {commission.status === 'UNPAID' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleMarkAsPaid(commission.id)}
                      disabled={isUpdating}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        isUpdating
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green text-white hover:bg-green/90'
                      }`}
                    >
                      {isUpdating ? 'Updating...' : 'Mark as PAID'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
