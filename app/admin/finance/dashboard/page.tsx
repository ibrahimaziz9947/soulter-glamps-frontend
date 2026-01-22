'use client'

import { useState, useEffect } from 'react'
import { fetchFinanceDashboard, type FinanceDashboardData } from '@/src/services/finance.api'
import { formatMoney } from '@/src/utils/currency'

export default function FinanceDashboard() {
  const [dashboardData, setDashboardData] = useState<FinanceDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter state
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [activeFilter, setActiveFilter] = useState<'thisMonth' | 'last30Days' | 'custom'>('thisMonth')
  
  // Helper to calculate date ranges
  const getDateRange = (filter: 'thisMonth' | 'last30Days'): { from: string; to: string } => {
    const now = new Date()
    const to = now.toISOString().split('T')[0]
    
    if (filter === 'thisMonth') {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: firstDayOfMonth.toISOString().split('T')[0], to }
    } else {
      // Last 30 days
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(now.getDate() - 30)
      return { from: thirtyDaysAgo.toISOString().split('T')[0], to }
    }
  }
  
  // Fetch dashboard data
  const loadDashboard = async (from?: string, to?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Validate date range format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (from && !dateRegex.test(from)) {
        throw new Error(`Invalid 'from' date format: ${from}. Expected YYYY-MM-DD`)
      }
      if (to && !dateRegex.test(to)) {
        throw new Error(`Invalid 'to' date format: ${to}. Expected YYYY-MM-DD`)
      }
      
      // Comprehensive logging for debugging
      console.log('[Dashboard] Request params:', {
        from: from || 'not set',
        to: to || 'not set',
        limit: 10,
        dateRange: from && to ? `${from} to ${to}` : 'no range specified'
      })
      
      const data = await fetchFinanceDashboard({
        from,
        to,
        limit: 10 // Use default of 10 for dashboard
      })
      
      // Success logging
      console.log('[Dashboard] ✓ Data received successfully:', {
        totalIncome: data.kpis.totalIncomeCents,
        totalExpenses: data.kpis.totalExpensesCents,
        netProfit: data.kpis.netProfitCents,
        pendingPayables: data.kpis.pendingPayablesCents,
        netCashFlow: data.kpis.netCashFlowCents,
        inventoryValue: data.kpis.inventoryValueCents,
        transactionCount: data.recentTransactions.length
      })
      
      setDashboardData(data)
    } catch (err: any) {
      // Enhanced error logging
      console.error('[Dashboard] ✗ Failed to load:', {
        message: err.message,
        status: err.status,
        data: err.data,
        stack: err.stack
      })
      
      // Extract the most relevant error message
      let errorMessage = 'Failed to load dashboard data'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err.data?.message) {
        errorMessage = err.data.message
      } else if (err.data?.error) {
        errorMessage = err.data.error
      }
      
      // Add status code to error if available
      if (err.status) {
        errorMessage = `[${err.status}] ${errorMessage}`
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  // Initial fetch with "This month" range
  useEffect(() => {
    const { from, to } = getDateRange('thisMonth')
    setDateFrom(from)
    setDateTo(to)
    loadDashboard(from, to)
  }, [])
  
  // Handle quick filter button clicks
  const handleQuickFilter = (filter: 'thisMonth' | 'last30Days') => {
    setActiveFilter(filter)
    const { from, to } = getDateRange(filter)
    setDateFrom(from)
    setDateTo(to)
    loadDashboard(from, to)
  }
  
  // Handle custom date range apply
  const handleApplyCustomRange = () => {
    setActiveFilter('custom')
    loadDashboard(dateFrom, dateTo)
  }
  
  // Currency formatting helper (consistent with Statements page)
  const formatTransactionCurrency = (amountCents: number, currency: string = 'PKR'): string => {
    const amount = amountCents / 100
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
    return `${currency} ${formatted}`
  }
  
  // Generate summary cards from API data
  const summaryCards = dashboardData ? [
    {
      label: 'Total Income',
      value: (() => {
        const amount = dashboardData.kpis.totalIncomeCents;
        console.log('[Finance Dashboard] Total Income raw:', amount);
        const formatted = formatMoney(amount);
        console.log('[Finance Dashboard] Total Income formatted:', formatted);
        return formatted;
      })(),
      icon: '💰', 
      color: 'bg-green' 
    },
    {
      label: 'Total Expenses',
      value: (() => {
        const amount = dashboardData.kpis.totalExpensesCents;
        console.log('[Finance Dashboard] Total Expenses raw:', amount);
        const formatted = formatMoney(amount);
        console.log('[Finance Dashboard] Total Expenses formatted:', formatted);
        return formatted;
      })(),
      icon: '💸', 
      color: 'bg-red-500' 
    },
    {
      label: 'Net Profit',
      value: (() => {
        const amount = dashboardData.kpis.netProfitCents;
        console.log('[Finance Dashboard] Net Profit raw:', amount);
        const formatted = formatMoney(amount);
        console.log('[Finance Dashboard] Net Profit formatted:', formatted);
        return formatted;
      })(),
      icon: '📈', 
      color: 'bg-yellow' 
    },
    {
      label: 'Pending Payables',
      value: (() => {
        const amount = dashboardData.kpis.pendingPayablesCents;
        console.log('[Finance Dashboard] Pending Payables raw:', amount);
        const formatted = formatMoney(amount);
        console.log('[Finance Dashboard] Pending Payables formatted:', formatted);
        return formatted;
      })(),
      icon: '⏰', 
      color: 'bg-orange-500' 
    },
    {
      label: 'Net Cash Flow',
      value: (() => {
        const amount = dashboardData.kpis.netCashFlowCents ?? 0;
        console.log('[Finance Dashboard] Net Cash Flow raw:', amount);
        const formatted = formatMoney(amount);
        console.log('[Finance Dashboard] Net Cash Flow formatted:', formatted);
        return formatted;
      })(),
      icon: '💵', 
      color: 'bg-blue-500' 
    },
    {
      label: 'Inventory Value',
      value: (() => {
        const amount = dashboardData.kpis.inventoryValueCents ?? 0;
        console.log('[Finance Dashboard] Inventory Value raw:', amount);
        const formatted = formatMoney(amount);
        console.log('[Finance Dashboard] Inventory Value formatted:', formatted);
        return formatted;
      })(),
      icon: '📦', 
      color: 'bg-purple-500' 
    },
  ] : []

  const quickLinks = [
    { title: 'Daily Expenses', href: '/admin/finance/expenses', icon: '📝', color: 'bg-red-500' },
    { title: 'Expense Categories', href: '/admin/finance/categories', icon: '📂', color: 'bg-orange-500' },
    { title: 'Inventory', href: '/admin/finance/inventory', icon: '📦', color: 'bg-purple-500' },
    { title: 'Purchases', href: '/admin/finance/purchases', icon: '🛒', color: 'bg-blue-500' },
    { title: 'Profit & Loss', href: '/admin/finance/profit-loss', icon: '📊', color: 'bg-yellow' },
    { title: 'Income Reports', href: '/admin/finance/income', icon: '💰', color: 'bg-green' },
    { title: 'Statements', href: '/admin/finance/statements', icon: '📋', color: 'bg-indigo-500' },
    { title: 'Staff Payables', href: '/admin/finance/payables', icon: '👥', color: 'bg-pink-500' },
  ]
  
  // Retry handler
  const handleRetry = () => {
    const { from, to } = getDateRange(activeFilter === 'custom' ? 'thisMonth' : activeFilter)
    if (activeFilter === 'custom') {
      setActiveFilter('thisMonth')
      setDateFrom(from)
      setDateTo(to)
    }
    loadDashboard(dateFrom || from, dateTo || to)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">Finance Dashboard</h1>
        <p className="text-text-light mt-1">Financial overview and quick access to finance modules</p>
        {/* Debug info - show date range being used */}
        {process.env.NODE_ENV === 'development' && dashboardData && (
          <p className="text-xs text-gray-500 mt-1">
            Date Range: {dateFrom} to {dateTo} • {dashboardData.recentTransactions.length} recent transactions
          </p>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Error Loading Dashboard</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                {/* Development-only error details */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono text-red-700">
                    <div className="font-semibold mb-1">Debug Info:</div>
                    <div>Date Range: {dateFrom || 'not set'} → {dateTo || 'not set'}</div>
                    <div>Active Filter: {activeFilter}</div>
                    <div className="mt-1 text-red-600">Check browser console for full error details</div>
                  </div>
                )}
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-text-dark mb-4">Date Range</h2>
        
        {/* Quick Select Buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => handleQuickFilter('thisMonth')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
              activeFilter === 'thisMonth'
                ? 'bg-green text-white'
                : 'bg-gray-100 text-text-dark hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            This Month
          </button>
          <button
            onClick={() => handleQuickFilter('last30Days')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
              activeFilter === 'last30Days'
                ? 'bg-green text-white'
                : 'bg-gray-100 text-text-dark hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Last 30 Days
          </button>
        </div>
        
        {/* Custom Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyCustomRange}
              disabled={loading}
              className="w-full px-4 py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Apply'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && !dashboardData ? (
          // Loading skeleton maintains layout
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : summaryCards.length > 0 ? (
          summaryCards.map((card, index) => (
            <div 
              key={card.label} 
              className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-text-light text-sm mb-1">{card.label}</h3>
              <p className="font-serif text-3xl font-bold text-green">{card.value}</p>
            </div>
          ))
        ) : null}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Finance Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <a
              key={link.title}
              href={link.href}
              className="group p-6 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth animate-fade-in"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-smooth`}>
                {link.icon}
              </div>
              <h3 className="font-semibold text-green text-sm">{link.title}</h3>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-serif text-2xl font-bold text-green">Recent Transactions</h2>
          <p className="text-sm text-text-light mt-1">Latest financial activities</p>
        </div>
        {loading && !dashboardData ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 animate-pulse">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-text-light text-lg font-medium">Loading transactions...</p>
          </div>
        ) : dashboardData && dashboardData.recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Description</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-text-dark">Direction</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentTransactions.map((transaction) => {
                  const isInflow = transaction.direction === 'INFLOW'
                  const formattedDate = transaction.date 
                    ? new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'N/A'
                  
                  // Amount display logic
                  const displayAmount = transaction.direction === 'OUTFLOW' 
                    ? Math.abs(transaction.amountCents)
                    : transaction.amountCents
                  
                  return (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-green-50/30 transition-colors">
                      <td className="py-4 px-6 text-sm text-text-dark whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                          isInflow 
                            ? 'bg-green/10 text-green' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {isInflow ? (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                            </svg>
                          )}
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-dark max-w-md">
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.status && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Status: <span className={`font-medium ${
                              transaction.status.toLowerCase() === 'completed' || transaction.status.toLowerCase() === 'approved'
                                ? 'text-green'
                                : transaction.status.toLowerCase() === 'pending' || transaction.status.toLowerCase() === 'submitted'
                                ? 'text-yellow'
                                : 'text-gray-600'
                            }`}>
                              {transaction.status}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                          isInflow
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.direction}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-sm font-bold text-right whitespace-nowrap ${
                        isInflow ? 'text-green' : 'text-red-600'
                      }`}>
                        {transaction.direction === 'OUTFLOW' ? '−' : ''}
                        {formatTransactionCurrency(displayAmount, transaction.currency || 'PKR')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-text-light text-lg font-medium">No transactions in this range.</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your date filters to see more data.</p>
          </div>
        )}
      </div>
    </div>
  )
}
