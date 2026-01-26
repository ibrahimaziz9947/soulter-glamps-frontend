/**
 * Payables API Service
 * Handles all payables-related API calls with robust response normalization
 */

import { apiClient } from './apiClient'
import { fetchPurchases, Purchase } from './purchases.api'

/* =========================
   TYPES
========================= */

export interface Payable {
  id: string
  purchaseId: string
  purchaseDate: string
  dueDate: string
  vendorName: string
  reference: string
  total: number // In major units
  paid: number // In major units
  outstanding: number // In major units
  currency: string
  status: 'PAID' | 'PARTIAL' | 'UNPAID'
  purchase?: Purchase
}

export interface PayableListParams {
  page?: number
  limit?: number
  status?: string // 'PAID' | 'PARTIAL' | 'UNPAID' | 'UNPAID,PARTIAL' (comma-separated)
  search?: string // Search vendor name or reference
  currency?: string
  purchaseDateFrom?: string
  purchaseDateTo?: string
  dueDateFrom?: string
  dueDateTo?: string
}

export interface PayablesSummary {
  totalPayables: number // Count
  outstandingAmount: number // In major units
  unpaidCount: number
  partialCount: number
  paidCount: number
  totalAmount?: number // In major units
}

export interface PaymentPayload {
  purchaseId: string
  amount: number
  paymentDate?: string // ISO date, defaults to today
  paymentMethod?: string // 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'CREDIT_CARD'
  reference?: string
  notes?: string
}

