/**
 * Super Admin Finance API Service
 * Handles super-admin finance-related API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface SuperAdminFinanceSummary {
  profitLoss: {
    revenueCents: number
    expenseCents: number
    profitCents: number
  }
  payables: {
    openCount: number
    openAmountCents: number
  }
  latestEntries: FinanceEntry[]
}

export interface FinanceEntry {
  id: string
  date: string
  type: 'INCOME' | 'EXPENSE' | 'PAYABLE' | 'PURCHASE'
  category?: string
  description: string
  amountCents: number
  status?: string
  createdAt: string
}

export interface SuperAdminFinanceSummaryResponse {
  success: boolean
  data?: SuperAdminFinanceSummary
  error?: string
  message?: string
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Fetch finance summary for super admin
 * @param params - Query parameters for date range
 * @returns Finance summary including profit/loss, payables, and recent entries
 */
export async function getSuperAdminFinanceSummary(params?: {
  from?: string
  to?: string
}): Promise<SuperAdminFinanceSummary> {
  const queryParams = new URLSearchParams()
  
  // Only add date params if they have actual values
  if (params?.from && params.from.trim()) {
    queryParams.append('from', params.from.trim())
  }
  if (params?.to && params.to.trim()) {
    queryParams.append('to', params.to.trim())
  }
  
  const queryString = queryParams.toString()
  const endpoint = `/super-admin/finance/summary${queryString ? `?${queryString}` : ''}`
  
  const response = await apiClient<SuperAdminFinanceSummaryResponse>(endpoint)
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Super Admin Finance API returned success:false'
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    throw new Error('Super Admin Finance API returned no data')
  }
  
  return response.data
}
