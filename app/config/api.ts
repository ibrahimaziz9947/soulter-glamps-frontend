// API Configuration
// Backend server base URL (without /api suffix - added by individual endpoints)
// Reads from NEXT_PUBLIC_API_BASE_URL; falls back to empty string to avoid build-time errors.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// Authentication endpoint (role determined server-side)
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`
