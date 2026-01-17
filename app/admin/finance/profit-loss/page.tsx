'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/src/utils/currency'
import { apiClient } from '@/src/services/apiClient'

interface ProfitLossSummary {
  totalIncome: number // In cents
  totalExpenses: number // In cents (from payables)
  totalPurchases: number // In cents (costs)
  netProfit: number // In cents (income - expenses - purchases)
}

interface BreakdownItem {
  name: string
  count: number
  total: number // In cents
}

interface Breakdowns {
  incomeBySource: BreakdownItem[]
  expensesByCategory: BreakdownItem[]
  purchasesByVendor: BreakdownItem[]
}

export default function ProfitLossPage() {
  const router = useRouter()
  
  // Request sequencing to prevent race conditions
  const reqSeqRef = useRef(0)
  
  // Filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState('')
  const [expenseMode, setExpenseMode] = useState<'approvedOnly' | 'includeSubmitted'>('approvedOnly')
  
  // Data
  const [summary, setSummary] = useState<ProfitLossSummary | null>(null)
  const [breakdowns, setBreakdowns] = useState<Breakdowns>({
    incomeBySource: [],
    expensesByCategory: [],
    purchasesByVendor: []
  })
  const [debugCounts, setDebugCounts] = useState<{
    income?: number
    expenses?: number
    purchases?: number
  }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Fetch profit & loss summary
  const fetchProfitLoss = async () => {
    setLoading(true)
    setError(null)
    
    // Increment request ID for sequencing
    const currentReqId = ++reqSeqRef.current
    
    try {
      // LOG: Trace input values before building params
      console.log('[P&L TRACE] Input values:', {
        dateFrom,
        dateTo,
        currencyFilter,
        expenseMode,
        requestId: currentReqId
      })
      
      // Build query params - ONLY include non-empty values
      const params = new URLSearchParams()
      params.append('includeBreakdown', 'true')
      
      // Only add 'from' if dateFrom is truthy and looks like valid date
      if (dateFrom && dateFrom.trim() && dateFrom.length >= 10) {
        params.append('from', dateFrom.trim())
      }
      
      // Only add 'to' if dateTo is truthy and looks like valid date
      if (dateTo && dateTo.trim() && dateTo.length >= 10) {
        params.append('to', dateTo.trim())
      }
      
      // Only include currency if user explicitly selected one (not "All")
      if (currencyFilter && currencyFilter.trim()) {
        params.append('currency', currencyFilter.trim())
      }
      
      // Always include expense mode (it has a default value)
      if (expenseMode) {
        params.append('expenseMode', expenseMode)
      }
      
      const requestUrl = `/finance/profit-loss?${params.toString()}`
      
      // LOG: Final request URL
      console.log('[P&L TRACE] Request URL:', requestUrl)
      console.log('[P&L TRACE] Request ID:', currentReqId)
      
      // Call unified profit-loss endpoint
      const response = await apiClient<any>(requestUrl, {
        method: 'GET',
      })
      
      // Check if this request is still the latest one
      if (currentReqId !== reqSeqRef.current) {
        console.log('[P&L TRACE] Discarding stale response. Current:', currentReqId, 'Latest:', reqSeqRef.current)
        return // Discard this response, a newer request is in flight or completed
      }
      
      // LOG: Response details
      console.log('[P&L TRACE] Response received:', {
        requestId: currentReqId,
        success: response.success,
        hasData: !!response.data
      })
      
      // Extract data from response
      const data = response.success ? response.data : response
      
      // LOG: Key values from API response
      console.log('[P&L TRACE] API Response:', {
        expenseModeSent: expenseMode,
        totalExpensesCentsFromAPI: data?.summary?.totalExpensesCents,
        totalIncomeCentsFromAPI: data?.summary?.totalIncomeCents,
        totalPurchasesCentsFromAPI: data?.summary?.totalPurchasesCents,
        debugCountsFromAPI: data?.debugCounts,
        requestId: currentReqId
      })
      
      // Calculate totals with NaN guards - READ FROM data.summary.xxxCents
      const totalIncome = Number.isFinite(Number(data?.summary?.totalIncomeCents ?? 0)) ? Number(data.summary.totalIncomeCents ?? 0) : 0
      const totalExpenses = Number.isFinite(Number(data?.summary?.totalExpensesCents ?? 0)) ? Number(data.summary.totalExpensesCents ?? 0) : 0
      const totalPurchases = Number.isFinite(Number(data?.summary?.totalPurchasesCents ?? 0)) ? Number(data.summary.totalPurchasesCents ?? 0) : 0
      const netProfit = Number.isFinite(Number(data?.summary?.netProfitCents ?? 0)) ? Number(data.summary.netProfitCents ?? 0) : totalIncome - totalExpenses - totalPurchases
      
      // TEMP DEBUG: Log computed totals (these are in CENTS)
      console.log('[P&L DEBUG] Computed Totals (in cents):', {
        totalIncome,
        totalExpenses,
        totalPurchases,
        netProfit
      })
      
      setSummary({
        totalIncome,
        totalExpenses,
        totalPurchases,
        netProfit
      })
      
      // Extract breakdowns
      const incomeBySource: BreakdownItem[] = []
      const expensesByCategory: BreakdownItem[] = []
      const purchasesByVendor: BreakdownItem[] = []
      
      // Process income breakdown
      if (data?.breakdown?.incomeBySource && Array.isArray(data.breakdown.incomeBySource)) {
        data.breakdown.incomeBySource.forEach((item: any) => {
          if (item && typeof item.total === 'number' && item.total > 0) {
            incomeBySource.push({
              name: item.source || item.name || 'Unknown',
              count: item.count || 1,
              total: item.total
            })
          }
        })
      }
      
      // Process expenses breakdown
      if (data?.breakdown?.expensesByCategory && Array.isArray(data.breakdown.expensesByCategory)) {
        data.breakdown.expensesByCategory.forEach((item: any) => {
          if (item && typeof item.total === 'number' && item.total > 0) {
            expensesByCategory.push({
              name: item.category || item.name || 'Unknown',
              count: item.count || 1,
              total: item.total
            })
          }
        })
      }
      
      // Process purchases breakdown
      if (data?.breakdown?.purchasesByCategory && Array.isArray(data.breakdown.purchasesByCategory)) {
        data.breakdown.purchasesByCategory.forEach((item: any) => {
          if (item && typeof item.total === 'number' && item.total > 0) {
            purchasesByVendor.push({
              name: item.category || item.name || 'Unknown',
              count: item.count || 1,
              total: item.total
            })
          }
        })
      }
      
      // TEMP DEBUG: Log breakdowns
      console.log('[P&L DEBUG] Breakdowns:', {
        incomeBySource,
        expensesByCategory,
        purchasesByVendor
      })
      
      setBreakdowns({
        incomeBySource,
        expensesByCategory,
        purchasesByVendor
      })
      
      // Extract debug counts if available
      if (data?.debugCounts) {
        setDebugCounts({
          income: data.debugCounts.income || 0,
          expenses: data.debugCounts.expenses || 0,
          purchases: data.debugCounts.purchases || 0
        })
      } else {
        // Fallback to breakdown counts
        setDebugCounts({
          income: incomeBySource.length,
          expenses: expensesByCategory.length,
          purchases: purchasesByVendor.length
        })
      }
      
      // LOG: Final state values being set
      console.log('[P&L TRACE] Setting state:', {
        totalIncome,
        totalExpenses,
        totalPurchases,
        netProfit,
        debugCounts: data?.debugCounts,
        requestId: currentReqId
      })
      
      // Set last updated timestamp
      setLastUpdated(new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }))
      
    } catch (err: any) {
      console.error('[P&L TRACE] Request failed:', {
        requestId: currentReqId,
        error: err.message,
        expenseMode
      })
      const errorMessage = err.message || 'Failed to load profit & loss data'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchProfitLoss()
  }, []) // Only run on mount

  // Handle apply filters
  const handleApplyFilters = () => {
    fetchProfitLoss()
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setDateFrom('')
    setDateTo('')
    setCurrencyFilter('')
    setExpenseMode('approvedOnly')
    // Trigger fetch after resetting
    setTimeout(() => {
      fetchProfitLoss()
    }, 50)
  }

  // Safe number conversion - prevents NaN in UI
  const safeNum = (value: any): number => {
    const num = Number(value)
    return Number.isFinite(num) ? num : 0
  }

  // Format currency using Intl.NumberFormat for breakdown tables
  const formatBreakdownCurrency = (amountCents: number): string => {
    const amount = amountCents / 100
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
    return `PKR ${formatted}`
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Profit & Loss</h1>
          <p className="text-text-light mt-1">View comprehensive financial performance overview</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-text-dark mb-4">Filters</h2>
        
        {/* Expense Mode Toggle */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <label className="block text-sm font-semibold text-text-dark mb-2">Expense Mode</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setExpenseMode('approvedOnly')
                // Trigger refetch after state update
                setTimeout(() => fetchProfitLoss(), 50)
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                expenseMode === 'approvedOnly'
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Approved Only
            </button>
            <button
              onClick={() => {
                setExpenseMode('includeSubmitted')
                // Trigger refetch after state update
                setTimeout(() => fetchProfitLoss(), 50)
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                expenseMode === 'includeSubmitted'
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Include Submitted
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {expenseMode === 'approvedOnly' 
              ? 'Only counting expenses with Approved status'
              : 'Counting expenses with Submitted or Approved status'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">To Date</label>
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
              <option value="">All Currencies</option>
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Apply'}
            </button>
            <button
              onClick={handleResetFilters}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-200 text-text-dark rounded-lg font-semibold hover:bg-gray-300 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>
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
              <p className="text-text-light text-sm mb-2">Total Income</p>
              <p className="font-serif text-3xl font-bold text-green">
                {formatCurrency(safeNum(summary.totalIncome))}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Expenses</p>
              <p className="font-serif text-3xl font-bold text-orange-600">
                {formatCurrency(safeNum(summary.totalExpenses))}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">
                  Counting: {expenseMode === 'approvedOnly' ? 'Approved only' : 'Submitted + Approved'}
                </p>
                <p className="text-xs text-gray-600">
                  Matched: {debugCounts.expenses ?? 0} expense{(debugCounts.expenses ?? 0) !== 1 ? 's' : ''}
                </p>
                {summary.totalExpenses === 0 && (
                  <p className="text-xs text-orange-600 italic mt-1">
                    No expenses matched filters. Check date range and status.
                  </p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Purchases (Costs)</p>
              <p className="font-serif text-3xl font-bold text-red-600">
                {formatCurrency(safeNum(summary.totalPurchases))}
              </p>
            </div>
            <div className={`bg-white rounded-lg shadow-lg p-6 ${
              summary.netProfit >= 0 ? 'border-l-4 border-green' : 'border-l-4 border-red-500'
            }`}>
              <p className="text-text-light text-sm mb-2">Net Profit</p>
              <p className={`font-serif text-3xl font-bold ${
                summary.netProfit >= 0 ? 'text-green' : 'text-red-600'
              }`}>
                {formatCurrency(safeNum(summary.netProfit))}
              </p>
            </div>
          </>
        ) : (
          // Fallback when no summary
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Income</p>
              <p className="font-serif text-3xl font-bold text-green">—</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Expenses</p>
              <p className="font-serif text-3xl font-bold text-orange-600">—</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Total Purchases (Costs)</p>
              <p className="font-serif text-3xl font-bold text-red-600">—</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-text-light text-sm mb-2">Net Profit</p>
              <p className="font-serif text-3xl font-bold text-green">—</p>
            </div>
          </>
        )}
      </div>

      {/* Breakdown Tables */}
      {!loading && !error && summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income by Source */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-cream border-b border-gray-200">
              <h3 className="font-semibold text-text-dark">Income by Source</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-text-dark uppercase tracking-wider">Source</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-text-dark uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {breakdowns.incomeBySource.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-text-light text-sm">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    breakdowns.incomeBySource.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6 text-sm text-text-dark">{item.name}</td>
                        <td className="py-3 px-6 text-sm text-green font-semibold text-right">
                          {formatBreakdownCurrency(item.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-cream border-b border-gray-200">
              <h3 className="font-semibold text-text-dark">Expenses by Category</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-text-dark uppercase tracking-wider">Category</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-text-dark uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {breakdowns.expensesByCategory.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-text-light text-sm">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    breakdowns.expensesByCategory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6 text-sm text-text-dark">{item.name}</td>
                        <td className="py-3 px-6 text-sm text-orange-600 font-semibold text-right">
                          {formatBreakdownCurrency(item.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchases by Vendor */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-cream border-b border-gray-200">
              <h3 className="font-semibold text-text-dark">Purchases by Category</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-text-dark uppercase tracking-wider">Category</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-text-dark uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {breakdowns.purchasesByVendor.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-text-light text-sm">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    breakdowns.purchasesByVendor.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6 text-sm text-text-dark">{item.name}</td>
                        <td className="py-3 px-6 text-sm text-red-600 font-semibold text-right">
                          {formatBreakdownCurrency(item.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-dark mb-2">Error Loading Data</h3>
          <p className="text-text-light mb-4">{error}</p>
          <button
            onClick={fetchProfitLoss}
            className="px-6 py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-700 transition-smooth"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && summary && 
       summary.totalIncome === 0 && 
       summary.totalExpenses === 0 && 
       summary.totalPurchases === 0 && 
       breakdowns.incomeBySource.length === 0 &&
       breakdowns.expensesByCategory.length === 0 &&
       breakdowns.purchasesByVendor.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-dark mb-2">No Financial Data</h3>
          <p className="text-text-light mb-4">
            {dateFrom || dateTo 
              ? 'No financial records found for the selected date range.'
              : 'No financial records available yet. Start by adding income, expenses, or purchases.'}
          </p>
        </div>
      )}

      {/* Financial Breakdown (if data exists) */}
      {!loading && !error && summary && 
       (summary.totalIncome > 0 || summary.totalExpenses > 0 || summary.totalPurchases > 0) && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-6">Financial Breakdown</h2>
          
          <div className="space-y-4">
            {/* Income Section */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-dark">Revenue (Income)</p>
                  <p className="text-sm text-text-light">Total income from all sources</p>
                </div>
              </div>
              <p className="font-serif text-2xl font-bold text-green">
                {formatCurrency(safeNum(summary.totalIncome))}
              </p>
            </div>

            {/* Expenses Section */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-dark">Operating Expenses</p>
                  <p className="text-sm text-text-light">Payables and other expenses</p>
                </div>
              </div>
              <p className="font-serif text-2xl font-bold text-orange-600">
                {formatCurrency(safeNum(summary.totalExpenses))}
              </p>
            </div>

            {/* Purchases Section */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-dark">Cost of Goods (Purchases)</p>
                  <p className="text-sm text-text-light">Direct costs and purchases</p>
                </div>
              </div>
              <p className="font-serif text-2xl font-bold text-red-600">
                {formatCurrency(safeNum(summary.totalPurchases))}
              </p>
            </div>

            {/* Net Profit Section */}
            <div className={`flex items-center justify-between py-4 mt-2 rounded-lg px-4 ${
              summary.netProfit >= 0 ? 'bg-green/5' : 'bg-red-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  summary.netProfit >= 0 ? 'bg-green' : 'bg-red-500'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg text-text-dark">Net Profit / Loss</p>
                  <p className="text-sm text-text-light">
                    Income - Expenses - Purchases
                  </p>
                </div>
              </div>
              <p className={`font-serif text-3xl font-bold ${
                summary.netProfit >= 0 ? 'text-green' : 'text-red-600'
              }`}>
                {summary.netProfit >= 0 ? '+' : ''}{formatCurrency(safeNum(summary.netProfit))}
              </p>
            </div>
          </div>

          {/* Profit Margin Calculation */}
          {summary.totalIncome > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-dark">Profit Margin</p>
                  <p className="text-sm text-text-light">Percentage of income retained as profit</p>
                </div>
                <p className={`font-serif text-2xl font-bold ${
                  summary.netProfit >= 0 ? 'text-green' : 'text-red-600'
                }`}>
                  {((summary.netProfit / summary.totalIncome) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
