/**
 * Super Admin Bookings API Service
 * Handles super-admin booking-related API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface SuperAdminBooking {
  id: string
  glampId: string
  glampName?: string
  customerId: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  checkInDate: string
  checkOutDate: string
  guests: number
  totalAmountCents?: number
  amountPaidCents?: number
  remainingAmountCents?: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID'
  specialRequests?: string
  addOns?: string[]
  agentId?: string
  agentName?: string
  commissionCents?: number
  createdAt: string
  updatedAt: string
}

export interface SuperAdminBookingsResponse {
  success: boolean
  data?: SuperAdminBooking[]
  count?: number
  error?: string
  message?: string
}

export interface SuperAdminBookingDetailResponse {
  success: boolean
  data?: SuperAdminBooking
  error?: string
  message?: string
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Fetch all bookings for super admin
 * @param params - Query parameters for filtering bookings
 * @returns List of bookings with optional filters
 */
export async function getSuperAdminBookings(params?: {
  status?: string
  glampId?: string
  agentId?: string
  from?: string
  to?: string
  limit?: number
  offset?: number
}): Promise<SuperAdminBooking[]> {
  const queryParams = new URLSearchParams()
  
  // Add optional filter params
  if (params?.status && params.status.trim()) {
    queryParams.append('status', params.status.trim())
  }
  if (params?.glampId && params.glampId.trim()) {
    queryParams.append('glampId', params.glampId.trim())
  }
  if (params?.agentId && params.agentId.trim()) {
    queryParams.append('agentId', params.agentId.trim())
  }
  
  // Validate and add date params (must be YYYY-MM-DD format)
  if (params?.from && params.from.trim() && params.from.length === 10) {
    queryParams.append('from', params.from.trim())
  }
  if (params?.to && params.to.trim() && params.to.length === 10) {
    queryParams.append('to', params.to.trim())
  }
  
  // Add pagination params
  if (params?.limit && params.limit > 0) {
    queryParams.append('limit', params.limit.toString())
  }
  if (params?.offset && params.offset >= 0) {
    queryParams.append('offset', params.offset.toString())
  }
  
  const queryString = queryParams.toString()
  const endpoint = `/super-admin/bookings${queryString ? `?${queryString}` : ''}`
  
  const response = await apiClient<SuperAdminBookingsResponse>(endpoint)
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Super Admin Bookings API returned success:false'
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    throw new Error('Super Admin Bookings API returned no data')
  }
  
  return response.data
}

/**
 * Fetch a single booking by ID for super admin
 * @param id - Booking ID
 * @returns Detailed booking information
 */
export async function getSuperAdminBookingById(id: string): Promise<SuperAdminBooking> {
  if (!id || !id.trim()) {
    throw new Error('Booking ID is required')
  }
  
  const endpoint = `/super-admin/bookings/${id.trim()}`
  
  const response = await apiClient<SuperAdminBookingDetailResponse>(endpoint)
  
  // Check for explicit success:false in response
  if (response.success === false) {
    const errorMsg = response.error || response.message || 'Super Admin Booking API returned success:false'
    throw new Error(errorMsg)
  }
  
  if (!response.data) {
    throw new Error('Super Admin Booking API returned no data')
  }
  
  return response.data
}
