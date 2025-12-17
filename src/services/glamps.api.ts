/**
 * Glamps API Service
 * Handles all glamping-related API calls
 */

import { api } from './apiClient'

// Types
export interface Glamp {
  _id: string
  id?: string // Frontend might map _id to id
  name: string
  description: string
  capacity: number
  pricePerNight: number
  amenities: string[]
  images: string[]
  availability: boolean
  createdAt: string
  updatedAt: string
}

export interface GlampsResponse {
  success: boolean
  data: Glamp[]
  count: number
}

export interface GlampResponse {
  success: boolean
  data: Glamp
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
