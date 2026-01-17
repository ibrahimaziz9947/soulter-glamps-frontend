/**
 * Staff API Service
 * Handles staff/admin management API calls
 */

import { apiClient } from './apiClient'

/* =========================
   TYPES
========================= */

export interface StaffMember {
  id: string
  fullName: string
  email: string
  phone?: string
  role: 'STAFF' | 'ADMIN' | 'SUPER_ADMIN'
  status?: 'ACTIVE' | 'INACTIVE'
  createdAt?: string
  updatedAt?: string
}

export interface CreateStaffPayload {
  fullName: string
  email: string
  phone?: string
  role: 'STAFF' | 'ADMIN'
  password?: string
}

export interface StaffResponse {
  success: boolean
  data?: StaffMember
  message?: string
  error?: string
}

export interface StaffListResponse {
  success: boolean
  data?: StaffMember[]
  count?: number
  message?: string
  error?: string
}

/* =========================
   API FUNCTIONS
========================= */

/**
 * Create a new staff member
 */
export async function createStaff(
  payload: CreateStaffPayload
): Promise<StaffResponse> {
  console.log('[Staff API] Creating staff member:', payload.email)

  try {
    const response = await apiClient<StaffResponse>('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    console.log('[Staff API] Staff member created successfully')
    return response
  } catch (error: any) {
    console.error('[Staff API] Failed to create staff member:', error)
    throw error
  }
}

/**
 * Get all staff members
 */
export async function getAllStaff(): Promise<StaffListResponse> {
  console.log('[Staff API] Fetching all staff members')

  try {
    const response = await apiClient<StaffListResponse>('/admin/staff', {
      method: 'GET',
    })

    console.log('[Staff API] Staff members fetched:', response.data?.length || 0)
    return response
  } catch (error: any) {
    console.error('[Staff API] Failed to fetch staff members:', error)
    throw error
  }
}

/**
 * Get staff member by ID
 */
export async function getStaffById(id: string): Promise<StaffResponse> {
  console.log('[Staff API] Fetching staff member:', id)

  try {
    const response = await apiClient<StaffResponse>(`/admin/staff/${id}`, {
      method: 'GET',
    })

    console.log('[Staff API] Staff member fetched successfully')
    return response
  } catch (error: any) {
    console.error('[Staff API] Failed to fetch staff member:', error)
    throw error
  }
}
