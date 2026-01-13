'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchPurchases, fetchPurchasesSummary, deletePurchase } from '@/src/services/purchases.api'
import { formatCurrency } from '@/src/utils/currency'

interface Purchase {
  id: string
  vendorName: string
  category: string
  status: string // DRAFT | CONFIRMED | CANCELLED | SUBMITTED
  amount: number // In cents
  currency: string // PKR | USD | EUR | GBP
  purchaseDate?: string // ISO date string (YYYY-MM-DD)
  reference?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface PurchaseSummary {
  totalPurchases: number // In cents
  totalCount: number
  byStatus?: {
    DRAFT?: number
    CONFIRMED?: number
    CANCELLED?: number
    SUBMITTED?: number
  }
  byCategory?: {
    [key: string]: number
  }
}

export default function PurchasesPage() {
  const router = useRouter()
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState('all')
  
  // Data
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [summary, setSummary] = useState<PurchaseSummary | null>(null)
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
  const [purchaseToDelete, setPurchaseToDelete] = useState<Purchase | null>(null)
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
        const params: any = {}
        if (dateFrom) params.dateFrom = dateFrom
        if (dateTo) params.dateTo = dateTo
        
        const response = await fetchPurchasesSummary(params)
        
        if (response.success && response.data) {
          setSummary(response.data)
        }
      } catch (err: any) {
        console.error('Failed to fetch purchases summary:', err)
        // Don't show error for summary, just log it
      }
    }

    fetchSummary()
  }, [dateFrom, dateTo])

  // Fetch purchases list
  useEffect(() => {
    const fetchPurchasesList = async () => {
      try {
        setLoading(true)
        setError(null)

        const params: any = {
          page,
          limit: 10
        }
        
        if (searchQuery.trim()) params.search = searchQuery.trim()
        if (statusFilter !== 'all') params.status = statusFilter
        if (dateFrom) params.dateFrom = dateFrom
        if (dateTo) params.dateTo = dateTo

        const response = await fetchPurchases(params)

        console.log('[Purchases] GET /finance/purchases response:', response)
        
        // Handle response structure
        let purchasesData: Purchase[] = []
        let paginationData = { page: 1, limit: 10, total: 0, totalPages: 0 }
        
        if (response.success && response.data) {
          purchasesData = response.data.purchases || []
          paginationData = response.data.pagination || paginationData
        }

        setPurchases(purchasesData)
        setPagination(paginationData)
      } catch (err: any) {
        console.error('Failed to fetch purchases:', err)
        setError(err.message || 'Failed to load purchases')
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchPurchasesList()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [page, searchQuery, statusFilter, dateFrom, dateTo])

  // Delete purchase handler
  const handleDeleteClick = (purchase: Purchase) => {
    setPurchaseToDelete(purchase)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!purchaseToDelete) return

    try {
      setDeleting(true)
      
      await deletePurchase(purchaseToDelete.id)

      showToast('Purchase record deleted successfully', 'success')
      setDeleteModalOpen(false)
      setPurchaseToDelete(null)
      
      // Refresh list
      setPage(1)
      
      // Refetch data
      const params: any = {
        page: 1,
        limit: 10
      }
      if (searchQuery.trim()) params.search = searchQuery.trim()
      if (statusFilter !== 'all') params.status = statusFilter
      
      const response = await fetchPurchases(params)
      
      if (response.success && response.data) {
        setPurchases(response.data.purchases || [])
        setPagination(response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
      }
      
      // Refetch summary
      const summaryParams: any = {}
      if (dateFrom) summaryParams.dateFrom = dateFrom
      if (dateTo) summaryParams.dateTo = dateTo
      const summaryResponse = await fetchPurchasesSummary(summaryParams)
      if (summaryResponse.success && summaryResponse.data) {
        setSummary(summaryResponse.data)
      }
      
    } catch (err: any) {
      console.error('Failed to delete purchase:', err)
      showToast(err.message || 'Failed to delete purchase record', 'error')
    } finally {
      setDeleting(false)
    }
  }

  // Safe number conversion - prevents NaN in UI
  const safeNum = (value: any): number => {
    const num = Number(value)
    return Number.isFinite(num) ? num : 0
  }

  // Calculate status counts from summary or pagination - ensure all values are safe numbers
  const summaryData: any = summary ?? {}
  const byStatus = summaryData.byStatus ?? {}
  
  const statusCounts = {
    all: safeNum(summaryData.totalCount ?? pagination.total),
    DRAFT: safeNum(byStatus.DRAFT ?? 0),
    CONFIRMED: safeNum(byStatus.CONFIRMED ?? 0),
    CANCELLED: safeNum(byStatus.CANCELLED ?? 0),
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
      {deleteModalOpen && purchaseToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-text-dark mb-4">Confirm Delete</h3>
            <p className="text-text-light mb-6">
              Are you sure you want to delete purchase from <strong>{purchaseToDelete.vendorName}</strong> ({formatCurrency(safeNum(purchaseToDelete.amount))})? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setPurchaseToDelete(null)
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
          <h1 className="font-serif text-3xl font-bold text-green">Purchase Management</h1>
          <p className="text-text-light mt-1">Track and manage all purchase orders</p>
        </div>
        <Link 
          href="/admin/finance/purchases/new"
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Purchase
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading && !summary ? (
          // Loading skeleton for summary cards
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))
        ) : summary ? (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Purchases</p>
              <p className="font-serif text-3xl font-bold text-green">
                {formatCurrency(safeNum(summaryData.totalPurchases))}
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
          </>
        ) : (
          // Fallback when no summary
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Purchases</p>
              <p className="font-serif text-3xl font-bold text-green">—</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Confirmed</p>
              <p className="font-serif text-2xl font-bold text-green">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Draft</p>
              <p className="font-serif text-2xl font-bold text-gray-600">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Records</p>
              <p className="font-serif text-2xl font-bold text-green">0</p>
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

        {/* Search & Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Purchase Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Vendor</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Reference</th>
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
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                // Error state
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-500 font-medium">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-text-light">No purchase records found</p>
                      <p className="text-text-light text-sm mt-2">Try adjusting your filters or create a new purchase record</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data rows
                purchases.map((purchase) => {
                  // Filter by currency if needed
                  if (currencyFilter !== 'all' && purchase.currency !== currencyFilter) {
                    return null
                  }
                  
                  return (
                    <tr key={purchase.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                      <td className="py-4 px-6 text-text-dark text-sm">
                        {formatDate(purchase.purchaseDate || purchase.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-text-dark font-medium">
                        {purchase.vendorName || 'N/A'}
                      </td>
                      <td className="py-4 px-6 font-semibold text-green">
                        {purchase.currency && purchase.currency !== 'PKR' 
                          ? `${purchase.currency} ${(safeNum(purchase.amount) / 100).toFixed(2)}`
                          : formatCurrency(safeNum(purchase.amount))}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          (purchase.status || 'DRAFT') === 'DRAFT' 
                            ? 'bg-gray-200 text-gray-700' 
                            : purchase.status === 'CONFIRMED' 
                            ? 'bg-green/10 text-green' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {purchase.status || 'DRAFT'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-text-light text-sm">
                        {purchase.reference || '—'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/finance/purchases/${purchase.id}`}
                            className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                            title="View"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            href={`/admin/finance/purchases/${purchase.id}/edit`}
                            className="p-2 text-yellow hover:bg-cream rounded-lg transition-smooth"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(purchase)}
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
                  )
                })
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
