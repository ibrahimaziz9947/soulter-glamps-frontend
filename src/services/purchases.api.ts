/**
 * Purchases API Service
 * Handles all purchase-related API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface Purchase {
  id: string
  vendorName: string
  category: string
  status: string // DRAFT | CONFIRMED | CANCELLED | SUBMITTED | APPROVED | REJECTED
  amount: number // Amount in cents (integer)
  currency: string // PKR | USD | EUR | GBP
  purchaseDate?: string // ISO date string (YYYY-MM-DD)
  reference?: string
  notes?: string
  items?: Array<{
    name: string
    quantity: number
    unitPrice: number // in cents
    total: number // in cents
  }>
  createdBy?: {
    id?: string
    name?: string
    email?: string
  }
  submittedBy?: {
    id?: string
    name?: string
    email?: string
  }
  approvedBy?: {
    id?: string
    name?: string
    email?: string
  }
  rejectedBy?: {
    id?: string
    name?: string
    email?: string
  }
  rejectionReason?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  // Payment tracking fields
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID'
  paidAmount?: number
  totalAmount?: number
  outstandingAmount?: number
}

export interface PurchasePayload {
  vendorName: string
  category: string
  status: string // DRAFT | CONFIRMED | CANCELLED | SUBMITTED
  amount: number // Amount in major units (PKR)
  currency: string // PKR | USD | EUR | GBP
  purchaseDate: string // ISO date string (YYYY-MM-DD)
  reference?: string
  notes?: string
  items?: Array<{
    name: string
    quantity: number
    unitPrice: number // in major units (PKR)
    total: number // in major units (PKR)
  }>
}

export interface PurchaseListResponse {
  success: boolean
  data: {
    purchases: Purchase[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    totalAmount: number // Total in major units (PKR)
  }
}

export interface PurchaseSummaryResponse {
  success: boolean
  data: {
    totalPurchases: number // In major units (PKR)
    totalCount: number
    byStatus?: {
      DRAFT?: number
      CONFIRMED?: number
      CANCELLED?: number
      SUBMITTED?: number
      APPROVED?: number
      REJECTED?: number
    }
    byCategory?: {
      [key: string]: number // Amount in major units (PKR) per category
    }
    // Legacy fields for backward compatibility
    confirmedPurchases?: number
    draftPurchases?: number
    cancelledPurchases?: number
    approvedPurchases?: number // In major units (PKR)
    pendingPurchases?: number // In major units (PKR)
    rejectedPurchases?: number // In major units (PKR)
  }
}

export interface PurchaseDetailResponse {
  success: boolean
  data: Purchase
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Get list of purchase records with pagination and filters
 */
export async function fetchPurchases(params?: {
  page?: number
  limit?: number
  status?: string
  category?: string
  vendor?: string
  search?: string
  startDate?: string
  endDate?: string
  dateFrom?: string
  dateTo?: string
}): Promise<PurchaseListResponse> {
  const queryParams = new URLSearchParams()

  if (params?.page) queryParams.append('page', String(params.page))
  if (params?.limit) queryParams.append('limit', String(params.limit))
  if (params?.status) queryParams.append('status', params.status)
  if (params?.category) queryParams.append('category', params.category)
  if (params?.vendor) queryParams.append('vendor', params.vendor)
  if (params?.search) queryParams.append('search', params.search)
  // Support both date param formats for flexibility
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo)

  const query = queryParams.toString()
  const endpoint = query ? `/finance/purchases?${query}` : '/finance/purchases'

  const response = await apiClient<any>(endpoint, {
    method: 'GET',
  })

  // Normalize response structure based on backend format
  let items: Purchase[] = []
  let pagination = { page: 1, limit: 10, total: 0, totalPages: 0 }
  let totalAmount = 0
  
  if (response.success) {
    // Backend can return data as array or as object with purchases key
    if (Array.isArray(response.data)) {
      items = response.data
    } else if (response.data?.purchases) {
      items = response.data.purchases
    } else if (response.data?.items) {
      items = response.data.items
    }
    
    // Pagination can be at root or in data
    if (response.pagination) {
      pagination = response.pagination
    } else if (response.data?.pagination) {
      pagination = response.data.pagination
    }
    
    // Total amount can be at root or in data
    if (response.totalAmount !== undefined) {
      totalAmount = response.totalAmount
    } else if (response.data?.totalAmount !== undefined) {
      totalAmount = response.data.totalAmount
    }
  }

  return {
    success: response.success,
    data: {
      purchases: items,
      pagination,
      totalAmount
    }
  }
}

