/**
 * Admin Dashboard API Service
 * Handles dashboard summary API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface DashboardSummary {
  totalBookings: number
  revenue: number // In major units (PKR)
  occupancyRatePercent: number
  activeStaff: number
}

export interface DashboardSummaryResponse {
  success: boolean
  data?: DashboardSummary
  error?: string
  message?: string
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Fetch admin dashboard summary
 * @param params - Query parameters for date filtering
 * @returns Dashboard summary with KPIs
 */
export async function fetchDashboardSummary(params?: {
  from?: string
  to?: string
}): Promise<DashboardSummary> {
  const queryParams = new URLSearchParams()
  
  // Validate and add date params (must be YYYY-MM-DD format)
  if (params?.from && params.from.trim() && params.from.length === 10) {
    queryParams.append('from', params.from.trim())
  }
  if (params?.to && params.to.trim() && params.to.length === 10) {
    queryParams.append('to', params.to.trim())
  }
  
  const queryString = queryParams.toString()
  const endpoint = `/admin/dashboard/summary${queryString ? `?${queryString}` : ''}`
  
  // Log request details for debugging
  console.log('[Dashboard API] Summary request:', {
    endpoint,
    params: {
      from: params?.from || 'not set',
      to: params?.to || 'not set'
    }
  })
  
  const response = await apiClient<DashboardSummaryResponse>(endpoint)
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Dashboard API returned success:false'
    console.error('[Dashboard API] Summary error response:', response)
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    console.error('[Dashboard API] Summary missing data:', response)
    throw new Error('Dashboard API returned no data')
  }
  
  return response.data
}
