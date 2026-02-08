/**
 * Glamps API Service
 * Handles all glamping-related API calls
 */

import { api } from './apiClient'
import { apiClient } from './apiClient'

// Types
export interface Glamp {
  _id: string
  id?: string // Frontend might map _id to id
  name: string
  category?: string
  description: string
  capacity: number
  bedrooms?: number
  bathrooms?: number
  area?: string
  pricePerNight: number
  amenities: string[]
  images: string[]
  availability: boolean
  status?: string
  discountEnabled?: boolean
  discountPercent?: number
  createdAt: string
  updatedAt: string
}

export interface CreateGlampPayload {
  name: string
  category: string
  description: string
  price: number
  capacity: number
  bedrooms: number
  bathrooms: number
  area?: string
  amenities: string[]
  images?: string[]
  status?: 'available' | 'unavailable' | 'maintenance'
  discountEnabled?: boolean
  discountPercent?: number
}

export type UpdateGlampPayload = Partial<CreateGlampPayload>

export interface GlampsResponse {
  success: boolean
  data: Glamp[]
  count: number
}

export interface GlampResponse {
  success: boolean
  data: Glamp
  message?: string
  error?: string
}

/**
 * Get all glamps
 */
export async function getGlamps(): Promise<GlampsResponse> {
  return api.get<GlampsResponse>('/glamps')
}

/**
 * Get a single glamp by ID
 */
export async function getGlampById(id: string): Promise<GlampResponse> {
  return api.get<GlampResponse>(`/glamps/${id}`)
}

/**
 * Update an existing glamp
 */
export async function updateGlamp(
  id: string,
  payload: UpdateGlampPayload
): Promise<GlampResponse> {
  console.log('[Glamps API] Updating glamp:', id)

  try {
    const response = await apiClient<GlampResponse>(`/admin/glamps/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })

    console.log('[Glamps API] Glamp updated successfully')
    return response
  } catch (error: any) {
    console.error('[Glamps API] Failed to update glamp:', error)
    throw error
  }
}
export async function createGlamp(
  payload: CreateGlampPayload
): Promise<GlampResponse> {
  console.log('[Glamps API] Creating glamp:', payload.name)

  try {
    const response = await apiClient<GlampResponse>('/admin/glamps', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    console.log('[Glamps API] Glamp created successfully')
    return response
  } catch (error: any) {
    console.error('[Glamps API] Failed to create glamp:', error)
    throw error
  }
}
