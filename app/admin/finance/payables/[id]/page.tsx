'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchPurchaseById } from '@/src/services/purchases.api'
import { payPurchase } from '@/src/services/payables.api'
import { formatMoney } from '@/src/utils/currency'

interface Purchase {
  id: string
  vendorName: string
  category: string
  status: string
  amount: number
  currency: string
  purchaseDate?: string
  reference?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export default function PayableDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const payableId = params.id as string
  
  // Extract purchaseId from payable-{purchaseId} format
  const purchaseId = payableId.replace('payable-', '')
  
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Payment modal state
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Safe number conversion
  const safeNum = (value: any): number => {
    const num = Number(value)
    return Number.isFinite(num) ? num : 0
  }

  // Compute payable info from purchase
  const computePayableInfo = (purchase: Purchase) => {
    const total = safeNum(purchase.amount)
    const paid = 0 // V1: No payment tracking
    const outstanding = total - paid
    
    const purchaseDate = new Date(purchase.purchaseDate || purchase.createdAt || new Date())
    const dueDate = new Date(purchaseDate)
    dueDate.setDate(dueDate.getDate() + 30)
    
    let status: 'PAID' | 'PARTIAL' | 'UNPAID'
    if (paid === 0) {
      status = 'UNPAID'
    } else if (paid < total) {
      status = 'PARTIAL'
    } else {
      status = 'PAID'
    }
    
    return {
      total,
      paid,
      outstanding,
      dueDate: dueDate.toISOString().split('T')[0],
      status
    }
  }

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        setLoading(true)
        const response = await fetchPurchaseById(purchaseId)
        
