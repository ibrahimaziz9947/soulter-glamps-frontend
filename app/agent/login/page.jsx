/*'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { loginAgent } from '@/src/services/auth.api'

export default function AgentLoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 🔒 CRITICAL: prevents duplicate submissions
  const hasSubmittedRef = useRef(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🛑 Prevent duplicate execution
    if (hasSubmittedRef.current) return
    hasSubmittedRef.current = true

    setError('')
    setIsLoading(true)

    try {
      console.log('[Agent Login] Submitting login...')

      const response = await loginAgent(formData)

      console.log('[Agent Login] Response:', response)

      if (!response?.success || !response?.token) {
        hasSubmittedRef.current = false
        setError(response?.message || 'Invalid email or password')
        setIsLoading(false)
        return
      }

      // ✅ TOKEN-BASED AUTH ONLY
      localStorage.setItem('auth_token', response.token)

      console.log('[Agent Login] Login successful → redirecting to dashboard')

      // ✅ SINGLE redirect
      router.replace('/agent/dashboard')

    } catch (err) {
      console.error('[Agent Login] Error:', err)
      hasSubmittedRef.current = false
      setError('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Agent Login</h1>

        {error && (
          <p className="mb-4 text-red-600 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="w-full mb-4 p-3 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full mb-6 p-3 border rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green text-white py-3 rounded disabled:opacity-60"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
} */




'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAgent } from '@/app/config/auth.api'

export default function AgentLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // ✅ ONLY redirect IF already authenticated → dashboard
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      router.replace('/agent/dashboard')
    } else {
      setCheckingSession(false)
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginAgent({ email, password })

      if (!response?.success || !response?.token) {
        setError('Invalid email or password')
        return
      }

      // ✅ Store token
      localStorage.setItem('auth_token', response.token)

      // ✅ Go to dashboard ONCE
      router.replace('/agent/dashboard')
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ⛔ Prevent form flash during session check
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying session…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">Agent Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white p-2"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}

