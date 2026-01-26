/**
 * Super Admin Dashboard API Service
 * Handles super-admin dashboard summary API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface SuperAdminDashboardSummary {
  range: {
    from: string
    to: string
  }
  totalBookings: number
  revenue: number
  pendingCommissions: {
    count: number
    amount: number
  }
  financeSnapshot: {
    totalIncome: number
    totalExpenses: number
    netProfit: number
  }
  systemHealth: {
    ok: boolean
    db: 'ok' | 'fail'
  }
}

export interface SuperAdminDashboardResponse {
  success: boolean
  data?: SuperAdminDashboardSummary
  error?: string
  message?: string
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Fetch super-admin dashboard summary
 * @param params - Query parameters for date filtering
 * @returns Super admin dashboard summary with comprehensive metrics
 */
export async function getSuperAdminDashboardSummary(params?: {
  from?: string
  to?: string
}): Promise<SuperAdminDashboardSummary> {
  const queryParams = new URLSearchParams()
  
  // Validate and add date params (must be YYYY-MM-DD format)
  if (params?.from && params.from.trim() && params.from.length === 10) {
    queryParams.append('from', params.from.trim())
  }
  if (params?.to && params.to.trim() && params.to.length === 10) {
    queryParams.append('to', params.to.trim())
  }
  
  const queryString = queryParams.toString()
  const endpoint = `/super-admin/dashboard/summary${queryString ? `?${queryString}` : ''}`
  
  const response = await apiClient<SuperAdminDashboardResponse>(endpoint)
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Super Admin Dashboard API returned success:false'
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    throw new Error('Super Admin Dashboard API returned no data')
  }
  
  return response.data
}
