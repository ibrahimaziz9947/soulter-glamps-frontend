'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatCurrency, formatRawCurrency } from '@/src/utils/currency'
import { apiClient } from '@/src/services/apiClient'

interface StatementItem {
  id: string
  date: string
  type: 'income' | 'expense' | 'purchase' | 'payment'
  description: string
  category?: string
  vendor?: string
  amount: number // In cents
  currency: string
  status?: string
  reference?: string
}

interface StatementSummary {
  totalIncome: number // In cents
  totalExpenses: number // In cents
  totalPurchases: number // In cents
  totalPayments: number // In cents
  netFlow: number // In cents
  itemCount: number
}

export default function StatementsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Request sequencing to prevent race conditions
  const reqSeqRef = useRef(0)
  const isInitialMount = useRef(true)
  
  // Filters - initialize from URL params
  const [dateFrom, setDateFrom] = useState(searchParams.get('from') || '')
  const [dateTo, setDateTo] = useState(searchParams.get('to') || '')
  const [currencyFilter, setCurrencyFilter] = useState(searchParams.get('currency') || '')
  const [expenseMode, setExpenseMode] = useState<'approvedOnly' | 'includeSubmitted'>(
    (searchParams.get('expenseMode') as 'approvedOnly' | 'includeSubmitted') || 'approvedOnly'
  )
  const [includePurchases, setIncludePurchases] = useState(searchParams.get('includePurchases') !== 'false')
  const [includePayments, setIncludePayments] = useState(searchParams.get('includePayments') !== 'false')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  
  // Pagination - initialize from URL params
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 25)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  
  // Data
  const [statements, setStatements] = useState<StatementItem[]>([])
  const [summary, setSummary] = useState<StatementSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  
  // Modal state for entries without detail pages
  const [selectedEntry, setSelectedEntry] = useState<StatementItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Update URL with current filter/pagination state
  const updateURL = (params: {
    from?: string
    to?: string
    currency?: string
    expenseMode?: string
    includePurchases?: boolean
    includePayments?: boolean
    search?: string
    page?: number
    pageSize?: number
  }) => {
    const urlParams = new URLSearchParams()
    
    // Add all non-empty/default values to URL
    if (params.from || dateFrom) urlParams.set('from', params.from ?? dateFrom)
    if (params.to || dateTo) urlParams.set('to', params.to ?? dateTo)
    if (params.currency || currencyFilter) urlParams.set('currency', params.currency ?? currencyFilter)
    
    const mode = params.expenseMode ?? expenseMode
    if (mode !== 'approvedOnly') urlParams.set('expenseMode', mode)
    
    const purchases = params.includePurchases ?? includePurchases
    if (!purchases) urlParams.set('includePurchases', 'false')
    
    const payments = params.includePayments ?? includePayments
    if (!payments) urlParams.set('includePayments', 'false')
    
    if (params.search || searchQuery) urlParams.set('search', params.search ?? searchQuery)
    
    const page = params.page ?? currentPage
    if (page !== 1) urlParams.set('page', String(page))
    
    const size = params.pageSize ?? pageSize
    if (size !== 25) urlParams.set('pageSize', String(size))
    
    // Update URL without page reload
    const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : window.location.pathname
    window.history.pushState({}, '', newUrl)
  }

  // Fetch statements data
  const fetchStatements = async (overrides?: {
    dateFrom?: string
    dateTo?: string
    currencyFilter?: string
    expenseMode?: 'approvedOnly' | 'includeSubmitted'
    includePurchases?: boolean
    includePayments?: boolean
    searchQuery?: string
    page?: number
    pageSize?: number
  }) => {
    setLoading(true)
    setError(null)
    
    // Increment request ID for sequencing
    const currentReqId = ++reqSeqRef.current
    
    // Use overrides if provided, otherwise use current state
    const effectiveDateFrom = overrides?.dateFrom ?? dateFrom
    const effectiveDateTo = overrides?.dateTo ?? dateTo
    const effectiveCurrency = overrides?.currencyFilter ?? currencyFilter
    const effectiveExpenseMode = overrides?.expenseMode ?? expenseMode
    const effectiveIncludePurchases = overrides?.includePurchases ?? includePurchases
    const effectiveIncludePayments = overrides?.includePayments ?? includePayments
    const effectiveSearchQuery = overrides?.searchQuery ?? searchQuery
    const effectivePage = overrides?.page ?? currentPage
    const effectivePageSize = overrides?.pageSize ?? pageSize
    
    try {
      console.log('[Statements TRACE] Input values:', {
        dateFrom: effectiveDateFrom,
        dateTo: effectiveDateTo,
        currencyFilter: effectiveCurrency,
        expenseMode: effectiveExpenseMode,
        includePurchases: effectiveIncludePurchases,
        includePayments: effectiveIncludePayments,
        searchQuery: effectiveSearchQuery,
        page: effectivePage,
        pageSize: effectivePageSize,
        requestId: currentReqId,
        hasOverrides: !!overrides
      })
      
      // Build query params - ONLY include non-empty values
      const params = new URLSearchParams()
      
      // Only add 'from' if dateFrom is truthy and looks like valid date
      if (effectiveDateFrom && effectiveDateFrom.trim() && effectiveDateFrom.length >= 10) {
        params.append('from', effectiveDateFrom.trim())
      }
      
      // Only add 'to' if dateTo is truthy and looks like valid date
      if (effectiveDateTo && effectiveDateTo.trim() && effectiveDateTo.length >= 10) {
        params.append('to', effectiveDateTo.trim())
      }
      
      // Only include currency if user explicitly selected one (not "All")
      if (effectiveCurrency && effectiveCurrency.trim()) {
        params.append('currency', effectiveCurrency.trim())
      }
      
      // Always include expense mode (it has a default value)
      if (effectiveExpenseMode) {
        params.append('expenseMode', effectiveExpenseMode)
      }
      
      // Include boolean filters
      params.append('includePurchases', String(effectiveIncludePurchases))
      params.append('includePayments', String(effectiveIncludePayments))
      
      // Include search query if provided
      if (effectiveSearchQuery && effectiveSearchQuery.trim()) {
        params.append('search', effectiveSearchQuery.trim())
      }
      
      // Add pagination parameters
      params.append('page', String(effectivePage))
      params.append('pageSize', String(effectivePageSize))
      params.append('sortBy', 'date')
      params.append('sortOrder', 'desc') // Newest first
      
      const requestUrl = `/finance/statements?${params.toString()}`
      
      console.log('[Statements TRACE] Request URL:', requestUrl)
      console.log('[Statements TRACE] Request ID:', currentReqId)
      
      // Call statements endpoint
      const response = await apiClient<any>(requestUrl, {
        method: 'GET',
      })
      
      // Check if this request is still the latest one
      if (currentReqId !== reqSeqRef.current) {
        console.log('[Statements TRACE] Discarding stale response. Current:', currentReqId, 'Latest:', reqSeqRef.current)
        return // Discard this response, a newer request is in flight or completed
      }
      
      console.log('[Statements TRACE] Response received:', {
        requestId: currentReqId,
        success: response.success,
        hasData: !!response.data,
        fullResponse: response
      })
      
      // Extract data from response - handle both wrapped and unwrapped formats
      let data: any
      if (response.success && response.data) {
        // Backend returns { success: true, data: { statements: [], summary: {}, pagination: {} } }
        data = response.data
      } else if (response.data && response.data.data) {
        // Backend returns { data: { data: { statements: [], ... } } } (double wrapped)
        data = response.data.data
      } else if (response.data) {
        // Backend returns { data: { statements: [], ... } }
        data = response.data
      } else {
        // Backend returns { statements: [], summary: {}, pagination: {} } directly
        data = response
      }
      
      console.log('[Statements TRACE] Extracted data:', {
        itemCount: data?.statements?.length || 0,
        items: data?.items?.length || 0,
        summaryFromAPI: data?.summary,
        paginationFromAPI: data?.pagination,
        dataKeys: Object.keys(data || {}),
        requestId: currentReqId
      })
      
      // Process statements - check both 'statements' and 'items' keys
      const rawStatements = data?.statements || data?.items || []
      const statementsData: StatementItem[] = Array.isArray(rawStatements) 
        ? rawStatements.map((item: any) => ({
            id: item.id || item._id || Math.random().toString(),
            date: item.date || item.createdAt || '',
            type: item.type || 'income',
            description: item.description || item.title || 'N/A',
            category: item.category || undefined,
            vendor: item.vendor || undefined,
            amount: Number(item.amount || item.amountCents || 0),
            currency: item.currency || 'PKR',
            status: item.status || undefined,
            reference: item.reference || item.referenceNumber || undefined
          }))
        : []
      
      setStatements(statementsData)
      
      // Process summary
      const summaryData: StatementSummary = {
        totalIncome: Number(data?.summary?.totalIncomeCents || 0),
        totalExpenses: Number(data?.summary?.totalExpensesCents || 0),
        totalPurchases: Number(data?.summary?.totalPurchasesCents || 0),
        totalPayments: Number(data?.summary?.totalPaymentsCents || 0),
        netFlow: Number(data?.summary?.netFlowCents || 0),
        itemCount: statementsData.length
      }
      
      setSummary(summaryData)
      
      // Update pagination info
      setTotalItems(Number(data?.pagination?.totalItems || statementsData.length))
      setTotalPages(Number(data?.pagination?.totalPages || 1))
      setCurrentPage(Number(data?.pagination?.currentPage || effectivePage))
      
      console.log('[Statements TRACE] Setting state:', {
        statementCount: statementsData.length,
        summary: summaryData,
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
      console.error('[Statements TRACE] Request failed:', {
        requestId: currentReqId,
        error: err.message
      })
      const errorMessage = err.message || 'Failed to load statements data'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    // Only fetch on initial mount (params already loaded from URL)
    if (isInitialMount.current) {
      isInitialMount.current = false
      fetchStatements()
    }
  }, []) // Only run on mount

  // Handle apply filters
  const handleApplyFilters = () => {
    updateURL({})
    fetchStatements()
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setDateFrom('')
    setDateTo('')
    setCurrencyFilter('')
    setExpenseMode('approvedOnly')
    setIncludePurchases(true)
    setIncludePayments(true)
    setSearchQuery('')
    setCurrentPage(1)
    
    // Clear URL params
    window.history.pushState({}, '', window.location.pathname)
    
    // Trigger fetch after resetting
    setTimeout(() => {
      fetchStatements({ 
        page: 1,
        dateFrom: '',
        dateTo: '',
        currencyFilter: '',
        expenseMode: 'approvedOnly',
        includePurchases: true,
        includePayments: true,
        searchQuery: ''
      })
    }, 50)
  }

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      updateURL({ page: newPage })
      fetchStatements({ page: newPage })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      updateURL({ page: newPage })
      fetchStatements({ page: newPage })
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
    updateURL({ pageSize: newSize, page: 1 })
    fetchStatements({ pageSize: newSize, page: 1 })
  }

  // Safe number conversion - prevents NaN in UI
  const safeNum = (value: any): number => {
    const num = Number(value)
    return Number.isFinite(num) ? num : 0
  }

  // Compute summary totals from loaded statements (single source of truth)
  const computedSummary = useMemo(() => {
    // Calculate totals by transaction type from current loaded statements
    let totalIncomeCents = 0
    let totalExpensesCents = 0
    let totalPurchasesCents = 0
    let totalPaymentsCents = 0
    
    statements.forEach(stmt => {
      const amountCents = safeNum(stmt.amount)
      switch (stmt.type) {
        case 'income':
          totalIncomeCents += amountCents
          break
        case 'expense':
          totalExpensesCents += amountCents
          break
        case 'purchase':
          totalPurchasesCents += amountCents
          break
        case 'payment':
          totalPaymentsCents += amountCents
          break
      }
    })
    
    // If API provides summary and we have ALL data (not paginated), prefer API totals
    // Otherwise use computed totals from visible data
    const useApiTotals = summary && totalItems > 0 && totalItems === statements.length
    
    return {
      totalIncome: useApiTotals ? safeNum(summary?.totalIncome) : totalIncomeCents,
      totalExpenses: useApiTotals ? safeNum(summary?.totalExpenses) : totalExpensesCents,
      totalPurchases: useApiTotals ? safeNum(summary?.totalPurchases) : totalPurchasesCents,
      totalPayments: useApiTotals ? safeNum(summary?.totalPayments) : totalPaymentsCents,
      itemCount: statements.length
    }
  }, [statements, summary, totalItems])

  // Calculate totals for display (Total In, Total Out, Net)
  const totalIn = computedSummary.totalIncome
  const totalOut = computedSummary.totalExpenses + computedSummary.totalPurchases + computedSummary.totalPayments
  const netAmount = totalIn - totalOut

  // Format currency helper
  const formatStatementCurrency = (amountCents: number, currency: string = 'PKR'): string => {
    const amount = amountCents / 100
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
    return `${currency} ${formatted}`
  }

  // Get type badge color
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800'
      case 'expense':
        return 'bg-orange-100 text-orange-800'
      case 'purchase':
        return 'bg-red-100 text-red-800'
      case 'payment':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Handle row click - navigate to detail page or show modal
  const handleRowClick = (stmt: StatementItem) => {
    switch (stmt.type) {
      case 'expense':
        // Navigate to expense detail page
        router.push(`/admin/finance/expenses/${stmt.id}`)
        break
      case 'income':
        // Navigate to income detail page
        router.push(`/admin/finance/income/${stmt.id}`)
        break
      case 'purchase':
        // Navigate to purchase detail page
        router.push(`/admin/finance/purchases/${stmt.id}`)
        break
      case 'payment':
        // Payments might link to payables - show modal as fallback
        // Check if we have a reference to a payable/purchase
        if (stmt.reference) {
          // Try to navigate to related payable or purchase
          router.push(`/admin/finance/payables/${stmt.reference}`)
        } else {
          // Show modal with payment details
          setSelectedEntry(stmt)
          setShowModal(true)
        }
        break
      default:
        // Unknown type - show modal
        setSelectedEntry(stmt)
        setShowModal(true)
    }
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedEntry(null)
  }

  // Export to CSV
  const exportToCSV = () => {
    if (statements.length === 0 && totalItems === 0) {
      showToast('No data to export', 'warning')
      return
    }
    
    if (statements.length === 0 && totalItems > 0) {
      showToast('Current page is empty. Try adjusting filters or page number.', 'warning')
      return
    }

    // CSV headers
    const headers = ['Date', 'Type', 'Title', 'Counterparty', 'Category', 'Status', 'Currency', 'Amount']
    
    // Convert statements to CSV rows
    const rows = statements.map(stmt => {
      const date = stmt.date ? new Date(stmt.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'N/A'
      
      const type = stmt.type.charAt(0).toUpperCase() + stmt.type.slice(1)
      const title = `"${stmt.description.replace(/"/g, '""')}"` // Escape quotes
      const counterparty = stmt.vendor || '—'
      const category = stmt.category || '—'
      const status = stmt.status || '—'
      const currency = stmt.currency
      const amount = (stmt.amount / 100).toFixed(2) // Convert cents to currency
      const sign = stmt.type === 'income' ? '+' : '-'
      
      return [date, type, title, counterparty, category, status, currency, `${sign}${amount}`]
    })
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    // Generate filename with current date and filters
    const today = new Date().toISOString().split('T')[0]
    const filterInfo = dateFrom && dateTo ? `_${dateFrom}_to_${dateTo}` : ''
    const filename = `financial_statements_${today}${filterInfo}.csv`
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast(`Exported ${statements.length} transactions to CSV`, 'success')
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
          <h1 className="font-serif text-3xl font-bold text-green">Financial Statements</h1>
          <p className="text-text-light mt-1">Comprehensive view of all financial transactions</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated}</p>
          )}
        </div>
        <button
          onClick={exportToCSV}
          disabled={loading || (statements.length === 0 && totalItems === 0)}
          className="inline-flex items-center justify-center gap-2 bg-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-green/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
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
                const newMode = 'approvedOnly'
                setExpenseMode(newMode)
                updateURL({ expenseMode: newMode })
                fetchStatements({ expenseMode: newMode })
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
                const newMode = 'includeSubmitted'
                updateURL({ expenseMode: newMode })
                setExpenseMode(newMode)
                fetchStatements({ expenseMode: newMode })
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

        {/* Include Toggles */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <label className="block text-sm font-semibold text-text-dark mb-2">Include</label>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includePurchases}
                onChange={(e) => setIncludePurchases(e.target.checked)}
                className="w-4 h-4 text-green border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-text-dark">Purchases</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includePayments}
                onChange={(e) => setIncludePayments(e.target.checked)}
                className="w-4 h-4 text-green border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-text-dark">Payments</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
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

      {/* Summary Cards - Total In / Total Out / Net */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton for summary cards
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green">
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-light text-sm font-semibold uppercase tracking-wide">Total In</p>
                <svg className="w-8 h-8 text-green opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <p className="font-serif text-3xl font-bold text-green">
                {formatRawCurrency(totalIn)}
              </p>
              <p className="text-xs text-gray-500 mt-2">All income sources</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-light text-sm font-semibold uppercase tracking-wide">Total Out</p>
                <svg className="w-8 h-8 text-red-500 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <p className="font-serif text-3xl font-bold text-red-600">
                {formatRawCurrency(totalOut)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Expenses + Purchases + Payments</p>
            </div>
            <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${
              netAmount >= 0 ? 'border-green' : 'border-red-500'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-light text-sm font-semibold uppercase tracking-wide">Net</p>
                <svg className={`w-8 h-8 opacity-20 ${netAmount >= 0 ? 'text-green' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <p className={`font-serif text-3xl font-bold ${
                netAmount >= 0 ? 'text-green' : 'text-red-600'
              }`}>
                {netAmount >= 0 ? '' : '-'}{formatRawCurrency(Math.abs(netAmount))}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {netAmount >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Ledger Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-cream border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-dark text-lg">Ledger Entries</h3>
              <p className="text-xs text-text-light mt-1">
                Showing {statements.length} of {totalItems} transactions • Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-text-dark font-medium">Rows per page:</label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider bg-gray-50">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider bg-gray-50">Type</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider bg-gray-50">Title</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider bg-gray-50">Counterparty</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider bg-gray-50">Category/Source</th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider bg-gray-50">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider bg-gray-50">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-text-light">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-lg font-semibold text-gray-700">No transactions found</p>
                          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search criteria</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  statements.map((stmt) => (
                    <tr key={stmt.id} className="hover:bg-green-50/30 transition-colors">
                      <td className="py-4 px-6 text-sm text-text-dark whitespace-nowrap">
                        {stmt.date ? new Date(stmt.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${getTypeBadge(stmt.type)}`}>
                          {stmt.type === 'income' && (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          {stmt.type !== 'income' && (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                            </svg>
                          )}
                          {stmt.type.charAt(0).toUpperCase() + stmt.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-dark max-w-xs">
                        <div className="font-medium">{stmt.description}</div>
                        {stmt.reference && (
                          <div className="text-xs text-gray-500 mt-0.5">Ref: {stmt.reference}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-dark">
                        {stmt.vendor || '—'}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-dark">
                        {stmt.category || '—'}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        {stmt.status ? (
                          <span className={`inline-block px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                            stmt.status === 'Approved' || stmt.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : stmt.status === 'Submitted' || stmt.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {stmt.status}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className={`py-4 px-6 text-sm font-bold text-right whitespace-nowrap ${
                        stmt.type === 'income' 
                          ? 'text-green' 
                          : 'text-red-600'
                      }`}>
                        {stmt.type === 'income' ? '+' : '−'}
                        {formatStatementCurrency(stmt.amount, stmt.currency)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {statements.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-text-light">
                Showing <span className="font-semibold text-text-dark">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                <span className="font-semibold text-text-dark">
                  {Math.min(currentPage * pageSize, totalItems)}
                </span> of{' '}
                <span className="font-semibold text-text-dark">{totalItems}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-text-dark hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          updateURL({ page: pageNum })
                          setCurrentPage(pageNum)
                          fetchStatements({ page: pageNum })
                        }}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-smooth ${
                          currentPage === pageNum
                            ? 'bg-green text-white'
                            : 'bg-white border border-gray-300 text-text-dark hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}

      {/* Detail Modal for entries without dedicated pages */}
      {showModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-dark">Transaction Details</h2>
                <p className="text-sm text-text-light mt-1">
                  {selectedEntry.type.charAt(0).toUpperCase() + selectedEntry.type.slice(1)} Entry
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
              >
                <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Type Badge */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold ${getTypeBadge(selectedEntry.type)}`}>
                  {selectedEntry.type === 'income' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                  )}
                  {selectedEntry.type.charAt(0).toUpperCase() + selectedEntry.type.slice(1)}
                </span>
                {selectedEntry.status && (
                  <span className={`inline-block px-3 py-2 rounded-lg text-sm font-semibold ${
                    selectedEntry.status === 'Approved' || selectedEntry.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : selectedEntry.status === 'Submitted' || selectedEntry.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedEntry.status}
                  </span>
                )}
              </div>

              {/* Amount Card */}
              <div className={`bg-white border-2 rounded-lg p-4 ${
                selectedEntry.type === 'income' ? 'border-green' : 'border-red-500'
              }`}>
                <p className="text-sm text-text-light mb-1">Amount</p>
                <p className={`text-3xl font-bold ${
                  selectedEntry.type === 'income' ? 'text-green' : 'text-red-600'
                }`}>
                  {selectedEntry.type === 'income' ? '+' : '−'}
                  {formatStatementCurrency(selectedEntry.amount, selectedEntry.currency)}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-text-light mb-1 font-semibold uppercase tracking-wide">Date</p>
                  <p className="text-sm text-text-dark font-medium">
                    {selectedEntry.date ? new Date(selectedEntry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>

                {selectedEntry.reference && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-text-light mb-1 font-semibold uppercase tracking-wide">Reference</p>
                    <p className="text-sm text-text-dark font-medium font-mono">{selectedEntry.reference}</p>
                  </div>
                )}

                {selectedEntry.category && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-text-light mb-1 font-semibold uppercase tracking-wide">Category</p>
                    <p className="text-sm text-text-dark font-medium">{selectedEntry.category}</p>
                  </div>
                )}

                {selectedEntry.vendor && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-text-light mb-1 font-semibold uppercase tracking-wide">Counterparty</p>
                    <p className="text-sm text-text-dark font-medium">{selectedEntry.vendor}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-text-light mb-2 font-semibold uppercase tracking-wide">Description</p>
                <p className="text-sm text-text-dark">{selectedEntry.description}</p>
              </div>

              {/* ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-text-light mb-1 font-semibold uppercase tracking-wide">Transaction ID</p>
                <p className="text-xs text-gray-600 font-mono">{selectedEntry.id}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-text-dark rounded-lg font-semibold hover:bg-gray-300 transition-smooth"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-text-dark hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center gap-2"
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
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
          <p className="text-text-light mt-4">Loading statements...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-text-dark mb-2">Error Loading Statements</h3>
          <p className="text-text-light mb-4">{error}</p>
          <button
            onClick={() => fetchStatements()}
            className="px-6 py-2 bg-green text-white rounded-lg font-semibold hover:bg-green-700 transition-smooth"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
