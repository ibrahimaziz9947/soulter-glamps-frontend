// API Configuration
// Backend server base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'

// Authentication endpoint (role determined server-side)
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`
