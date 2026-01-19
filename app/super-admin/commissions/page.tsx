'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getSuperAdminCommissions, 
  markSuperAdminCommissionPaid,
  type SuperAdminCommission 
} from '@/src/services/super-admin-commissions.api'
import { formatRawCurrency } from '@/src/utils/currency'

export default function CommissionPage() {
  const router = useRouter()
  
  // State
  const [commissions, setCommissions] = useState<SuperAdminCommission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  
  // Aggregates from API
  const [aggregates, setAggregates] = useState<{
    totalCommissions: number
    paidCount: number
    unpaidCount: number
    totalAmountCents: number
    paidAmountCents: number
    pendingAmountCents?: number
    unpaidAmountCents?: number
  }>({
    totalCommissions: 0,
    paidCount: 0,
    unpaidCount: 0,
    totalAmountCents: 0,
    paidAmountCents: 0,
    pendingAmountCents: 0,
    unpaidAmountCents: 0
  })
  
  // Pagination metadata
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [agentIdFilter, setAgentIdFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  // Modal state
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false)
  const [selectedCommissionId, setSelectedCommissionId] = useState<string | null>(null)
  const [markingPaid, setMarkingPaid] = useState(false)
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])
  
  // Helper to calculate last 30 days
  const getLast30Days = (): { from: string; to: string } => {
    const now = new Date()
    const to = now.toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)
    const from = thirtyDaysAgo.toISOString().split('T')[0]
    return { from, to }
  }
  
  // Fetch commissions
  const loadCommissions = async (from?: string, to?: string, status?: string, agentId?: string, page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page,
        limit: 10
      }
      // Only add filters if they have actual values
      if (from && from.trim()) params.from = from.trim()
      if (to && to.trim()) params.to = to.trim()
      if (status && status !== 'all') params.status = status.toUpperCase()
      if (agentId && agentId.trim()) params.agentId = agentId.trim()
      
      const response = await getSuperAdminCommissions(params)
      
      // Set data from structured response
      setCommissions(Array.isArray(response.items) ? response.items : [])
      setAggregates(response.aggregates || {
        totalCommissions: 0,
        paidCount: 0,
        unpaidCount: 0,
        totalAmountCents: 0,
        paidAmountCents: 0,
        pendingAmountCents: 0,
        unpaidAmountCents: 0
      })
      setPagination(response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 })
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    } catch (err: any) {
      let errorMessage = 'Failed to load commissions'
      if (err.message) {
        errorMessage = err.message
      }
      
      if (err.status) {
        errorMessage = `[${err.status}] ${errorMessage}`
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  // Initial fetch with last 30 days
  useEffect(() => {
    const { from, to } = getLast30Days()
    setDateFrom(from)
    setDateTo(to)
    loadCommissions(from, to, statusFilter, agentIdFilter, 1)
  }, [])
  
  // Handle filter apply
  const handleApplyFilters = () => {
    loadCommissions(dateFrom, dateTo, statusFilter, agentIdFilter, 1)
  }
  
  // Handle retry
  const handleRetry = () => {
    loadCommissions(dateFrom, dateTo, statusFilter, agentIdFilter, pagination.page)
  }
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    loadCommissions(dateFrom, dateTo, statusFilter, agentIdFilter, newPage)
  }
  
  // Filter by search query (client-side)
  const filteredCommissions = Array.isArray(commissions) ? commissions.filter(commission => {
    const matchesSearch = !searchQuery.trim() || 
      commission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.agentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.agentEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }) : []
  
  // Navigate to commission detail
  const handleViewClick = (commissionId: string) => {
    router.push(`/super-admin/commissions/${commissionId}`)
  }
  
  // Handle mark paid click
  const handleMarkPaidClick = (commissionId: string) => {
    setSelectedCommissionId(commissionId)
    setShowMarkPaidModal(true)
  }
  
  // Confirm mark paid
  const handleConfirmMarkPaid = async () => {
    if (!selectedCommissionId) return
    
    try {
      setMarkingPaid(true)
      await markSuperAdminCommissionPaid(selectedCommissionId)
      setToast({ message: 'Commission marked as paid successfully!', type: 'success' })
      setShowMarkPaidModal(false)
      setSelectedCommissionId(null)
      // Refetch list
      loadCommissions(dateFrom, dateTo, statusFilter, agentIdFilter, pagination.page)
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to mark commission as paid', type: 'error' })
    } finally {
      setMarkingPaid(false)
    }
  }
  
  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }
  
  // Truncate ID for display
  const truncateId = (id: string) => {
    if (!id) return 'N/A'
    return id.length > 8 ? `${id.substring(0, 8)}...` : id
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
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">Agent Commissions</h1>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-text-light">Manage agent commission payments</p>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* DEBUG: Temporary dev-only block - REMOVE AFTER VERIFICATION */}
      {!loading && !error && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
          <p className="font-bold text-yellow-800 mb-2">🔍 DEBUG INFO (Remove after verification)</p>
          <div className="text-xs font-mono bg-white p-3 rounded overflow-auto max-h-40">
            <p className="font-bold mb-1">Aggregates:</p>
            <pre>{JSON.stringify(aggregates, null, 2)}</pre>
            {filteredCommissions.length > 0 && (
              <>
                <p className="font-bold mt-3 mb-1">First Commission Item:</p>
                <pre>{JSON.stringify({
                  id: filteredCommissions[0].id,
                  amountCents: filteredCommissions[0].amountCents,
                  status: filteredCommissions[0].status,
                  agentName: filteredCommissions[0].agentName
                }, null, 2)}</pre>
              </>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Pending Commissions</p>
            <p className="font-serif text-2xl font-bold text-orange-500">{aggregates.unpaidCount}</p>
            <p className="text-sm text-text-light mt-1">
              {formatRawCurrency(aggregates.pendingAmountCents ?? aggregates.unpaidAmountCents ?? 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Paid Commissions</p>
            <p className="font-serif text-2xl font-bold text-green">{aggregates.paidCount}</p>
            <p className="text-sm text-text-light mt-1">
              {formatRawCurrency(aggregates.paidAmountCents ?? 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Total Amount</p>
            <p className="font-serif text-2xl font-bold text-green">
              {formatRawCurrency(aggregates.totalAmountCents ?? 0)}
            </p>
            <p className="text-sm text-text-light mt-1">{aggregates.totalCommissions} total</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Search by ID, agent, booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
              placeholder="From"
            />
          </div>
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
              placeholder="To"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unpaid">Pending/Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Agent ID (optional)"
              value={agentIdFilter}
              onChange={(e) => setAgentIdFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Error Loading Commissions</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-4 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Commissions Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Commission ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Agent</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Booking ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton loading
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4 px-6"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                  </tr>
                ))
              ) : filteredCommissions.length > 0 ? (
                filteredCommissions.map((commission) => (
                  <tr 
                    key={commission.id} 
                    className="border-b border-gray-100 hover:bg-cream/50 transition-smooth"
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-yellow" title={commission.id}>
                        {truncateId(commission.id)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-light text-sm">
                      {formatDate(commission.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-text-dark">{commission.agentName || 'N/A'}</p>
                        {commission.agentEmail && (
                          <p className="text-sm text-text-light">{commission.agentEmail}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-text-light" title={commission.bookingId}>
                        {truncateId(commission.bookingId)}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-green">
                      {formatRawCurrency(commission.amountCents ?? 0)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        commission.status === 'PAID' 
                          ? 'bg-green/10 text-green' 
                          : 'bg-orange-50 text-orange-600'
                      }`}>
                        {commission.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewClick(commission.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {commission.status === 'UNPAID' && (
                          <button
                            onClick={() => handleMarkPaidClick(commission.id)}
                            className="px-3 py-1 bg-green text-white rounded-lg hover:bg-green-700 transition-smooth text-sm font-semibold"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="text-text-light">
                      <p className="text-lg mb-2">No commissions found</p>
                      <p className="text-sm">Try adjusting your filters or date range</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-text-light">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total commissions)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-cream transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-text-dark">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-cream transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mark Paid Confirmation Modal */}
      {showMarkPaidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-green mb-4">Confirm Mark as Paid</h3>
            <p className="text-text-dark mb-6">
              Are you sure you want to mark this commission as paid? This action will update the commission status.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowMarkPaidModal(false)
                  setSelectedCommissionId(null)
                }}
                disabled={markingPaid}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMarkPaid}
                disabled={markingPaid}
                className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markingPaid ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
