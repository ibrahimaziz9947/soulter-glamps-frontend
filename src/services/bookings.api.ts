/**
 * Bookings API Service
 * Handles all booking-related API calls
 *

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
 
export async function createBooking(
  payload: BookingPayload
): Promise<BookingResponse> {
  return api.post<BookingResponse>('/bookings', payload)
}

/**
 * Get all bookings (admin/agent)
 
export async function getBookings(): Promise<BookingsListResponse> {
  return api.get<BookingsListResponse>('/bookings')
}

/**
 * Get a single booking by ID
 
export async function getBookingById(id: string): Promise<BookingResponse> {
  return api.get<BookingResponse>(`/bookings/${id}`)
} */







// src/services/bookings.api.ts

export interface BookingPayload {
  glampId: string
  checkInDate: string
  checkOutDate: string
  guests: number
  customerName: string
  customerEmail: string
  customerPhone: string
}

export interface Booking {
  id: string
  status: string
  totalAmount?: number
  amountPaid?: number
  remainingAmount?: number
  checkInDate: string
  checkOutDate: string
  guests: number
  glampId: string
  glampName?: string
  customerName: string
  customerEmail?: string
}

export interface BookingResponse {
  success: boolean
  message?: string
  booking?: Booking
  error?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function createBooking(payload: BookingPayload): Promise<BookingResponse> {
  console.log('[bookings.api] Creating booking with payload:', payload)
  
  // Validate payload
  if (!payload.glampId || !payload.checkInDate || !payload.checkOutDate) {
    throw new Error('Missing required booking fields')
  }

  if (!payload.customerName || !payload.customerEmail || !payload.customerPhone) {
    throw new Error('Missing required customer information')
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    console.log('[bookings.api] API response:', data)

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    if (!data.success) {
      throw new Error(data.error || 'Booking creation failed')
    }

    return data
  } catch (error: any) {
    console.error('[bookings.api] Error creating booking:', error)
    throw new Error(error.message || 'Failed to create booking')
  }
}

export async function getBookingById(id: string): Promise<BookingResponse> {
  console.log('[bookings.api] Fetching booking:', id)

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    console.log('[bookings.api] Booking details:', data)

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch booking')
    }

    return data
  } catch (error: any) {
    console.error('[bookings.api] Error fetching booking:', error)
    throw new Error(error.message || 'Failed to fetch booking')
  }
}
