/**
 * Income API Service
 * Handles all income-related API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface Income {
  id: string
  title: string
  category?: string | { id: string; name: string }
  amount: number // Amount in cents (integer)
  date: string // ISO date string (YYYY-MM-DD)
  description?: string
  reference?: string
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
  status?: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdAt?: string
  updatedAt?: string
}

export interface IncomePayload {
  title: string
  amount: number // Amount in cents (integer)
  date: string // ISO date string
  category?: string
  description?: string
  reference?: string
  status?: 'DRAFT' | 'SUBMITTED'
}

export interface IncomeListResponse {
  success: boolean
  data: {
    income: Income[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    totalAmount: number // Total in cents
  }
}

export interface IncomeSummaryResponse {
  success: boolean
  data: {
    totalIncome: number // In cents
    approvedIncome: number // In cents
    pendingIncome: number // In cents
    draftIncome: number // In cents
    rejectedIncome: number // In cents
  }
}

export interface IncomeDetailResponse {
  success: boolean
  data: Income
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Get list of income records with pagination and filters
 */
export async function getIncomeList(params?: {
  page?: number
  limit?: number
  status?: string
  category?: string
  search?: string
  startDate?: string
  endDate?: string
}): Promise<IncomeListResponse> {
  const queryParams = new URLSearchParams()

  if (params?.page) queryParams.append('page', String(params.page))
  if (params?.limit) queryParams.append('limit', String(params.limit))
  if (params?.status) queryParams.append('status', params.status)
  if (params?.category) queryParams.append('category', params.category)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)

  const query = queryParams.toString()
  const endpoint = query ? `/finance/income?${query}` : '/finance/income'

  return apiClient<IncomeListResponse>(endpoint, {
    method: 'GET',
  })
}

/**
 * Get income summary/statistics
 */
export async function getIncomeSummary(params?: {
  startDate?: string
  endDate?: string
}): Promise<IncomeSummaryResponse> {
  const queryParams = new URLSearchParams()

  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)

  const query = queryParams.toString()
  const endpoint = query ? `/finance/income/summary?${query}` : '/finance/income/summary'

  return apiClient<IncomeSummaryResponse>(endpoint, {
    method: 'GET',
  })
}

/**
 * Get single income record by ID
 */
export async function getIncomeById(id: string): Promise<IncomeDetailResponse> {
  return apiClient<IncomeDetailResponse>(`/finance/income/${id}`, {
    method: 'GET',
  })
}

/**
 * Create new income record
 */
export async function createIncome(payload: IncomePayload): Promise<IncomeDetailResponse> {
  return apiClient<IncomeDetailResponse>('/finance/income', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Update existing income record
 */
export async function updateIncome(
  id: string,
  payload: Partial<IncomePayload>
): Promise<IncomeDetailResponse> {
  return apiClient<IncomeDetailResponse>(`/finance/income/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

/**
 * Delete income record (soft delete)
 */
export async function deleteIncome(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient(`/finance/income/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Restore soft-deleted income record (if backend supports)
 */
export async function restoreIncome(id: string): Promise<IncomeDetailResponse> {
  return apiClient<IncomeDetailResponse>(`/finance/income/${id}/restore`, {
    method: 'POST',
  })
}

/**
 * Submit income for approval
 */
export async function submitIncome(id: string): Promise<IncomeDetailResponse> {
  return apiClient<IncomeDetailResponse>(`/finance/income/${id}/submit`, {
    method: 'POST',
  })
}

/**
 * Approve income record
 */
export async function approveIncome(
  id: string,
  comment?: string
): Promise<IncomeDetailResponse> {
  return apiClient<IncomeDetailResponse>(`/finance/income/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  })
}

/**
 * Reject income record
 */
export async function rejectIncome(
  id: string,
  reason: string
): Promise<IncomeDetailResponse> {
  return apiClient<IncomeDetailResponse>(`/finance/income/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

/**
 * Cancel income record
 */
export async function cancelIncome(
  id: string,
  reason?: string
): Promise<IncomeDetailResponse> {
  return apiClient<IncomeDetailResponse>(`/finance/income/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}
