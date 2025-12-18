// API Configuration
// Backend server base URL (without /api suffix - added by individual endpoints)
// CRITICAL: Must be set via NEXT_PUBLIC_API_BASE_URL environment variable
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set. Please configure it in your deployment environment.')
}

export const API_BASE_URL = apiBaseUrl

// Authentication endpoint (role determined server-side)
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`
