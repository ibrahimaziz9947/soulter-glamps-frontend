/**
 * Bookings API Service
 * Handles all booking-related API calls
 */

import { api } from './apiClient'

// Types
export interface BookingPayload {
  glampId: string
  checkInDate: string // ISO date string (YYYY-MM-DD)
  checkOutDate: string // ISO date string (YYYY-MM-DD)
  guests: number
  customerName: string
  customerEmail: string 
  customerPhone: string
  specialRequests?: string
  addOns?: string[]
}

export interface Booking {
  id: string
  glampId: string
  customerId: string
  checkInDate: string
  checkOutDate: string
  guests: number
  totalAmount?: number
  amountPaid?: number
  remainingAmount?: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID'
  specialRequests?: string
  addOns?: string[]
  createdAt: string
  updatedAt: string
}

export interface BookingResponse {
  success: boolean
  message?: string
  booking: Booking
}

export interface BookingsListResponse {
  success: boolean
  data: Booking[]
  count: number
}

/**
 * Create a new booking
 */
export async function createBooking(
  payload: BookingPayload
): Promise<BookingResponse> {
  return api.post<BookingResponse>('/bookings', payload)
}

/**
 * Get all bookings (admin/agent)
 */
export async function getBookings(): Promise<BookingsListResponse> {
  return api.get<BookingsListResponse>('/bookings')
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(id: string): Promise<BookingResponse> {
  return api.get<BookingResponse>(`/bookings/${id}`)
}
