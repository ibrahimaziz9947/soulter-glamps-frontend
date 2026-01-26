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
  source: string // BOOKING | MANUAL | OTHER
  status: string // DRAFT | CONFIRMED | CANCELLED | SUBMITTED
  amount: number // Amount in major units (PKR)
  currency: string // PKR | USD | EUR | GBP
  dateReceived?: string // ISO date string (YYYY-MM-DD)
  reference?: string
  notes?: string
  bookingId?: string
  booking?: {
    id: string
    bookingCode: string
    customerName?: string
    glampsiteName?: string
    checkInDate?: string
    checkOutDate?: string
  }
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
}

export interface IncomePayload {
  source: string // BOOKING | MANUAL | OTHER
  status: string // DRAFT | CONFIRMED | CANCELLED | SUBMITTED
  amount: number // Amount in major units (PKR)
  currency: string // PKR | USD | EUR | GBP
  dateReceived: string // ISO date string (YYYY-MM-DD)
  reference?: string
  notes?: string
  bookingId?: string // Required when source is BOOKING
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
    totalAmount: number // Total in major units (PKR)
  }
}

export interface IncomeSummaryResponse {
  success: boolean
  data: {
    totalIncome: number // In major units (PKR)
    totalCount: number
    byStatus?: {
      DRAFT?: number
      CONFIRMED?: number
      CANCELLED?: number
      SUBMITTED?: number
    }
    // Legacy fields for backward compatibility
    confirmedIncome?: number
    draftIncome?: number
    cancelledIncome?: number
    approvedIncome?: number // In major units (PKR)
    pendingIncome?: number // In major units (PKR)
    rejectedIncome?: number // In major units (PKR)
  }
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Fetch income list
 */
export async function fetchIncomeList(params?: {
  page?: number
  limit?: number
  status?: string
  source?: string
  from?: string
  to?: string
  search?: string
}): Promise<IncomeListResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.status) queryParams.append('status', params.status)
  if (params?.source) queryParams.append('source', params.source)
  if (params?.from) queryParams.append('from', params.from)
  if (params?.to) queryParams.append('to', params.to)
  if (params?.search) queryParams.append('search', params.search)
  
  const queryString = queryParams.toString()
  const endpoint = `/finance/income${queryString ? `?${queryString}` : ''}`
  
  return apiClient<IncomeListResponse>(endpoint)
}

/**
 * Fetch income summary/stats
 */
export async function fetchIncomeSummary(params?: {
  from?: string
  to?: string
}): Promise<IncomeSummaryResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.from) queryParams.append('from', params.from)
  if (params?.to) queryParams.append('to', params.to)
  
  const queryString = queryParams.toString()
  const endpoint = `/finance/income/summary${queryString ? `?${queryString}` : ''}`
  
  return apiClient<IncomeSummaryResponse>(endpoint)
}

/**
 * Create new income record
 */
export async function createIncome(data: IncomePayload): Promise<Income> {
  const response = await apiClient<{ success: boolean; data: Income }>(
    '/finance/income',
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  )
  return response.data
}

/**
 * Update income record
 */
export async function updateIncome(id: string, data: Partial<IncomePayload>): Promise<Income> {
  const response = await apiClient<{ success: boolean; data: Income }>(
    `/finance/income/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data)
    }
  )
  return response.data
}

/**
 * Delete income record
 */
export async function deleteIncome(id: string): Promise<void> {
  await apiClient<{ success: boolean }>(
    `/finance/income/${id}`,
    {
      method: 'DELETE'
    }
  )
}