export interface PayableListResponse {
  success: boolean
  data: {
    items: Payable[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface PayablesSummaryResponse {
  success: boolean
  data: PayablesSummary
}

export interface PaymentResponse {
  success: boolean
  data: {
    paymentId: string
    purchaseId: string
    amountPaid: number
    remainingBalance: number
    status: 'PAID' | 'PARTIAL' | 'UNPAID'
  }
  message?: string
}

/* =========================
   HELPER FUNCTIONS
========================= */

/**
 * Compute payable from purchase record
 * Reads payment tracking fields from backend if available
 */
function computePayableFromPurchase(purchase: Purchase): Payable {
  // Support multiple field name variations from backend
  const total = purchase.totalAmount ?? purchase.amount ?? 0
  const paid = purchase.paidAmount ?? 0
  const outstanding = Math.max(0, total - paid)
  
  // Calculate due date (30 days from purchase date by default)
  const purchaseDate = new Date(purchase.purchaseDate || purchase.createdAt || new Date())
  const dueDate = new Date(purchaseDate)
  dueDate.setDate(dueDate.getDate() + 30)
  
  // Use paymentStatus from backend if available, otherwise compute
  let status: 'PAID' | 'PARTIAL' | 'UNPAID'
  if (purchase.paymentStatus) {
    status = purchase.paymentStatus
  } else if (paid === 0) {
    status = 'UNPAID'
  } else if (paid < total) {
    status = 'PARTIAL'
  } else {
    status = 'PAID'
  }
  
  return {
    id: `payable-${purchase.id}`,
    purchaseId: purchase.id,
    purchaseDate: purchase.purchaseDate || purchase.createdAt || new Date().toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    vendorName: purchase.vendorName,
    reference: purchase.reference || 'N/A',
    total,
    paid,
    outstanding,
    currency: purchase.currency,
    status,
    purchase
  }
}

/**
 * Normalize API response to ensure consistent structure
 * Handles both shapes:
 * a) { success, data: Array, pagination }
 * b) { success, data: { items }, pagination }
 */
function normalizeListResponse<T>(response: any, itemKey: string = 'items'): {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
} {
  let items: T[] = []
  let pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }

  if (!response) {
    return { items, pagination }
  }

  // Extract items - handle multiple possible structures
  if (Array.isArray(response.data)) {
    // Shape: { data: [...] }
    items = response.data
  } else if (response.data?.[itemKey]) {
    // Shape: { data: { items: [...] } }
    items = response.data[itemKey]
  } else if (response.data?.purchases) {
    // Legacy: { data: { purchases: [...] } }
    items = response.data.purchases
  } else if (response.data?.payables) {
    // Legacy: { data: { payables: [...] } }
    items = response.data.payables
  } else if (response[itemKey]) {
    // Shape: { items: [...] }
    items = response[itemKey]
  }

  // Extract pagination - check multiple locations
  if (response.pagination) {
    pagination = { ...pagination, ...response.pagination }
  } else if (response.data?.pagination) {
    pagination = { ...pagination, ...response.data.pagination }
  }

  // Ensure pagination has valid numbers
  pagination.page = Number(pagination.page) || 1
  pagination.limit = Number(pagination.limit) || 10
  pagination.total = Number(pagination.total) || items.length
  pagination.totalPages = Number(pagination.totalPages) || Math.ceil(pagination.total / pagination.limit)

  return { items, pagination }
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Fetch payables list with filters
 * V1: Computes from confirmed purchases
 * V2: Will fetch from dedicated payables endpoint
 */
export async function fetchPayables(params?: PayableListParams): Promise<PayableListResponse> {
  try {
    // V1: Fetch confirmed purchases and compute payables
    // V2: Replace with direct API call to /finance/payables
    const purchasesResponse = await fetchPurchases({
      page: 1,
      limit: 1000, // Fetch all for client-side filtering
      status: 'CONFIRMED'
    })

    console.log('[Payables API] Purchases response:', purchasesResponse)

    // Normalize purchases response
    const normalized = normalizeListResponse<Purchase>(purchasesResponse, 'purchases')
    const purchases = normalized.items

    // Convert purchases to payables
    let payables = purchases.map(computePayableFromPurchase)

    // Apply filters
    if (params?.status && params.status !== 'all') {
      const statuses = params.status.split(',').map(s => s.trim())
      payables = payables.filter(p => statuses.includes(p.status))
    }

    if (params?.search) {
      const query = params.search.toLowerCase()
      payables = payables.filter(p => 
        p.vendorName.toLowerCase().includes(query) ||
        p.reference.toLowerCase().includes(query)
      )
    }

    if (params?.currency && params.currency !== 'all') {
      payables = payables.filter(p => p.currency === params.currency)
    }

    if (params?.purchaseDateFrom) {
      payables = payables.filter(p => p.purchaseDate >= params.purchaseDateFrom!)
    }

    if (params?.purchaseDateTo) {
      payables = payables.filter(p => p.purchaseDate <= params.purchaseDateTo!)
    }

    if (params?.dueDateFrom) {
      payables = payables.filter(p => p.dueDate >= params.dueDateFrom!)
    }

    if (params?.dueDateTo) {
      payables = payables.filter(p => p.dueDate <= params.dueDateTo!)
    }

    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const total = payables.length
    const totalPages = Math.ceil(total / limit)
    const startIdx = (page - 1) * limit
    const endIdx = startIdx + limit
    const paginatedPayables = payables.slice(startIdx, endIdx)

    return {
      success: true,
      data: {
        items: paginatedPayables,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    }
  } catch (error: any) {
    console.error('[Payables API] Error fetching payables:', error)
    throw error
  }
}

/**
 * Fetch payables summary/statistics
 * V1: Computes from confirmed purchases
 * V2: Will fetch from dedicated endpoint
 */
export async function fetchPayablesSummary(params?: {
  purchaseDateFrom?: string
  purchaseDateTo?: string
  dueDateFrom?: string
  dueDateTo?: string
  currency?: string
}): Promise<PayablesSummaryResponse> {
  try {
    // V1: Fetch all payables and compute summary
    const payablesResponse = await fetchPayables({
      page: 1,
      limit: 10000, // Fetch all
      ...params
    })

    const normalized = normalizeListResponse<Payable>(payablesResponse, 'items')
    const payables = normalized.items

    // Compute summary
    const unpaidCount = payables.filter(p => p.status === 'UNPAID').length
    const partialCount = payables.filter(p => p.status === 'PARTIAL').length
    const paidCount = payables.filter(p => p.status === 'PAID').length

    // Sum outstanding amounts (only for unpaid and partial)
    const outstandingAmount = payables
      .filter(p => p.status === 'UNPAID' || p.status === 'PARTIAL')
      .reduce((sum, p) => sum + p.outstanding, 0)

    // Sum total amounts
    const totalAmount = payables.reduce((sum, p) => sum + p.total, 0)

    const summary: PayablesSummary = {
      totalPayables: payables.length,
      outstandingAmount,
      unpaidCount,
      partialCount,
      paidCount,
      totalAmount
    }

    return {
      success: true,
      data: summary
    }
  } catch (error: any) {
    console.error('[Payables API] Error fetching summary:', error)
    throw error
  }
}

/**
 * Record payment for a purchase
 * Calls backend endpoint to persist payment
 */
export async function payPurchase(
  purchaseId: string,
  amount: number,
  paymentDetails?: {
    paymentDate?: string
    paymentMethod?: string
    reference?: string
    notes?: string
  }
): Promise<PaymentResponse> {
  try {
    console.log('[Payables API] Recording payment:', { purchaseId, amount })
    
    const payload = {
      amount,
      paymentDate: paymentDetails?.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: paymentDetails?.paymentMethod || 'BANK_TRANSFER',
      reference: paymentDetails?.reference,
      notes: paymentDetails?.notes
    }

    const response = await apiClient<any>(`/finance/payables/${purchaseId}/pay`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    console.log('[Payables API] Payment response:', response)

    return {
      success: response.success,
      data: {
        paymentId: response.data?.id || response.data?.paymentId || `PAY-${Date.now()}`,
        purchaseId: response.data?.purchaseId || purchaseId,
        amountPaid: response.data?.amountPaid || amount,
        remainingBalance: response.data?.remainingBalance || 0,
        status: response.data?.status || 'PAID'
      },
      message: response.message || 'Payment recorded successfully'
    }
  } catch (error: any) {
    console.error('[Payables API] Error recording payment:', error)
    throw error
  }
}

/**
 * Get payment history for a purchase
 * V2: Will fetch from /finance/purchases/:id/payments
 */
export async function fetchPaymentHistory(purchaseId: string): Promise<{
  success: boolean
  data: {
    items: Array<{
      id: string
      purchaseId: string
      amount: number
      paymentDate: string
      paymentMethod: string
      reference?: string
      notes?: string
      createdAt: string
    }>
  }
}> {
  try {
    const response = await apiClient<any>(`/finance/purchases/${purchaseId}/payments`, {
      method: 'GET'
    })

    const normalized = normalizeListResponse<{
      id: string
      purchaseId: string
      amount: number
      paymentDate: string
      paymentMethod: string
      reference?: string
      notes?: string
      createdAt: string
    }>(response, 'items')
    
    return {
      success: true,
      data: {
        items: normalized.items
      }
    }
  } catch (error: any) {
    console.error('[Payables API] Error fetching payment history:', error)
    throw error
  }
}
