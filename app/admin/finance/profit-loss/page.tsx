'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/src/utils/currency'
import { apiClient } from '@/src/services/apiClient'
import { fetchPurchasesSummary } from '@/src/services/purchases.api'

interface ProfitLossSummary {
  totalIncome: number // In cents
  totalExpenses: number // In cents (from payables)
  totalPurchases: number // In cents (costs)
  netProfit: number // In cents (income - expenses - purchases)
  currency?: string
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
  
  // Filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState('PKR')
  
  // Data
  const [summary, setSummary] = useState<ProfitLossSummary | null>(null)
  const [breakdowns, setBreakdowns] = useState<Breakdowns>({
    incomeBySource: [],
    expensesByCategory: [],
    purchasesByVendor: []
  })
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
    
    try {
      // Fetch income summary
      const incomeParams = new URLSearchParams()
      if (dateFrom && dateFrom.trim()) incomeParams.append('startDate', dateFrom.trim())
      if (dateTo && dateTo.trim()) incomeParams.append('endDate', dateTo.trim())
      
      const incomeResponse = await apiClient<any>(`/finance/income/summary?${incomeParams.toString()}`, {
        method: 'GET',
      })
      
      // Fetch purchases summary
      const purchasesParams: any = {}
      if (dateFrom && dateFrom.trim()) purchasesParams.dateFrom = dateFrom.trim()
      if (dateTo && dateTo.trim()) purchasesParams.dateTo = dateTo.trim()
      
      const purchasesResponse = await fetchPurchasesSummary(purchasesParams)
      
      // Fetch payables summary (expenses)
      const payablesParams = new URLSearchParams()
      if (dateFrom && dateFrom.trim()) payablesParams.append('startDate', dateFrom.trim())
      if (dateTo && dateTo.trim()) payablesParams.append('endDate', dateTo.trim())
      
      const payablesResponse = await apiClient<any>(`/finance/payables/summary?${payablesParams.toString()}`, {
        method: 'GET',
      })
      
      // Calculate totals with NaN guards
      let totalIncome = 0
      let totalExpenses = 0
      let totalPurchases = 0
      
      // Extract income total with NaN guard
      if (incomeResponse.success && incomeResponse.data) {
        const val = Number(incomeResponse.data.totalIncome ?? 0)
        totalIncome = Number.isFinite(val) ? val : 0
      } else if (incomeResponse.totalIncome !== undefined) {
        const val = Number(incomeResponse.totalIncome ?? 0)
        totalIncome = Number.isFinite(val) ? val : 0
      }
      
      // Extract purchases total (costs) with NaN guard
      if (purchasesResponse.success && purchasesResponse.data) {
        const val = Number(purchasesResponse.data.totalPurchases ?? 0)
        totalPurchases = Number.isFinite(val) ? val : 0
      }
      
      // Extract payables total (expenses) with NaN guard
      if (payablesResponse.success && payablesResponse.data) {
        const val = Number(payablesResponse.data.totalPayables ?? 0)
        totalExpenses = Number.isFinite(val) ? val : 0
      } else if (payablesResponse.totalPayables !== undefined) {
        const val = Number(payablesResponse.totalPayables ?? 0)
        totalExpenses = Number.isFinite(val) ? val : 0
      }
      
      // Calculate net profit (can be negative)
      const netProfit = totalIncome - totalExpenses - totalPurchases
      
      setSummary({
        totalIncome,
        totalExpenses,
        totalPurchases,
        netProfit,
        currency: currencyFilter
      })
      
      // Extract breakdowns
      const incomeBySource: BreakdownItem[] = []
      const expensesByCategory: BreakdownItem[] = []
      const purchasesByVendor: BreakdownItem[] = []
      
      // Process income by source
      const incomeData = incomeResponse.success ? incomeResponse.data : incomeResponse
      if (incomeData?.bySource) {
        Object.entries(incomeData.bySource).forEach(([source, total]: [string, any]) => {
          if (typeof total === 'number' && total > 0) {
            incomeBySource.push({ name: source, count: 1, total })
          }
        })
      }
      
      // Process expenses by category
      const payablesData = payablesResponse.success ? payablesResponse.data : payablesResponse
      if (payablesData?.byCategory) {
        Object.entries(payablesData.byCategory).forEach(([category, total]: [string, any]) => {
          if (typeof total === 'number' && total > 0) {
            expensesByCategory.push({ name: category, count: 1, total })
          }
        })
      }
      
      // Process purchases by vendor (or category)
      const purchasesData = purchasesResponse.success ? purchasesResponse.data : purchasesResponse
      if ((purchasesData as any)?.byCategory) {
        Object.entries((purchasesData as any).byCategory).forEach(([vendor, total]: [string, any]) => {
          if (typeof total === 'number' && total > 0) {
            purchasesByVendor.push({ name: vendor, count: 1, total })
          }
        })
      }
      
      setBreakdowns({
        incomeBySource,
        expensesByCategory,
        purchasesByVendor
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
      console.error('[Profit & Loss] Failed to fetch data:', err)
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
    setCurrencyFilter('PKR')
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
       summary.totalPurchases === 0 && (
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
