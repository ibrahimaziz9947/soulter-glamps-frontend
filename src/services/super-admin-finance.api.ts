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
  ledger?: {
    totalEntries: number
    latestEntries: FinanceEntry[]
  }
  latestEntries?: FinanceEntry[] // Fallback for backward compatibility
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
  
  // Normalize the response structure to handle different backend formats
  const rawData = response.data
  
  // Ensure profitLoss exists with defaults
  const profitLoss = rawData.profitLoss || {
    revenueCents: 0,
    expenseCents: 0,
    profitCents: 0
  }
  
  // Ensure payables exists with defaults
  const payables = rawData.payables || {
    openCount: 0,
    openAmountCents: 0
  }
  
  // Handle ledger entries - could be in ledger.latestEntries or latestEntries directly
  let latestEntries: FinanceEntry[] = []
  if (rawData.ledger?.latestEntries && Array.isArray(rawData.ledger.latestEntries)) {
    latestEntries = rawData.ledger.latestEntries
  } else if (rawData.latestEntries && Array.isArray(rawData.latestEntries)) {
    latestEntries = rawData.latestEntries
  }
  
  return {
    profitLoss,
    payables,
    ledger: rawData.ledger || {
      totalEntries: latestEntries.length,
      latestEntries
    },
    latestEntries // Keep for backward compatibility
  }
}
