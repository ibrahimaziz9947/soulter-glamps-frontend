/**
 * Commissions API Service
 * Handles all commission-related API calls
 */

import { api } from './apiClient'

// ==================== TYPES ====================

export interface Commission {
  id: string
  amount: number
  agentId: string
  bookingId: string
  status: 'UNPAID' | 'PAID'
  createdAt: string
  booking?: {
    id: string
    customerName: string
    checkInDate: string
    checkOutDate: string
    totalAmount: number
    glamp?: {
      name: string
    }
  }
}

export interface CommissionSummary {
  totalEarned: number
  totalPending: number
  totalCommissions: number
  paidCommissions: number
  unpaidCommissions: number
}

export interface CommissionsListResponse {
  success: boolean
  data: Commission[]
}

export interface CommissionSummaryResponse {
  success: boolean
  data: CommissionSummary
}

// ==================== AGENT ENDPOINTS ====================

/**
 * Get all commissions for the logged-in agent
 */
export async function getAgentCommissions(): Promise<Commission[]> {
  try {
    const response = await api.get<CommissionsListResponse>('/agent/commissions')
    return response.data || []
  } catch (error: any) {
    console.error('[commissions.api] Error fetching agent commissions:', error)
    throw new Error(error.message || 'Failed to fetch commissions')
  }
}

/**
 * Get commission summary statistics for the logged-in agent
 */
export async function getAgentCommissionSummary(): Promise<CommissionSummary> {
  try {
    const response = await api.get<CommissionSummaryResponse>('/agent/commissions/summary')
    return response.data || {
      totalEarned: 0,
      totalPending: 0,
      totalCommissions: 0,
      paidCommissions: 0,
      unpaidCommissions: 0,
    }
  } catch (error: any) {
    console.error('[commissions.api] Error fetching commission summary:', error)
    throw new Error(error.message || 'Failed to fetch commission summary')
  }
}

// ==================== ADMIN ENDPOINTS ====================

/**
 * Get all commissions (admin only)
 */
export async function getAllCommissions(): Promise<Commission[]> {
  try {
    const response = await api.get<CommissionsListResponse>('/admin/commissions')
    return response.data || []
  } catch (error: any) {
    console.error('[commissions.api] Error fetching all commissions:', error)
    throw new Error(error.message || 'Failed to fetch commissions')
  }
}

/**
 * Update commission status (admin only)
 */
export async function updateCommissionStatus(
  commissionId: string,
  status: 'UNPAID' | 'PAID'
): Promise<void> {
  try {
    await api.patch(`/admin/commissions/${commissionId}/status`, { status })
  } catch (error: any) {
    console.error('[commissions.api] Error updating commission status:', error)
    throw new Error(error.message || 'Failed to update commission status')
  }
}
