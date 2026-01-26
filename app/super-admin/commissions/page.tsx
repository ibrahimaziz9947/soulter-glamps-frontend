'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getSuperAdminCommissions, 
  markSuperAdminCommissionPaid,
  type SuperAdminCommission 
} from '@/src/services/super-admin-commissions.api'
import { formatMoney } from '@/src/utils/currency'

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
    totalAmount: number
    paidAmount: number
    pendingAmount?: number
    unpaidAmount?: number
  }>({
    totalCommissions: 0,
    paidCount: 0,
    unpaidCount: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    unpaidAmount: 0
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
      
      const params: {
        page: number
        limit: number
        from?: string
        to?: string
        status?: string
        agentId?: string
      } = {
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
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        unpaidAmount: 0
      })
      setPagination(response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 })
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    } catch (err: unknown) {
      let errorMessage = 'Failed to load commissions'
      if (typeof err === 'object' && err !== null) {
        const e = err as { message?: string; status?: number }
        if (e.message) {
          errorMessage = e.message
        }
        if (typeof e.status === 'number') {
          errorMessage = `[${e.status}] ${errorMessage}`
        }
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
    loadCommissions(from, to, undefined, undefined, 1)
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
    } catch (err: unknown) {
      let message = 'Failed to mark commission as paid'
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        message = (err as { message?: string }).message as string
      }
      setToast({ message, type: 'error' })
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

      {/* KPI Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Commissions Card */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-orange-700 text-sm font-semibold uppercase tracking-wide mb-1">Pending</p>
                <p className="font-serif text-3xl font-bold text-orange-600">{aggregates.unpaidCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-200">
              <p className="text-2xl font-bold text-orange-700">
                {formatMoney(aggregates.pendingAmount ?? aggregates.unpaidAmount ?? 0)}
              </p>
              <p className="text-xs text-orange-600 mt-1">Awaiting payment</p>
            </div>
          </div>

          {/* Paid Commissions Card */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg p-6 border-l-4 border-green hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-green text-sm font-semibold uppercase tracking-wide mb-1">Paid</p>
                <p className="font-serif text-3xl font-bold text-green">{aggregates.paidCount}</p>
              </div>
              <div className="bg-green/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green/20">
              <p className="text-2xl font-bold text-green">
                {formatMoney(aggregates.paidAmount ?? 0)}
              </p>
              <p className="text-xs text-green/70 mt-1">Successfully processed</p>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-gradient-to-br from-yellow/10 to-white rounded-xl shadow-lg p-6 border-l-4 border-yellow hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-yellow text-sm font-semibold uppercase tracking-wide mb-1">Total Amount</p>
                <p className="font-serif text-3xl font-bold text-gray-700">{aggregates.totalCommissions}</p>
              </div>
              <div className="bg-yellow/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-yellow/20">
              <p className="text-2xl font-bold text-gray-800">
                {formatMoney(aggregates.totalAmount ?? 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">All commissions combined</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="font-serif text-lg font-bold text-gray-800">Filter & Search</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Search by ID, agent, booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow transition-all"
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
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow transition-all"
              placeholder="From"
            />
          </div>
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow transition-all"
              placeholder="To"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow transition-all font-medium"
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
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow transition-all"
            />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="px-8 py-2.5 bg-gradient-to-r from-green to-green-700 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-green to-green/90 px-6 py-4">
          <h2 className="text-xl font-serif font-bold text-white">Commission Records</h2>
          <p className="text-green-50 text-sm mt-1">View and manage all agent commissions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-cream to-yellow/10 border-b-2 border-yellow/30">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Commission ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Agent</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Booking ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
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
                filteredCommissions.map((commission, index) => (
                  <tr 
                    key={commission.id} 
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-cream/30 hover:to-transparent transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-semibold text-yellow bg-yellow/10 px-2 py-1 rounded" title={commission.id}>
                        {truncateId(commission.id)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{formatDate(commission.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-800">{commission.agentName || 'N/A'}</p>
                        {commission.agentEmail && (
                          <p className="text-xs text-gray-500 mt-0.5">{commission.agentEmail}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded" title={commission.bookingId}>
                        {truncateId(commission.bookingId)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-lg text-green">
                        {formatMoney(commission.amount ?? 0)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        commission.status === 'PAID' 
                          ? 'bg-green/10 text-green border border-green/20' 
                          : 'bg-orange-50 text-orange-600 border border-orange-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          commission.status === 'PAID' ? 'bg-green' : 'bg-orange-500'
                        }`}></span>
                        {commission.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewClick(commission.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
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
                            className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green-700 transition-all text-sm font-bold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
          <div className="flex items-center justify-between px-6 py-5 border-t-2 border-gray-100 bg-gradient-to-r from-cream/30 to-transparent">
            <p className="text-sm text-gray-600 font-medium">
              Showing page <span className="font-bold text-green">{pagination.page}</span> of <span className="font-bold">{pagination.totalPages}</span> 
              <span className="text-gray-400 ml-2">({pagination.total} total commissions)</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-5 py-2 border-2 border-gray-300 rounded-lg hover:bg-green hover:text-white hover:border-green transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="px-5 py-2 text-sm font-bold text-gray-700 bg-yellow/20 rounded-lg border-2 border-yellow/30">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-5 py-2 border-2 border-gray-300 rounded-lg hover:bg-green hover:text-white hover:border-green transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
