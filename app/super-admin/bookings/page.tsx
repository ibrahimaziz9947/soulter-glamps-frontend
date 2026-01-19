'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSuperAdminBookings, type SuperAdminBooking } from '@/src/services/super-admin-bookings.api'
import { formatRawCurrency } from '@/src/utils/currency'

export default function SuperAdminBookingsPage() {
  const router = useRouter()
  
  // State
  const [bookings, setBookings] = useState<SuperAdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  
  // Aggregates from API
  const [aggregates, setAggregates] = useState({
    totalBookings: 0,
    confirmedCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    completedCount: 0,
    revenueCents: 0
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
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  // Helper to calculate last 30 days
  const getLast30Days = (): { from: string; to: string } => {
    const now = new Date()
    const to = now.toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)
    const from = thirtyDaysAgo.toISOString().split('T')[0]
    return { from, to }
  }
  
  // Fetch bookings
  const loadBookings = async (from?: string, to?: string, status?: string, page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page,
        limit: 10
      }
      if (from) params.from = from
      if (to) params.to = to
      if (status && status !== 'all') params.status = status.toUpperCase()
      
      // Debug logging (dev only)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Super Admin Bookings] Request params:', params)
        console.log('[Super Admin Bookings] Full URL:', `/api/super-admin/bookings?${new URLSearchParams(params).toString()}`)
      }
      
      const response = await getSuperAdminBookings(params)
      
      // Debug logging (dev only)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Super Admin Bookings] Response:', response)
        setDebugInfo({
          requestParams: params,
          requestUrl: `/api/super-admin/bookings?${new URLSearchParams(params).toString()}`,
          responseItemsCount: response.items?.length || 0,
          responseAggregates: response.aggregates,
          responseMeta: response.meta
        })
      }
      
      // Set data from structured response
      setBookings(Array.isArray(response.items) ? response.items : [])
      setAggregates(response.aggregates || {
        totalBookings: 0,
        confirmedCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
        completedCount: 0,
        revenueCents: 0
      })
      setPagination(response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 })
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    } catch (err: any) {
      let errorMessage = 'Failed to load bookings'
      if (err.message) {
        errorMessage = err.message
      } else if (err.data?.message) {
        errorMessage = err.data.message
      } else if (err.data?.error) {
        errorMessage = err.data.error
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
    loadBookings(from, to, statusFilter, 1)
  }, [])
  
  // Handle filter apply
  const handleApplyFilters = () => {
    loadBookings(dateFrom, dateTo, statusFilter, 1)
  }
  
  // Handle retry
  const handleRetry = () => {
    loadBookings(dateFrom, dateTo, statusFilter, pagination.page)
  }
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    loadBookings(dateFrom, dateTo, statusFilter, newPage)
  }
  
  // Filter by search query (client-side) with defensive checks
  const filteredBookings = Array.isArray(bookings) ? bookings.filter(booking => {
    const matchesSearch = !searchQuery.trim() || 
      booking.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }) : []
  
  // Navigate to booking detail
  const handleRowClick = (bookingId: string) => {
    router.push(`/super-admin/bookings/${bookingId}`)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">All Bookings</h1>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-text-light">View and manage all bookings across the system</p>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Debug Panel (dev only) */}
      {process.env.NODE_ENV !== 'production' && debugInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs font-mono">
          <details>
            <summary className="cursor-pointer font-semibold text-blue-800 mb-2">🔍 Debug Info (Click to expand)</summary>
            <div className="space-y-2 mt-2">
              <div>
                <strong className="text-blue-900">Request URL:</strong>
                <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">{debugInfo.requestUrl}</pre>
              </div>
              <div>
                <strong className="text-blue-900">Request Params:</strong>
                <pre className="bg-white p-2 rounded mt-1">{JSON.stringify(debugInfo.requestParams, null, 2)}</pre>
              </div>
              <div>
                <strong className="text-blue-900">Response Items Count:</strong>
                <span className="bg-white p-2 rounded ml-2">{debugInfo.responseItemsCount}</span>
              </div>
              <div>
                <strong className="text-blue-900">Response Aggregates:</strong>
                <pre className="bg-white p-2 rounded mt-1">{JSON.stringify(debugInfo.responseAggregates, null, 2)}</pre>
              </div>
              <div>
                <strong className="text-blue-900">Response Meta:</strong>
                <pre className="bg-white p-2 rounded mt-1">{JSON.stringify(debugInfo.responseMeta, null, 2)}</pre>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Total Bookings</p>
            <p className="font-serif text-3xl font-bold text-green">{aggregates.totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Confirmed</p>
            <p className="font-serif text-3xl font-bold text-green">{aggregates.confirmedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Pending</p>
            <p className="font-serif text-3xl font-bold text-yellow">{aggregates.pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Cancelled</p>
            <p className="font-serif text-3xl font-bold text-red-500">{aggregates.cancelledCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Total Revenue</p>
            <p className="font-serif text-3xl font-bold text-green">{formatRawCurrency(aggregates.revenueCents)}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Search by booking ID or customer name..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
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
                <h3 className="font-semibold text-red-800">Error Loading Bookings</h3>
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

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Booking ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Glamp</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Source/Agent</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
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
                    <td className="py-4 px-6"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="py-4 px-6"><div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div></td>
                  </tr>
                ))
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    onClick={() => handleRowClick(booking.id)}
                    className="border-b border-gray-100 hover:bg-cream/50 transition-smooth cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-yellow">{booking.id}</span>
                    </td>
                    <td className="py-4 px-6 text-text-light text-sm">{formatDate(booking.checkInDate)}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-text-dark">{booking.customerName || 'N/A'}</p>
                        {booking.customerEmail && (
                          <p className="text-sm text-text-light">{booking.customerEmail}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-dark">{booking.glampName || 'Unknown'}</td>
                    <td className="py-4 px-6 font-semibold text-green">{formatRawCurrency(booking.totalAmountCents ?? 0)}</td>
                    <td className="py-4 px-6 text-sm text-text-light">
                      {booking.agentId ? (booking.agentName || 'Agent') : 'Direct'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'CONFIRMED' 
                          ? 'bg-green/10 text-green' 
                          : booking.status === 'PENDING'
                          ? 'bg-yellow/10 text-yellow'
                          : booking.status === 'COMPLETED'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {booking.status.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="text-text-light">
                      <p className="text-lg mb-2">No bookings found</p>
                      <p className="text-sm">Try adjusting your filters or date range</p>
                      {process.env.NODE_ENV !== 'production' && (
                        <p className="text-xs mt-2 text-blue-600">Check console and debug panel above for API details</p>
                      )}
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
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total bookings)
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
    </div>
  )
}
