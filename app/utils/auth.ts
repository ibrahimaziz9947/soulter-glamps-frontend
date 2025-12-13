/**
 * JWT Token Utilities
 * Safe JWT decoding and validation for authentication
 */

export interface AuthPayload {
  role: string
  userId: string
  iat?: number
  exp?: number
}

/**
 * Safely decode JWT without verification
 * Note: This does NOT verify the signature - that should be done on the server
 * For production, consider using a library like 'jsonwebtoken'
 */
export function decodeToken(token: string): AuthPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid JWT format')
      return null
    }

    // Decode payload (second part)
    const payload = parts[1]

    // Add padding if necessary for base64 decoding
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4)
    const decoded = Buffer.from(padded, 'base64').toString('utf-8')

    const parsed = JSON.parse(decoded)

    // Validate required fields
    if (!parsed.role || !parsed.userId) {
      console.error('JWT missing required fields')
      return null
    }

    return {
      role: parsed.role,
      userId: parsed.userId,
      iat: parsed.iat,
      exp: parsed.exp,
    }
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(payload: AuthPayload): boolean {
  if (!payload.exp) {
    return false
  }

  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

/**
 * Validate if user role has access to required roles
 */
export function hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

/**
 * Get user role from token
 * Useful for client-side components that need to check permissions
 */
export function getUserRole(token: string): string | null {
  const payload = decodeToken(token)
  if (!payload) return null

  if (isTokenExpired(payload)) {
    return null
  }

  return payload.role
}
