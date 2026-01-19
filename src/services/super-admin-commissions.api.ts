/**
 * Super Admin Commissions API Service
 * Handles super-admin commission-related API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface SuperAdminCommission {
  id: string
  amountCents: number
  agentId: string
  agentName?: string
  agentEmail?: string
  bookingId: string
  bookingCustomerName?: string
  bookingCheckInDate?: string
  bookingCheckOutDate?: string
  bookingTotalAmountCents?: number
  glampId?: string
  glampName?: string
  status: 'UNPAID' | 'PAID'
  paidAt?: string
  paidBy?: string
  createdAt: string
  updatedAt: string
}

export interface SuperAdminCommissionsResponse {
  success: boolean
  data?: {
    items: SuperAdminCommission[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    range: {
      from: string
      to: string
    }
    aggregates: {
      totalCommissions: number
      paidCount: number
      unpaidCount: number
      totalAmountCents: number
      paidAmountCents: number
      pendingAmountCents?: number
      unpaidAmountCents?: number
    }
  }
  error?: string
  message?: string
}

export interface SuperAdminCommissionDetailResponse {
  success: boolean
  data?: SuperAdminCommission
  error?: string
  message?: string
}

export interface MarkCommissionPaidPayload {
  paidAt?: string
  notes?: string
}

export interface MarkCommissionPaidResponse {
  success: boolean
  data?: SuperAdminCommission
  error?: string
  message?: string
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Fetch all commissions for super admin
 * @param params - Query parameters for filtering commissions
 * @returns List of commissions with optional filters
 */
export async function getSuperAdminCommissions(params?: {
  status?: string
  agentId?: string
  glampId?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}): Promise<{
  items: SuperAdminCommission[]
  meta: { page: number; limit: number; total: number; totalPages: number }
  range: { from: string; to: string }
  aggregates: {
    totalCommissions: number
    paidCount: number
    unpaidCount: number
    totalAmountCents: number
    paidAmountCents: number
    pendingAmountCents?: number
    unpaidAmountCents?: number
  }
}> {
  const queryParams = new URLSearchParams()
  
  // Add optional filter params
  if (params?.status && params.status.trim()) {
    queryParams.append('status', params.status.trim())
  }
  if (params?.agentId && params.agentId.trim()) {
    queryParams.append('agentId', params.agentId.trim())
  }
  if (params?.glampId && params.glampId.trim()) {
    queryParams.append('glampId', params.glampId.trim())
  }
  
  // Validate and add date params (must be YYYY-MM-DD format)
  if (params?.from && params.from.trim() && params.from.length === 10) {
    queryParams.append('from', params.from.trim())
  }
  if (params?.to && params.to.trim() && params.to.length === 10) {
    queryParams.append('to', params.to.trim())
  }
  
  // Add pagination params
  if (params?.page && params.page > 0) {
    queryParams.append('page', params.page.toString())
  }
  if (params?.limit && params.limit > 0) {
    queryParams.append('limit', params.limit.toString())
  }
  
  const queryString = queryParams.toString()
  const endpoint = `/super-admin/commissions${queryString ? `?${queryString}` : ''}`
  
  const response = await apiClient<SuperAdminCommissionsResponse>(endpoint)
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Super Admin Commissions API returned success:false'
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    throw new Error('Super Admin Commissions API returned no data')
  }
  
  // Handle both old array format and new structured format for backward compatibility
  if (Array.isArray(response.data)) {
    // Legacy format - convert to new format
    return {
      items: response.data,
      meta: { page: 1, limit: response.data.length, total: response.data.length, totalPages: 1 },
      range: { from: params?.from || '', to: params?.to || '' },
      aggregates: {
        totalCommissions: response.data.length,
        paidCount: response.data.filter((c: SuperAdminCommission) => c.status === 'PAID').length,
        unpaidCount: response.data.filter((c: SuperAdminCommission) => c.status === 'UNPAID').length,
        totalAmountCents: response.data.reduce((sum: number, c: SuperAdminCommission) => sum + c.amountCents, 0),
        paidAmountCents: response.data
          .filter((c: SuperAdminCommission) => c.status === 'PAID')
          .reduce((sum: number, c: SuperAdminCommission) => sum + c.amountCents, 0),
        unpaidAmountCents: response.data
          .filter((c: SuperAdminCommission) => c.status === 'UNPAID')
          .reduce((sum: number, c: SuperAdminCommission) => sum + c.amountCents, 0)
      }
    }
  }
  
  return response.data
}

/**
 * Fetch a single commission by ID for super admin
 * @param id - Commission ID
 * @returns Detailed commission information
 */
export async function getSuperAdminCommissionById(id: string): Promise<SuperAdminCommission> {
  if (!id || !id.trim()) {
    throw new Error('Commission ID is required')
  }
  
  const endpoint = `/super-admin/commissions/${id.trim()}`
  
  const response = await apiClient<SuperAdminCommissionDetailResponse>(endpoint)
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Super Admin Commission API returned success:false'
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    throw new Error('Super Admin Commission API returned no data')
  }
  
  return response.data
}

/**
 * Mark a commission as paid (super admin only)
 * @param id - Commission ID
 * @param payload - Payment details (optional paidAt date and notes)
 * @returns Updated commission
 */
export async function markSuperAdminCommissionPaid(
  id: string,
  payload?: MarkCommissionPaidPayload
): Promise<SuperAdminCommission> {
  if (!id || !id.trim()) {
    throw new Error('Commission ID is required')
  }
  
  const endpoint = `/super-admin/commissions/${id.trim()}/mark-paid`
  
  const response = await apiClient<MarkCommissionPaidResponse>(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload || {})
  })
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Failed to mark commission as paid'
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    throw new Error('Mark commission paid API returned no data')
  }
  
  return response.data
}

/**
 * Mark a commission as unpaid (super admin only)
 * @param id - Commission ID
 * @returns Updated commission
 */
export async function markSuperAdminCommissionUnpaid(id: string): Promise<SuperAdminCommission> {
  if (!id || !id.trim()) {
    throw new Error('Commission ID is required')
  }
  
  const endpoint = `/super-admin/commissions/${id.trim()}/mark-unpaid`
  
  const response = await apiClient<MarkCommissionPaidResponse>(endpoint, {
    method: 'POST'
  })
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Failed to mark commission as unpaid'
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    throw new Error('Mark commission unpaid API returned no data')
  }
  
  return response.data
}
