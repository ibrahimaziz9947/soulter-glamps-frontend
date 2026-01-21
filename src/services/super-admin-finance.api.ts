/**
 * Super Admin Finance API Service
 * Handles super-admin finance-related API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface SuperAdminFinanceSummary {
  totals: {
    totalRevenueCents: number
    totalExpensesCents: number
    netProfitCents: number
  }
  openPayables: {
    amountCents: number
    count: number
  }
  recentLedgerEntries: FinanceEntry[]
  // Legacy fields for backward compatibility
  profitLoss?: {
    revenueCents: number
    expenseCents: number
    profitCents: number
  }
  payables?: {
    openCount: number
    openAmountCents: number
  }
  ledger?: {
    totalEntries: number
    latestEntries: FinanceEntry[]
  }
  latestEntries?: FinanceEntry[]
}

export interface FinanceEntry {
  id: string
  date: string
  type: 'INCOME' | 'EXPENSE' | 'PAYABLE' | 'PURCHASE'
  category?: string
  categoryLabel?: string
  description?: string
  title?: string
  reference?: string
  vendorName?: string
  amountCents: number
  currency?: string
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
  
  // Normalize the response structure to handle both new and legacy backend formats
  const rawData = response.data
  
  // Primary structure: new format
  const totals = rawData.totals || {
    totalRevenueCents: rawData.profitLoss?.revenueCents || 0,
    totalExpensesCents: rawData.profitLoss?.expenseCents || 0,
    netProfitCents: rawData.profitLoss?.profitCents || 0
  }
  
  const openPayables = rawData.openPayables || {
    amountCents: rawData.payables?.openAmountCents || 0,
    count: rawData.payables?.openCount || 0
  }
  
  // Handle ledger entries - try multiple possible locations
  let recentLedgerEntries: FinanceEntry[] = []
  if (rawData.recentLedgerEntries && Array.isArray(rawData.recentLedgerEntries)) {
    recentLedgerEntries = rawData.recentLedgerEntries
  } else if (rawData.ledger?.latestEntries && Array.isArray(rawData.ledger.latestEntries)) {
    recentLedgerEntries = rawData.ledger.latestEntries
  } else if (rawData.latestEntries && Array.isArray(rawData.latestEntries)) {
    recentLedgerEntries = rawData.latestEntries
  }
  
  return {
    totals,
    openPayables,
    recentLedgerEntries,
    // Keep legacy fields for backward compatibility
    profitLoss: rawData.profitLoss,
    payables: rawData.payables,
    ledger: rawData.ledger,
    latestEntries: recentLedgerEntries
  }
}
