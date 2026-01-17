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
  data: FinanceDashboardData
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
  
  if (params?.from) queryParams.append('from', params.from)
  if (params?.to) queryParams.append('to', params.to)
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.currency) queryParams.append('currency', params.currency)
  
  const queryString = queryParams.toString()
  const endpoint = `/finance/dashboard${queryString ? `?${queryString}` : ''}`
  
  const response = await apiClient<FinanceDashboardResponse>(endpoint)
  
  if (!response.success || !response.data) {
    throw new Error('Invalid response from dashboard API')
  }
  
  return response.data
}
