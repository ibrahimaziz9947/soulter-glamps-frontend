'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  fetchPayables, 
  fetchPayablesSummary, 
  payPurchase,
  type Payable,
  type PayablesSummary
} from '@/src/services/payables.api'
import { formatMoney } from '@/src/utils/currency'

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function PayablesPage() {
  const router = useRouter()
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('UNPAID,PARTIAL')
  const [searchQuery, setSearchQuery] = useState('')
  const [purchaseDateFrom, setPurchaseDateFrom] = useState('')
  const [purchaseDateTo, setPurchaseDateTo] = useState('')
  const [dueDateFrom, setDueDateFrom] = useState('')
  const [dueDateTo, setDueDateTo] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState('all')
  
  // Data
  const [payables, setPayables] = useState<Payable[]>([])
  const [summary, setSummary] = useState<PayablesSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  
  // Pay modal
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [payableToProcess, setPayableToProcess] = useState<Payable | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Fetch payables list
  useEffect(() => {
    const loadPayables = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build params for API call
        const params: any = {
          page,
          limit: 10,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchQuery.trim() || undefined,
          currency: currencyFilter !== 'all' ? currencyFilter : undefined,
          purchaseDateFrom: purchaseDateFrom || undefined,
          purchaseDateTo: purchaseDateTo || undefined,
          dueDateFrom: dueDateFrom || undefined,
          dueDateTo: dueDateTo || undefined
        }

        console.log('[Payables Page] Fetching with params:', params)

        const response = await fetchPayables(params)

        console.log('[Payables Page] Response:', response)
        
        if (response.success && response.data) {
          // API already returns normalized structure: { items, pagination }
          setPayables(response.data.items || [])
          setPagination(response.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
          })
        }
      } catch (err: any) {
        console.error('Failed to fetch payables:', err)
        setError(err.message || 'Failed to load payables')
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      loadPayables()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [page, searchQuery, statusFilter, purchaseDateFrom, purchaseDateTo, dueDateFrom, dueDateTo, currencyFilter])

  // Fetch summary
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const params: any = {
          purchaseDateFrom: purchaseDateFrom || undefined,
          purchaseDateTo: purchaseDateTo || undefined,
          dueDateFrom: dueDateFrom || undefined,
          dueDateTo: dueDateTo || undefined,
          currency: currencyFilter !== 'all' ? currencyFilter : undefined
        }

        const response = await fetchPayablesSummary(params)

        console.log('[Payables Page] Summary response:', response)
        
        if (response.success && response.data) {
          setSummary(response.data)
        }
      } catch (err: any) {
        console.error('Failed to fetch payables summary:', err)
        // Don't show error for summary, just log it
      }
    }

    loadSummary()
  }, [purchaseDateFrom, purchaseDateTo, dueDateFrom, dueDateTo, currencyFilter])

  // Pay button handler
  const handlePayClick = (payable: Payable) => {
    setPayableToProcess(payable)
    setPaymentAmount('') // Start empty, let user choose
    setPaymentNotes('')
    setPayModalOpen(true)
  }

  // Pay full button - fills outstanding amount
  const handlePayFull = () => {
    if (payableToProcess) {
      setPaymentAmount(payableToProcess.outstanding.toFixed(2))
    }
  }

  const handlePaymentSubmit = async () => {
    if (!payableToProcess) return

    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid payment amount', 'error')
      return
    }

    if (amount > payableToProcess.outstanding) {
      showToast('Payment amount cannot exceed outstanding amount', 'error')
      return
    }

    try {
      setProcessing(true)
      
      // Call payment API - send amount in major units
      const response = await payPurchase(
        payableToProcess.purchaseId,
        amount,
        {
          notes: paymentNotes || undefined
        }
      )
      
      if (response.success) {
        showToast(
          response.message || `Payment of ${formatMoney(amount, payableToProcess.currency)} recorded successfully`,
          'success'
        )
        
        // Close modal
        setPayModalOpen(false)
        setPayableToProcess(null)
        setPaymentAmount('')
        setPaymentNotes('')
        
        // Refresh data - refetch both list and summary
        const params: any = {
          page,
          limit: 10,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchQuery.trim() || undefined,
          currency: currencyFilter !== 'all' ? currencyFilter : undefined,
          purchaseDateFrom: purchaseDateFrom || undefined,
          purchaseDateTo: purchaseDateTo || undefined,
          dueDateFrom: dueDateFrom || undefined,
          dueDateTo: dueDateTo || undefined
        }
        
        // Refetch payables list
        const payablesResponse = await fetchPayables(params)
        if (payablesResponse.success && payablesResponse.data) {
          setPayables(payablesResponse.data.items || [])
          setPagination(payablesResponse.data.pagination || pagination)
        }
        
        // Refetch summary
        const summaryParams: any = {
          purchaseDateFrom: purchaseDateFrom || undefined,
          purchaseDateTo: purchaseDateTo || undefined,
          dueDateFrom: dueDateFrom || undefined,
          dueDateTo: dueDateTo || undefined,
          currency: currencyFilter !== 'all' ? currencyFilter : undefined
        }
        const summaryResponse = await fetchPayablesSummary(summaryParams)
        if (summaryResponse.success && summaryResponse.data) {
          setSummary(summaryResponse.data)
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

  // Safe number conversion
  const safeNum = (value: any): number => {
    const num = Number(value)
    return Number.isFinite(num) ? num : 0
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return 'N/A'
    }
  }

  // Helper to get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PAID':
        return 'bg-green/10 text-green'
      case 'PARTIAL':
        return 'bg-yellow/20 text-yellow-700'
      case 'UNPAID':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-green text-white' 
            : toast.type === 'warning'
            ? 'bg-orange-500 text-white'
            : 'bg-red-500 text-white'
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

      {/* Payment Modal */}
      {payModalOpen && payableToProcess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-dark">Record Payment</h3>
              <button
                onClick={() => {
                  setPayModalOpen(false)
                  setPayableToProcess(null)
                  setPaymentAmount('')
                  setPaymentNotes('')
                }}
                disabled={processing}
                className="text-gray-400 hover:text-gray-600 transition-smooth disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Purchase Details */}
            <div className="bg-cream rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-text-light uppercase tracking-wide mb-1">Vendor</p>
                  <p className="font-semibold text-text-dark">{payableToProcess.vendorName || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-light uppercase tracking-wide mb-1">Reference</p>
                  <p className="font-medium text-text-dark">{payableToProcess.reference || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-text-light mb-1">Total</p>
                  <p className="font-semibold text-text-dark">
                    {formatMoney(safeNum(payableToProcess.total), payableToProcess.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-light mb-1">Paid</p>
                  <p className="font-semibold text-green">
                    {formatMoney(safeNum(payableToProcess.paid), payableToProcess.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-light mb-1">Outstanding</p>
                  <p className="font-semibold text-red-600 text-lg">
                    {formatMoney(safeNum(payableToProcess.outstanding), payableToProcess.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Amount Input */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Payment Amount ({payableToProcess.currency})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={safeNum(payableToProcess.outstanding)}
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="0.00"
                    autoFocus
                  />
                  <button
                    onClick={handlePayFull}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-yellow text-green rounded font-semibold hover:bg-yellow-light transition-smooth"
                    type="button"
                  >
                    Pay Full
                  </button>
                </div>
                <p className="text-xs text-text-light mt-1">
                  Enter amount to pay. Click "Pay Full" to pay the full outstanding amount.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Payment Notes (Optional)
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                  placeholder="Add payment reference, bank details, or other notes..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setPayModalOpen(false)
                  setPayableToProcess(null)
                  setPaymentAmount('')
                  setPaymentNotes('')
                }}
                disabled={processing}
                className="px-5 py-2.5 bg-gray-200 text-text-dark rounded-lg font-semibold hover:bg-gray-300 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={processing || !paymentAmount || parseFloat(paymentAmount) <= 0}
                className="px-5 py-2.5 bg-green text-white rounded-lg font-semibold hover:bg-green-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Accounts Payable</h1>
          <p className="text-text-light mt-1">Track outstanding payments to vendors</p>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading && !summary ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))
        ) : summary ? (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Payables</p>
              <p className="font-serif text-3xl font-bold text-green">
                {summary.totalPayables}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Outstanding Amount</p>
              <p className="font-serif text-2xl font-bold text-red-600">
                {formatMoney(safeNum(summary.outstandingAmount))}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Unpaid Count</p>
              <p className="font-serif text-2xl font-bold text-red-600">
                {summary.unpaidCount}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Partial Count</p>
              <p className="font-serif text-2xl font-bold text-yellow-600">
                {summary.partialCount}
              </p>
            </div>
          </>
        ) : (
          // Fallback
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Payables</p>
              <p className="font-serif text-3xl font-bold text-green">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Outstanding Amount</p>
              <p className="font-serif text-2xl font-bold text-red-600">—</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Unpaid Count</p>
              <p className="font-serif text-2xl font-bold text-red-600">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Partial Count</p>
              <p className="font-serif text-2xl font-bold text-yellow-600">0</p>
            </div>
          </>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        {/* Status Filters */}
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Status Filter</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'all'
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('UNPAID,PARTIAL')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'UNPAID,PARTIAL'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Outstanding
            </button>
            <button
              onClick={() => setStatusFilter('UNPAID')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'UNPAID'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Unpaid
            </button>
            <button
              onClick={() => setStatusFilter('PARTIAL')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'PARTIAL'
                  ? 'bg-yellow text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Partial
            </button>
            <button
              onClick={() => setStatusFilter('PAID')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'PAID'
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by vendor or reference..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Currency</label>
            <select
              value={currencyFilter}
              onChange={e => setCurrencyFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            >
              <option value="all">All Currencies</option>
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Purchase Date From</label>
            <input
              type="date"
              value={purchaseDateFrom}
              onChange={e => setPurchaseDateFrom(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Purchase Date To</label>
            <input
              type="date"
              value={purchaseDateTo}
              onChange={e => setPurchaseDateTo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Due Date From</label>
            <input
              type="date"
              value={dueDateFrom}
              onChange={e => setDueDateFrom(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Due Date To</label>
            <input
              type="date"
              value={dueDateTo}
              onChange={e => setDueDateTo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Payables Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Purchase Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Due Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Vendor</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Reference</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Total</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Paid</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Outstanding</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Currency</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-gray-100 animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                // Error state
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-500 font-medium">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : payables.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-text-light">No payables found</p>
                      <p className="text-text-light text-sm mt-2">Try adjusting your filters or check purchase records</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data rows
                payables.map((payable) => (
                  <tr key={payable.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6 text-text-dark text-sm">
                      {formatDate(payable.purchaseDate)}
                    </td>
                    <td className="py-4 px-6 text-text-dark text-sm">
                      {formatDate(payable.dueDate)}
                    </td>
                    <td className="py-4 px-6 text-text-dark font-medium">
                      {payable.vendorName || 'Unknown Vendor'}
                    </td>
                    <td className="py-4 px-6 text-text-light text-sm">
                      {payable.reference || '—'}
                    </td>
                    <td className="py-4 px-6 font-semibold text-text-dark">
                      {formatMoney(safeNum(payable.total), payable.currency || 'PKR')}
                    </td>
                    <td className="py-4 px-6 font-semibold text-green">
                      {formatMoney(safeNum(payable.paid), payable.currency || 'PKR')}
                    </td>
                    <td className="py-4 px-6 font-semibold text-red-600">
                      {formatMoney(safeNum(payable.outstanding), payable.currency || 'PKR')}
                    </td>
                    <td className="py-4 px-6 text-text-dark text-sm">
                      {payable.currency || 'PKR'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(payable.status)}`}>
                        {payable.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/finance/purchases/${payable.purchaseId}`}
                          className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                          title="View Purchase"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        {payable.status !== 'PAID' && (
                          <button
                            onClick={() => handlePayClick(payable)}
                            className="px-3 py-1.5 bg-green text-white text-sm rounded-lg hover:bg-green-700 transition-smooth font-medium"
                            title="Record Payment"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-text-light">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-100 text-text-dark rounded-lg hover:bg-gray-200 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-text-dark">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-gray-100 text-text-dark rounded-lg hover:bg-gray-200 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
