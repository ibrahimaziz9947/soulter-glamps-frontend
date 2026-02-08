/**
 * Auth API Service
 * Handles all authentication-related API calls
 * IMPORTANT: All auth is cookie-based. Never store tokens in localStorage.
 */

import { api } from './apiClient'

// Types
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'CUSTOMER'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Login as Super Admin
 */
export async function loginSuperAdmin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/super-admin/login', credentials)
}

/**
 * Login as Admin
 */
export async function loginAdmin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/admin/login', credentials)
}

/**
 * Login as Agent
 */
export async function loginAgent(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/agent/login', credentials)
}

/**
 * Get current authenticated user using JWT from localStorage
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // JWT is sent in Authorization header by apiClient
    const response = await api.get<AuthResponse>('/auth/me')
    if (response.success && response.user) {
      return response.user
    }
    return null
  } catch (_error: any) {
    return null
  }
}

/**
 * Logout current user (remove JWT from localStorage)
 */
export async function logout(): Promise<void> {
  try {
    localStorage.removeItem('auth_token')
  } catch (error) {
    console.error('[Auth] Logout error:', error)
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  return user?.role === requiredRole
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(user: User | null, requiredRoles: UserRole[]): boolean {
  return user ? requiredRoles.includes(user.role) : false
}
