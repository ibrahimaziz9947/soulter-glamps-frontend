/**
 * Base API Client
 * Provides a fetch wrapper with consistent error handling and configuration */
 

import { API_BASE_URL } from '@/app/config/api'

const API_URL_WITH_PREFIX = `${API_BASE_URL}/api`

// Log the API base URL on initialization (client-side only)
if (typeof window !== 'undefined') {
  console.log('[API Client] Base URL:', API_URL_WITH_PREFIX)
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean
}

/**
 * Generic API client for making HTTP requests */
 
export async function apiClient<T = any>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options

  // Get JWT from localStorage if present
  let authHeader = {}
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        authHeader = { Authorization: `Bearer ${token}` }
      }
    } catch (e) {
      console.error('Failed to read token from localStorage:', e)
    }
  }
  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
      ...authHeader,
    },
    // Never use credentials: 'include' for token-based auth
  }

  const fullUrl = `${API_URL_WITH_PREFIX}${endpoint}`
  
  if (typeof window !== 'undefined') {
    console.log(`[API Client] ${config.method || 'GET'} ${fullUrl}`)
  }

  try {
    const response = await fetch(fullUrl, config)

    console.log(`[API Client] Response status:`, response.status)

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    let data: any = null
    if (isJson) {
      data = await response.json()
      console.log(`[API Client] Response data:`, data)
    } else {
      const text = await response.text()
      console.log(`[API Client] Response text:`, text)
      data = { message: text }
    }

    // Handle error responses
    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}`
      console.error(`[API Client] Error response:`, {
        status: response.status,
        message: errorMessage,
        data
      })
      throw new ApiError(
        response.status,
        errorMessage,
        data
      )
    }

    return data as T
  } catch (error) {
    // Log the error with full details
    console.error(`[API Client] Request failed:`, {
      url: fullUrl,
      method: config.method || 'GET',
      error: error instanceof Error ? error.message : String(error)
    })

    if (error instanceof ApiError) {
      throw error
    }

    // Network or other errors
    const networkErrorMsg = error instanceof Error 
      ? error.message 
      : 'Unable to connect to server. Please check your connection.'
    
    throw new ApiError(
      0,
      networkErrorMsg,
      null
    )
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(endpoint: string, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
} 







