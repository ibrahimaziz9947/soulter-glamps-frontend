/*'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/src/services/auth.api'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // ✅ If token already exists → dashboard
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      router.replace('/admin/dashboard')
    } else {
      setCheckingSession(false)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginAdmin({ email, password })

      if (!res?.success || !res?.token) {
        setError('Invalid credentials')
        return
      }

      // 🔐 STORE TOKEN (THIS WAS MISSING)
      localStorage.setItem('auth_token', res.token)

      router.replace('/admin/dashboard')
    } catch {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying session…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3ea]">
      <form onSubmit={handleSubmit} className="w-96 bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 mb-3"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border p-2 mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  )
} */







/*

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/src/services/apiClient'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true)

      const res = await api.post('/auth/login', {
        email,
        password,
      })

      if (res?.success && res?.token) {
        // ✅ STORE TOKEN FIRST
        localStorage.setItem('auth_token', res.token)

        // ✅ THEN REDIRECT
        router.replace('/admin/dashboard')
      }
    } catch (err) {
      alert('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    // your UI here
    <button onClick={() => handleLogin('admin@email.com', 'password')}>
      {loading ? 'Logging in…' : 'Login'}
    </button>
  )
} */





/*
// app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/src/services/auth.api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await loginAdmin({ email, password })

      if (!res?.token) throw new Error('No token received')

      // Store token
      localStorage.setItem('auth_token', res.token)
      
      // Verify it was stored
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken !== res.token) {
        throw new Error('Failed to store token')
      }

      // Use window.location for clean state
      window.location.href = '/admin/dashboard'
      
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email"
          required
          disabled={loading}
        />
        <input 
          type="password"
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}*/






/* app/admin/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/src/services/auth.api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shouldRedirect, setShouldRedirect] = useState(false)

  // Handle redirect in a separate effect after state update
  useEffect(() => {
    if (shouldRedirect) {
      // Use hard redirect to ensure clean state
      window.location.href = '/admin/dashboard'
    }
  }, [shouldRedirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await loginAdmin({ email, password })
      if (!res?.token) throw new Error('No token received')

      // Store token
      localStorage.setItem('auth_token', res.token)
      console.log('[Login] Stored token at', Date.now())
      // Verify it was stored
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken !== res.token) {
        throw new Error('Token storage failed')
      }

      console.log('[Login] Token stored successfully')

      // Trigger redirect via state
      setShouldRedirect(true)
    } catch (err) {
      console.error('[Login] Error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email"
          required
          disabled={loading}
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
} */






/* ============================================
// FILE 1: app/admin/login/page.tsx
// ============================================
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/src/services/auth.api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await loginAdmin({ email, password })
      if (!res?.token) throw new Error('No token received')

      // Store token FIRST
      //localStorage.setItem('admin_auth_token', res.token)
      // Clear agent session if switching roles
      //localStorage.removeItem('agent_auth_token')

      localStorage.setItem('admin_auth_token', res.token)


      console.log('[Login] Token stored:', res.token.substring(0, 20) + '...')

      // CRITICAL FIX: Use router.push() instead of window.location.href
      // This maintains the React context and preserves localStorage
      router.push('/admin/dashboard')

      // Alternative if router.push doesn't work:
      // router.replace('/admin/dashboard')

    } catch (err) {
      console.error('[Login] Error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
} */




'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/src/services/auth.api'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    try {
      const res = await loginAdmin({ email, password })

      if (!res?.token) {
        throw new Error('No token received')
      }

      localStorage.setItem('admin_auth_token', res.token)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          disabled={loading}
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}








