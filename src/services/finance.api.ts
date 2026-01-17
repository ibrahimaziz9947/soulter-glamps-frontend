/**
 * Finance Dashboard API Service
 * Handles dashboard-related API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface FinanceDashboardData {
  totalIncomeCents: number
  totalExpensesCents: number
  netProfitCents: number
  pendingPayablesCents: number
  netCashFlowCents?: number // Or cashOnHandCents
  inventoryValueCents: number
  recentTransactions: DashboardTransaction[]
}

export interface DashboardTransaction {
  id: string
  date: string
  type: 'income' | 'expense' | 'purchase' | 'payable'
  description: string
  amountCents: number
  currency: string
  status?: string
}

export interface FinanceDashboardResponse {
  success: boolean
  data?: FinanceDashboardData
  error?: string
  message?: string
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Fetch finance dashboard data
 * @param params - Query parameters for the dashboard
 * @returns Dashboard data including KPIs and recent transactions
 */
export async function fetchFinanceDashboard(params?: {
  from?: string
  to?: string
  limit?: number
  currency?: string
}): Promise<FinanceDashboardData> {
  const queryParams = new URLSearchParams()
  
  // Validate and add date params (must be YYYY-MM-DD format)
  if (params?.from && params.from.trim() && params.from.length === 10) {
    queryParams.append('from', params.from.trim())
  }
  if (params?.to && params.to.trim() && params.to.length === 10) {
    queryParams.append('to', params.to.trim())
  }
  
  // Always set limit with default of 10
  const limit = params?.limit && params.limit > 0 ? params.limit : 10
  queryParams.append('limit', limit.toString())
  
  // Only add currency if explicitly provided (not empty string)
  if (params?.currency && params.currency.trim()) {
    queryParams.append('currency', params.currency.trim())
  }
  
  const queryString = queryParams.toString()
  const endpoint = `/finance/dashboard${queryString ? `?${queryString}` : ''}`
  
  // Log request details for debugging
  console.log('[Finance API] Dashboard request:', {
    endpoint,
    params: {
      from: params?.from,
      to: params?.to,
      limit,
      currency: params?.currency || 'not specified'
    }
  })
  
  const response = await apiClient<FinanceDashboardResponse>(endpoint)
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Dashboard API returned success:false'
    console.error('[Finance API] Dashboard error response:', response)
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    console.error('[Finance API] Dashboard missing data:', response)
    throw new Error('Dashboard API returned no data')
  }
  
  return response.data
}
