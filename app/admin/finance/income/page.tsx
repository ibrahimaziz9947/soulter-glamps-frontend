'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/src/services/apiClient'
import { formatMoney } from '@/src/utils/currency'

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
  createdBy?: {
    id?: string
    name?: string
    email?: string
  }
  createdAt?: string
  updatedAt?: string
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface IncomeSummary {
  totalIncome: number // In cents
  totalCount: number
  byStatus?: {
    DRAFT?: number
    CONFIRMED?: number
    CANCELLED?: number
    SUBMITTED?: number
  }
  confirmedIncome?: number
  draftIncome?: number
  cancelledIncome?: number
  count?: number
}

export default function IncomePage() {
  const router = useRouter()
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  // Data
  const [income, setIncome] = useState<Income[]>([])
  const [summary, setSummary] = useState<IncomeSummary | null>(null)
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
  
  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Fetch summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const params = new URLSearchParams()
        if (dateFrom) params.append('startDate', dateFrom)
        if (dateTo) params.append('endDate', dateTo)
        
        const query = params.toString()
        const endpoint = query ? `/finance/income/summary?${query}` : '/finance/income/summary'
        
        const response = await apiClient<any>(endpoint, { method: 'GET' })
        
        if (response.success && response.data) {
          setSummary(response.data)
        } else if (response.data) {
          setSummary(response.data)
        }
      } catch (err: any) {
        console.error('Failed to fetch income summary:', err)
        // Don't show error for summary, just log it
      }
    }

    fetchSummary()
  }, [dateFrom, dateTo])

  // Fetch income list
  useEffect(() => {
    const fetchIncome = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', '10')
        
        if (searchQuery.trim()) params.append('q', searchQuery.trim())
        if (statusFilter !== 'all') params.append('status', statusFilter)
        if (sourceFilter !== 'all') params.append('source', sourceFilter)
        if (dateFrom) params.append('dateFrom', dateFrom)
        if (dateTo) params.append('dateTo', dateTo)

        const response = await apiClient<any>(`/finance/income?${params.toString()}`, {
          method: 'GET',
        })

        console.log('[Income] GET /finance/income response:', response)
        
        // Handle different response structures
        let incomeData: Income[] = []
        let paginationData = { page: 1, limit: 10, total: 0, totalPages: 0 }
        
        if (Array.isArray(response)) {
          incomeData = response
        } else if (response.success && response.data) {
          const data = response.data
          incomeData = Array.isArray(data) ? data : (data.income || [])
          paginationData = data.pagination || paginationData
        } else if (response.data) {
          const data = response.data
          incomeData = Array.isArray(data) ? data : (data.income || [])
          paginationData = data.pagination || paginationData
        } else if (response.income) {
          incomeData = response.income
          paginationData = response.pagination || paginationData
        }

        setIncome(incomeData)
        setPagination(paginationData)
      } catch (err: any) {
        console.error('Failed to fetch income:', err)
        setError(err.message || 'Failed to load income')
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchIncome()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [page, searchQuery, statusFilter, sourceFilter, dateFrom, dateTo])

  // Delete income handler
  const handleDeleteClick = (inc: Income) => {
    setIncomeToDelete(inc)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!incomeToDelete) return

    try {
      setDeleting(true)
      
      await apiClient(`/finance/income/${incomeToDelete.id}`, {
        method: 'DELETE',
      })

      showToast('Income record deleted successfully', 'success')
      setDeleteModalOpen(false)
      setIncomeToDelete(null)
      
      // Refresh list
      setPage(1)
      
      // Refetch data
      const params = new URLSearchParams()
      params.append('page', '1')
      params.append('limit', '10')
      if (searchQuery.trim()) params.append('q', searchQuery.trim())
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (sourceFilter !== 'all') params.append('source', sourceFilter)
      
      const response = await apiClient<any>(`/finance/income?${params.toString()}`, {
        method: 'GET',
      })
      
      let incomeData: Income[] = []
      let paginationData = { page: 1, limit: 10, total: 0, totalPages: 0 }
      
      if (response.success && response.data) {
        incomeData = response.data.income || []
        paginationData = response.data.pagination || paginationData
      } else if (response.income) {
        incomeData = response.income
        paginationData = response.pagination || paginationData
      }
      
      setIncome(incomeData)
      setPagination(paginationData)
      
    } catch (err: any) {
      console.error('Failed to delete income:', err)
      showToast(err.message || 'Failed to delete income record', 'error')
    } finally {
      setDeleting(false)
    }
  }

  // Safe number conversion - prevents NaN in UI
  const safeNum = (value: any): number => {
    const num = Number(value)
    return Number.isFinite(num) ? num : 0
  }

  // Compute summary stats from loaded items (single source of truth)
  const computedSummary = useMemo(() => {
    // Calculate totals from current loaded income array
    const totalIncomeCents = income.reduce((sum, item) => sum + safeNum(item.amount), 0)
    
    // Count by status
    const confirmedCount = income.filter(item => item.status === 'CONFIRMED').length
    const draftCount = income.filter(item => item.status === 'DRAFT' || !item.status).length
    const cancelledCount = income.filter(item => item.status === 'CANCELLED').length
    const submittedCount = income.filter(item => item.status === 'SUBMITTED').length
    
    return {
      totalIncome: totalIncomeCents,
      totalCount: pagination.total || income.length, // Use API total if available (for paginated data)
      confirmedCount,
      draftCount,
      cancelledCount,
      submittedCount
    }
  }, [income, pagination.total])
  
  const statusCounts = {
    all: computedSummary.totalCount,
    DRAFT: computedSummary.draftCount,
    CONFIRMED: computedSummary.confirmedCount,
    CANCELLED: computedSummary.cancelledCount,
    SUBMITTED: computedSummary.submittedCount
  }

  // Helper function to generate derived title
  const getDerivedTitle = (inc: Income): string => {
    let title = ''
    
    // Generate title based on source
    if (inc.source === 'BOOKING') {
      title = 'Booking Income'
    } else if (inc.source === 'MANUAL') {
      title = 'Manual Income'
    } else {
      title = 'Other Income'
    }
    
    // Append reference or booking info if available
    if (inc.booking?.bookingCode) {
      title += ` — ${inc.booking.bookingCode}`
      if (inc.booking.customerName) {
        title += ` (${inc.booking.customerName})`
      }
    } else if (inc.reference) {
      // Truncate long references
      const ref = inc.reference.length > 30 ? inc.reference.substring(0, 30) + '...' : inc.reference
      title += ` — ${ref}`
    }
    
    return title
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

  // Helper function to format reference display
  const formatReference = (inc: Income): string => {
    if (inc.source === 'BOOKING') {
      if (inc.booking?.bookingCode) {
        return `Booking: ${inc.booking.bookingCode}`
      } else if (inc.bookingId) {
        // Show shortened UUID
        return `Booking: ${inc.bookingId.substring(0, 8)}...`
      }
      return 'Booking'
    }
    return inc.reference || '—'
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && incomeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-text-dark mb-4">Confirm Delete</h3>
            <p className="text-text-light mb-6">
              Are you sure you want to delete income record <strong>{getDerivedTitle(incomeToDelete)}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setIncomeToDelete(null)
                }}
                disabled={deleting}
                className="px-4 py-2 bg-gray-200 text-text-dark rounded-lg hover:bg-gray-300 transition-smooth disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-smooth disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Income Management</h1>
          <p className="text-text-light mt-1">Track and manage all income sources</p>
        </div>
        <Link 
          href="/admin/finance/income/new"
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Income
        </Link>
      </div>

      {/* Summary Cards - Computed from loaded data */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Total Income</p>
            <p className="font-serif text-3xl font-bold text-green">
              {(() => {
                console.log('[Income Summary] Raw totalIncome:', computedSummary.totalIncome);
                const formatted = formatMoney(computedSummary.totalIncome);
                console.log('[Income Summary] Formatted display:', formatted);
                return formatted;
              })()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Confirmed</p>
            <p className="font-serif text-2xl font-bold text-green">
              {statusCounts.CONFIRMED}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Draft</p>
            <p className="font-serif text-2xl font-bold text-gray-600">
              {statusCounts.DRAFT}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Total Records</p>
            <p className="font-serif text-2xl font-bold text-green">
              {statusCounts.all}
            </p>
          </div>
        </div>
      )}

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
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'DRAFT'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Draft ({statusCounts.DRAFT})
            </button>
            <button
              onClick={() => setStatusFilter('CONFIRMED')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'CONFIRMED'
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Confirmed ({statusCounts.CONFIRMED})
            </button>
            <button
              onClick={() => setStatusFilter('CANCELLED')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'CANCELLED'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Cancelled ({statusCounts.CANCELLED})
            </button>
          </div>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Source Filter</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                sourceFilter === 'all'
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              All Sources
            </button>
            <button
              onClick={() => setSourceFilter('BOOKING')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                sourceFilter === 'BOOKING'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Booking
            </button>
            <button
              onClick={() => setSourceFilter('MANUAL')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                sourceFilter === 'MANUAL'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setSourceFilter('OTHER')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                sourceFilter === 'OTHER'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Other
            </button>
          </div>
        </div>

        {/* Search & Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by title or reference..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date Received</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Title</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Source</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Currency</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Reference</th>
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
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
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
                  <td colSpan={8} className="py-12 text-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-500 font-medium">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : income.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-text-light">No income records found</p>
                      <p className="text-text-light text-sm mt-2">Try adjusting your filters or create a new income record</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data rows
                income.map((inc) => (
                  <tr key={inc.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6 text-text-dark text-sm">
                      {formatDate(inc.dateReceived || inc.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-text-dark font-medium">
                      {getDerivedTitle(inc)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        inc.source === 'BOOKING' 
                          ? 'bg-blue-100 text-blue-700'
                          : inc.source === 'MANUAL'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {inc.source || 'OTHER'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-green">
                      {(() => {
                        const amount = Number(inc.amount || 0);
                        console.log(`[Income Row ${inc.id}] Raw amount:`, amount, 'Currency:', inc.currency);
                        const formatted = formatMoney(amount, inc.currency || 'PKR');
                        console.log(`[Income Row ${inc.id}] Formatted:`, formatted);
                        return formatted;
                      })()}
                    </td>
                    <td className="py-4 px-6 text-text-light text-sm uppercase">
                      {inc.currency || 'PKR'}
                    </td>
                    <td className="py-4 px-6 text-text-light text-sm">
                      {formatReference(inc)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        (inc.status || 'DRAFT') === 'DRAFT' 
                          ? 'bg-gray-200 text-gray-700' 
                          : inc.status === 'CONFIRMED' 
                          ? 'bg-green/10 text-green' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {inc.status || 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/finance/income/${inc.id}`}
                          className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                          title="View"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/finance/income/${inc.id}/edit`}
                          className="p-2 text-yellow hover:bg-cream rounded-lg transition-smooth"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(inc)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-smooth"
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
