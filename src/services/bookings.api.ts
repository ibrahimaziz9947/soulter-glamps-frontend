/*

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


 
export async function createBooking(
  payload: BookingPayload
): Promise<BookingResponse> {
  return api.post<BookingResponse>('/bookings', payload)
}


 
export async function getBookings(): Promise<BookingsListResponse> {
  return api.get<BookingsListResponse>('/bookings')
}


 
export async function getBookingById(id: string): Promise<BookingResponse> {
  return api.get<BookingResponse>(`/bookings/${id}`)
} */







/* src/services/bookings.api.ts

export interface BookingPayload {
  glampId: string
  checkInDate: string
  checkOutDate: string
  guests: number
  numberOfGlamps: number
  customerName: string
  customerEmail?: string
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
} */






/* src/services/bookings.api.ts

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

// Discriminated union for type-safe response handling
export type BookingResponse =
  | {
      success: true
      message?: string
      booking: Booking
    }
  | {
      success: false
      error: string
    }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function createBooking(payload: BookingPayload): Promise<BookingResponse> {
  console.log('[bookings.api] Creating booking with payload:', payload)
  
  // Validate payload - return error instead of throwing
  if (!payload.glampId || !payload.checkInDate || !payload.checkOutDate) {
    return {
      success: false,
      error: 'Missing required booking fields',
    }
  }

  if (!payload.customerName || !payload.customerEmail || !payload.customerPhone) {
    return {
      success: false,
      error: 'Missing required customer information',
    }
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
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      }
    }

    if (!data.success || !data.booking) {
      return {
        success: false,
        error: data.error || 'Booking creation failed',
      }
    }

    return {
      success: true,
      message: data.message,
      booking: data.booking,
    }
  } catch (error: any) {
    console.error('[bookings.api] Error creating booking:', error)
    return {
      success: false,
      error: error.message || 'Failed to create booking',
    }
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
      const errorMessage = data.error || `HTTP error! status: ${response.status}`
      return {
        success: false,
        error: errorMessage,
      }
    }

    if (!data.success || !data.booking) {
      return {
        success: false,
        error: data.error || 'Failed to fetch booking',
      }
    }

    return {
      success: true,
      booking: data.booking,
    }
  } catch (error: any) {
    console.error('[bookings.api] Error fetching booking:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch booking',
    }
  }
} */






// src/services/bookings.api.ts

export type BookingPayload =
  | {
      glampIds: string[]
      numberOfGlamps: number
      checkInDate: string
      checkOutDate: string
      guests: number
      customerName: string
      customerEmail?: string
      customerPhone: string
    }
  | {
      glampId: string
      checkInDate: string
      checkOutDate: string
      guests: number
      customerName: string
      customerEmail?: string
      customerPhone: string
      numberOfGlamps?: number
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

// Discriminated union for strict type safety
export type BookingResponse =
  | { success: true; message?: string; booking: Booking }
  | { success: false; error: string }

// ⚠️ DO NOT throw at module level (breaks Next.js build)
/*const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

function getApiBaseUrl(): string | null {
  if (!API_BASE_URL) {
    console.error(
      '[bookings.api] NEXT_PUBLIC_API_URL is missing. Booking API unavailable.'
    )
    return null
  }
  return API_BASE_URL
}*/

import { API_BASE_URL } from '@/app/config/api'
function getApiBaseUrl(): string {
  // Allow empty string for relative paths (proxy usage)
  return API_BASE_URL
}

export async function createBooking(
  payload: BookingPayload
): Promise<BookingResponse> {
  console.log('[bookings.api] Creating booking with payload:', payload)

  const baseUrl = getApiBaseUrl()

  const hasMulti = 'glampIds' in payload
  const hasSingle = 'glampId' in payload

  if (
    (hasMulti && (!payload.glampIds || payload.glampIds.length < 1)) ||
    (hasSingle && !payload.glampId) ||
    !payload.checkInDate ||
    !payload.checkOutDate
  ) {
    return {
      success: false,
      error: 'Missing required booking fields',
    }
  }

  if (!payload.customerName || !payload.customerPhone) {
    return {
      success: false,
      error: 'Missing required customer information',
    }
  }

  try {
    const response = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // future-safe for auth
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log('[bookings.api] API response:', data)

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `HTTP ${response.status}`,
      }
    }

    if (!data?.success || !data?.booking) {
      return {
        success: false,
        error: data?.error || 'Booking creation failed',
      }
    }

    return {
      success: true,
      message: data.message,
      booking: data.booking,
    }
  } catch (error) {
    console.error('[bookings.api] Network error:', error)
    return {
      success: false,
      error: 'Unable to reach booking server',
    }
  }
}

export async function getBookingById(
  id: string
): Promise<BookingResponse> {
  console.log('[bookings.api] Fetching booking:', id)

  const baseUrl = getApiBaseUrl()

  try {
    const response = await fetch(`${baseUrl}/api/bookings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    console.log('[bookings.api] Booking details:', data)

    if (!response.ok || !data?.success || !data?.booking) {
      return {
        success: false,
        error: data?.error || 'Failed to fetch booking',
      }
    }

    return {
      success: true,
      booking: data.booking,
    }
  } catch (error) {
    console.error('[bookings.api] Network error:', error)
    return {
      success: false,
      error: 'Unable to reach booking server',
    }
  }
}

// Availability Check
export interface AvailabilityResponse {
  success: boolean
  data?: {
    available: boolean
    conflictingCount?: number
    conflicts?: any[]
  }
  available?: boolean
  message?: string
  error?: string
}

export async function checkAvailability(
  glampId: string,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResponse> {
  console.log('[bookings.api] Checking availability:', { glampId, checkIn, checkOut })

  const baseUrl = getApiBaseUrl()

  if (!glampId || !checkIn || !checkOut) {
    return {
      success: false,
      error: 'Missing required parameters',
    }
  }

  try {
    const params = new URLSearchParams({
      glampId,
      checkIn,
      checkOut,
    })

    const response = await fetch(`${baseUrl}/api/bookings/availability?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    console.log('[bookings.api] Availability response:', data)

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `HTTP ${response.status}`,
      }
    }

    // Handle both response formats: { data: { available } } or { available }
    const available = data.data?.available ?? data.available ?? false
    
    return {
      success: true,
      data: data.data,
      available: available,
      message: data.message,
    }
  } catch (error) {
    console.error('[bookings.api] Network error:', error)
    return {
      success: false,
      error: 'Unable to reach booking server',
    }
  }
}

export async function checkAvailabilityForGlamps(
  glampIds: string[],
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResponse> {
  console.log('[bookings.api] Checking availability (multi):', { glampIds, checkIn, checkOut })

  const baseUrl = getApiBaseUrl()

  if (!glampIds?.length || !checkIn || !checkOut) {
    return {
      success: false,
      error: 'Missing required parameters',
    }
  }

  try {
    const params = new URLSearchParams({
      glampIds: glampIds.join(','),
      checkIn,
      checkOut,
    })

    const response = await fetch(`${baseUrl}/api/bookings/availability?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    console.log('[bookings.api] Availability response (multi):', data)

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `HTTP ${response.status}`,
      }
    }

    const available = data.data?.available ?? data.available ?? false
    return {
      success: true,
      data: data.data,
      available,
      message: data.message,
    }
  } catch (error) {
    console.error('[bookings.api] Network error:', error)
    return {
      success: false,
      error: 'Unable to reach booking server',
    }
  }
}
