// Example Login Handler for API Route
// File: app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Example credentials (in production, validate against database)
const VALID_CREDENTIALS = {
  'admin@soulter.com': {
    password: 'admin123',
    role: 'ADMIN',
    userId: 'admin1',
  },
  'agent@soulter.com': {
    password: 'agent123',
    role: 'AGENT',
    userId: 'agent1',
  },
  'superadmin@soulter.com': {
    password: 'super123',
    role: 'SUPER_ADMIN',
    userId: 'superadmin1',
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Validate credentials
    const user = VALID_CREDENTIALS[email as keyof typeof VALID_CREDENTIALS]
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT payload
    const payload = {
      role: user.role,
      userId: user.userId,
      email: email,
    }

    // Sign JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    const token = jwt.sign(payload, secret, {
      expiresIn: '7d', // Token expires in 7 days
    })

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          email,
          role: user.role,
          userId: user.userId,
        },
      },
      { status: 200 }
    )

    // Set secure cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,        // Prevent JavaScript access (XSS protection)
      secure: true,          // HTTPS only
      sameSite: 'strict',    // CSRF protection
      maxAge: 86400 * 7,     // 7 days in seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