        if (response.success && response.data) {
          setPurchase(response.data)
        } else {
          setError('Purchase not found')
        }
      } catch (err: any) {
        console.error('Failed to load purchase:', err)
        setError(err.message || 'Failed to load purchase')
      } finally {
        setLoading(false)
      }
    }

    if (purchaseId) {
      loadPurchase()
    }
  }, [purchaseId])

  const handlePayFull = () => {
    if (purchase) {
      const payable = computePayableInfo(purchase)
      setPaymentAmount(payable.outstanding.toFixed(2))
    }
  }

  const handlePaymentSubmit = async () => {
    if (!purchase) return

    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid payment amount', 'error')
      return
    }

    const payable = computePayableInfo(purchase)
    if (amount > payable.outstanding) {
      showToast('Payment amount cannot exceed outstanding amount', 'error')
      return
    }

    try {
      setProcessing(true)
      
      const response = await payPurchase(
        purchaseId,
        amount,
        { notes: paymentNotes || undefined }
      )
      
      if (response.success) {
        showToast(
          response.message || `Payment of ${formatMoney(amount, purchase.currency)} recorded successfully`,
          'success'
        )
        
        setPayModalOpen(false)
        setPaymentAmount('')
        setPaymentNotes('')
        
        // Reload purchase data
        const refreshResponse = await fetchPurchaseById(purchaseId)
        if (refreshResponse.success && refreshResponse.data) {
          setPurchase(refreshResponse.data)
        }
      } else {
        showToast('Failed to record payment', 'error')
      }
    } catch (err: any) {
      console.error('Failed to process payment:', err)
      showToast(err.message || 'Failed to process payment', 'error')
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return 'N/A'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
          <p className="text-text-light">Loading payable details...</p>
        </div>
      </div>
    )
  }

  if (error || !purchase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 font-medium mb-4">{error || 'Purchase not found'}</p>
          <Link href="/admin/finance/payables" className="text-green hover:underline">
            ← Back to Payables
          </Link>
        </div>
      </div>
    )
  }

  const payable = computePayableInfo(purchase)
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PAID': return 'bg-green/10 text-green'
      case 'PARTIAL': return 'bg-yellow/20 text-yellow-700'
      case 'UNPAID': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green text-white' : 'bg-red-500 text-white'
        }`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {toast.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Payment Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-dark">Record Payment</h3>
              <button
                onClick={() => {
                  setPayModalOpen(false)
                  setPaymentAmount('')
                  setPaymentNotes('')
                }}
                disabled={processing}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-cream rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-text-light uppercase mb-1">Vendor</p>
                  <p className="font-semibold">{purchase.vendorName || 'Unknown Vendor'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-light uppercase mb-1">Reference</p>
                  <p className="font-medium">{purchase.reference || '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-text-light mb-1">Outstanding</p>
                  <p className="font-semibold text-red-600 text-lg">
                    {formatMoney(safeNum(payable.outstanding), purchase.currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Payment Amount ({purchase.currency})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={safeNum(payable.outstanding)}
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="0.00"
                    autoFocus
                  />
                  <button
                    onClick={handlePayFull}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-yellow text-green rounded font-semibold hover:bg-yellow-light"
                  >
                    Pay Full
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
                <textarea
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                  placeholder="Payment notes..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                onClick={() => {
                  setPayModalOpen(false)
                  setPaymentAmount('')
                  setPaymentNotes('')
                }}
                disabled={processing}
                className="px-5 py-2.5 bg-gray-200 text-text-dark rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={processing || !paymentAmount || parseFloat(paymentAmount) <= 0}
                className="px-5 py-2.5 bg-green text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Pay Amount</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/finance/payables" className="text-green hover:underline text-sm mb-2 inline-block">
            ← Back to Payables
          </Link>
          <h1 className="font-serif text-3xl font-bold text-green">Payable Details</h1>
          <p className="text-text-light mt-1">{purchase.vendorName || 'Unknown Vendor'}</p>
        </div>
        {payable.status !== 'PAID' && (
          <button
            onClick={() => setPayModalOpen(true)}
            className="bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Record Payment
          </button>
        )}
      </div>

      {/* Payable Status Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-dark">Payment Status</h2>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusColor(payable.status)}`}>
            {payable.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-text-light mb-2">Total Amount</p>
            <p className="font-serif text-2xl font-bold text-text-dark">
              {formatMoney(safeNum(payable.total), purchase.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-light mb-2">Paid</p>
            <p className="font-serif text-2xl font-bold text-green">
              {formatMoney(safeNum(payable.paid), purchase.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-light mb-2">Outstanding</p>
            <p className="font-serif text-2xl font-bold text-red-600">
              {formatMoney(safeNum(payable.outstanding), purchase.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-light mb-2">Due Date</p>
            <p className="font-serif text-2xl font-bold text-text-dark">
              {formatDate(payable.dueDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Details Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-dark">Purchase Details</h2>
          <Link
            href={`/admin/finance/purchases/${purchaseId}`}
            className="text-green hover:underline text-sm font-medium flex items-center gap-1"
          >
            View Full Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-text-light mb-1">Vendor</p>
            <p className="font-medium text-text-dark">{purchase.vendorName || 'Unknown Vendor'}</p>
          </div>
          <div>
            <p className="text-sm text-text-light mb-1">Reference</p>
            <p className="font-medium text-text-dark">{purchase.reference || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-text-light mb-1">Purchase Date</p>
            <p className="font-medium text-text-dark">{formatDate(purchase.purchaseDate || purchase.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-text-light mb-1">Category</p>
            <p className="font-medium text-text-dark">{purchase.category}</p>
          </div>
          <div>
            <p className="text-sm text-text-light mb-1">Purchase Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
              purchase.status === 'CONFIRMED' ? 'bg-green/10 text-green' : 'bg-gray-200 text-gray-700'
            }`}>
              {purchase.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-text-light mb-1">Currency</p>
            <p className="font-medium text-text-dark">{purchase.currency}</p>
          </div>
        </div>

        {purchase.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-text-light mb-2">Notes</p>
            <p className="text-text-dark whitespace-pre-wrap">{purchase.notes}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-text-dark mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/admin/finance/purchases/${purchaseId}`}
            className="px-4 py-2 bg-green text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Purchase
          </Link>
          <Link
            href={`/admin/finance/purchases/${purchaseId}/edit`}
            className="px-4 py-2 bg-yellow text-green rounded-lg font-medium hover:bg-yellow-light flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Purchase
          </Link>
          <Link
            href="/admin/finance/payables"
            className="px-4 py-2 bg-gray-200 text-text-dark rounded-lg font-medium hover:bg-gray-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Payables
          </Link>
        </div>
      </div>
    </div>
  )
}