/**
 * Get purchase summary/statistics
 */
export async function fetchPurchasesSummary(params?: {
  startDate?: string
  endDate?: string
  dateFrom?: string
  dateTo?: string
  category?: string
}): Promise<PurchaseSummaryResponse> {
  const queryParams = new URLSearchParams()

  // Support both date param formats for flexibility
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
  if (params?.category) queryParams.append('category', params.category)

  const query = queryParams.toString()
  const endpoint = query ? `/finance/purchases/summary?${query}` : '/finance/purchases/summary'

  const response = await apiClient<any>(endpoint, {
    method: 'GET',
  })

  // Normalize summary response structure
  let summaryData: any = {}
  
  if (response.success) {
    // Summary can be directly in data or nested
    if (response.data) {
      summaryData = response.data
    }
    
    // Normalize totalPurchases field
    if (summaryData.totalPurchases === undefined) {
      summaryData.totalPurchases = summaryData.totalAmount || 0
    }
    
    // Ensure totalCount exists
    if (summaryData.totalCount === undefined) {
      summaryData.totalCount = summaryData.count || 0
    }
  }

  return {
    success: response.success,
    data: summaryData
  }
}

/**
 * Get single purchase record by ID
 */
export async function fetchPurchaseById(id: string): Promise<PurchaseDetailResponse> {
  return apiClient<PurchaseDetailResponse>(`/finance/purchases/${id}`, {
    method: 'GET',
  })
}

/**
 * Create new purchase record
 */
export async function createPurchase(payload: PurchasePayload): Promise<PurchaseDetailResponse> {
  return apiClient<PurchaseDetailResponse>('/finance/purchases', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Update existing purchase record
 */
export async function updatePurchase(
  id: string,
  payload: Partial<PurchasePayload>
): Promise<PurchaseDetailResponse> {
  return apiClient<PurchaseDetailResponse>(`/finance/purchases/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

/**
 * Delete purchase record (soft delete)
 */
export async function deletePurchase(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient(`/finance/purchases/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Restore soft-deleted purchase record
 */
export async function restorePurchase(id: string): Promise<PurchaseDetailResponse> {
  return apiClient<PurchaseDetailResponse>(`/finance/purchases/${id}/restore`, {
    method: 'POST',
  })
}

/**
 * Submit purchase for approval
 */
export async function submitPurchase(id: string): Promise<PurchaseDetailResponse> {
  return apiClient<PurchaseDetailResponse>(`/finance/purchases/${id}/submit`, {
    method: 'POST',
  })
}

/**
 * Approve purchase record
 */
export async function approvePurchase(
  id: string,
  comment?: string
): Promise<PurchaseDetailResponse> {
  return apiClient<PurchaseDetailResponse>(`/finance/purchases/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  })
}

/**
 * Reject purchase record
 */
export async function rejectPurchase(
  id: string,
  reason: string
): Promise<PurchaseDetailResponse> {
  return apiClient<PurchaseDetailResponse>(`/finance/purchases/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

/**
 * Cancel purchase record
 */
export async function cancelPurchase(
  id: string,
  reason?: string
): Promise<PurchaseDetailResponse> {
  return apiClient<PurchaseDetailResponse>(`/finance/purchases/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}
