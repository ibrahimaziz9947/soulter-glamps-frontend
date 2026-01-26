'use client'

import { useState, useEffect } from 'react'
import { getSuperAdminFinanceSummary, type SuperAdminFinanceSummary } from '@/src/services/super-admin-finance.api'
import { formatMoney } from '@/src/utils/currency'

export default function SuperAdminFinancePage() {
  // State
  const [financeSummary, setFinanceSummary] = useState<SuperAdminFinanceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  
  // Filters
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
  
  // Fetch finance summary
  const loadFinanceSummary = async (from?: string, to?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {}
      if (from && from.trim()) params.from = from.trim()
      if (to && to.trim()) params.to = to.trim()
      
      const data = await getSuperAdminFinanceSummary(params)
      setFinanceSummary(data)
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    } catch (err: any) {
      let errorMessage = 'Failed to load finance summary'
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
    loadFinanceSummary(from, to)
  }, [])
  
  // Handle filter apply
  const handleApplyFilters = () => {
    loadFinanceSummary(dateFrom, dateTo)
  }
  
  // Handle retry
  const handleRetry = () => {
    loadFinanceSummary(dateFrom, dateTo)
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
  
  // Safe accessor for ledger entries
  const getLedgerEntries = () => {
    if (!financeSummary) return []
    // Try ledger.latestEntries first, then fall back to latestEntries
    if (financeSummary.ledger?.latestEntries && Array.isArray(financeSummary.ledger.latestEntries)) {
      return financeSummary.ledger.latestEntries
    }
    if (financeSummary.latestEntries && Array.isArray(financeSummary.latestEntries)) {
      return financeSummary.latestEntries
    }
    return []
  }

  return (
    <div className="space-y-6">
      {/* Dev Debug Panel - Remove after verification */}
      {process.env.NODE_ENV !== 'production' && financeSummary && !loading && !error && (
        <details className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs font-mono">
          <summary className="cursor-pointer font-semibold text-blue-800 mb-2">🔍 Debug: API Response Keys</summary>
          <div className="space-y-2 mt-2">
            <div>
              <strong className="text-blue-900">Top-level keys:</strong>
              <pre className="bg-white p-2 rounded mt-1">{JSON.stringify(Object.keys(financeSummary), null, 2)}</pre>
            </div>
            <div>
              <strong className="text-blue-900">Ledger entries count:</strong>
              <span className="bg-white p-2 rounded ml-2">{getLedgerEntries().length}</span>
            </div>
          </div>
        </details>
      )}
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">Financial Overview</h1>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-text-light">High-level financial insights and metrics</p>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="w-full px-6 py-2 bg-green text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Error Loading Finance Data</h3>
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

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : financeSummary && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green rounded-lg flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
            <h3 className="text-text-light text-sm mb-1">Total Revenue</h3>
            <p className="font-serif text-3xl font-bold text-green">
              {(() => {
                const amount = financeSummary.totals?.totalRevenue ?? financeSummary.profitLoss?.revenue ?? 0;
                console.log('[Super-Admin Finance] Raw revenue:', amount);
                const formatted = formatMoney(amount);
                console.log('[Super-Admin Finance] Formatted revenue:', formatted);
                return formatted;
              })()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-2xl">
                💸
              </div>
            </div>
            <h3 className="text-text-light text-sm mb-1">Total Expenses</h3>
            <p className="font-serif text-3xl font-bold text-red-500">
              {(() => {
                const amount = financeSummary.totals?.totalExpenses ?? financeSummary.profitLoss?.expense ?? 0;
                console.log('[Super-Admin Finance] Raw expenses:', amount);
                const formatted = formatMoney(amount);
                console.log('[Super-Admin Finance] Formatted expenses:', formatted);
                return formatted;
              })()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow rounded-lg flex items-center justify-center text-2xl">
                📈
              </div>
            </div>
            <h3 className="text-text-light text-sm mb-1">Net Profit</h3>
            <p className={`font-serif text-3xl font-bold ${
              (financeSummary.totals?.netProfit ?? financeSummary.profitLoss?.profit ?? 0) >= 0 ? 'text-green' : 'text-red-500'
            }`}>
              {(() => {
                const amount = financeSummary.totals?.netProfit ?? financeSummary.profitLoss?.profit ?? 0;
                console.log('[Super-Admin Finance] Raw profit:', amount);
                const formatted = formatMoney(amount);
                console.log('[Super-Admin Finance] Formatted profit:', formatted);
                return formatted;
              })()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl">
                ⏰
              </div>
            </div>
            <h3 className="text-text-light text-sm mb-1">Open Payables</h3>
            <p className="font-serif text-3xl font-bold text-orange-500">
              {(() => {
                const amount = financeSummary.openPayables?.amount ?? financeSummary.payables?.openAmount ?? 0;
                console.log('[Super-Admin Finance] Raw payables:', amount);
                const formatted = formatMoney(amount);
                console.log('[Super-Admin Finance] Formatted payables:', formatted);
                return formatted;
              })()}
            </p>
            <p className="text-sm text-text-light mt-1">{financeSummary.openPayables?.count ?? financeSummary.payables?.openCount ?? 0} items</p>
          </div>
        </div>
      )}

      {/* Ledger Preview Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 flex-1 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ) : financeSummary && !error && getLedgerEntries().length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-serif text-2xl font-bold text-green">Recent Ledger Entries</h2>
            <p className="text-text-light text-sm mt-1">Latest {getLedgerEntries().length} transactions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                </tr>
              </thead>
              <tbody>
                {getLedgerEntries().map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6 text-text-light text-sm">
                      {formatDate(entry.date)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.type === 'INCOME' 
                          ? 'bg-green/10 text-green' 
                          : entry.type === 'EXPENSE'
                          ? 'bg-red-500/10 text-red-600'
                          : entry.type === 'PAYABLE'
                          ? 'bg-orange-50 text-orange-600'
                          : 'bg-purple-500/10 text-purple-600'
                      }`}>
                        {entry.type.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-dark text-sm">
                      {entry.categoryLabel || entry.category || entry.type.toLowerCase()}
                    </td>
                    <td className="py-4 px-6 text-text-dark">
                      {entry.description || entry.title || entry.reference || entry.vendorName || '—'}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span className={
                        entry.type === 'INCOME' 
                          ? 'text-green' 
                          : entry.type === 'EXPENSE'
                          ? 'text-red-500'
                          : 'text-text-dark'
                      }>
                        {(() => {
                          const amount = entry.amount ?? 0;
                          console.log(`[Super-Admin Finance Ledger] Entry ${entry.id} raw amount:`, amount, 'Type:', entry.type);
                          const formatted = formatMoney(amount);
                          console.log(`[Super-Admin Finance Ledger] Entry ${entry.id} formatted:`, formatted);
                          return formatted;
                        })()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {entry.status ? (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          entry.status === 'PAID' || entry.status === 'COMPLETED'
                            ? 'bg-green/10 text-green' 
                            : 'bg-yellow/10 text-yellow'
                        }`}>
                          {entry.status.toLowerCase()}
                        </span>
                      ) : (
                        <span className="text-text-light text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && !error && financeSummary && getLedgerEntries().length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-text-light">
            <p className="text-lg mb-2">No ledger entries found</p>
            <p className="text-sm">Try adjusting your date range</p>
          </div>
        </div>
      )}

      {/* Detailed Finance Modules Navigation */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="font-serif text-2xl font-bold text-green mb-6">Detailed Finance Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/finance/profit-loss"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-green block">Profit & Loss</span>
                  <span className="text-sm text-text-light">View P&L statements</span>
                </div>
              </div>
            </a>

            <a
              href="/admin/finance/statements"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-green block">Statements/Ledger</span>
                  <span className="text-sm text-text-light">View general ledger</span>
                </div>
              </div>
            </a>

            <a
              href="/admin/finance/expenses"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-green block">Expenses</span>
                  <span className="text-sm text-text-light">Manage expenses</span>
                </div>
              </div>
            </a>

            <a
              href="/admin/finance/income"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-green block">Income</span>
                  <span className="text-sm text-text-light">Track income entries</span>
                </div>
              </div>
            </a>

            <a
              href="/admin/finance/purchases"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-green block">Purchases</span>
                  <span className="text-sm text-text-light">Manage purchases</span>
                </div>
              </div>
            </a>

            <a
              href="/admin/finance/payables"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-green block">Payables</span>
                  <span className="text-sm text-text-light">Track payables</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
