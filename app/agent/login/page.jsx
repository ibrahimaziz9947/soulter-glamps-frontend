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



/*
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
//import { loginAgent } from '@/app/config/auth.api'
import { loginAgent } from '@/src/services/auth.api'


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
} */



/* Authentication Perfect Finally
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAgent } from '@/src/services/auth.api'

export default function AgentLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

      // ✅ Redirect ONCE
      router.replace('/agent/dashboard')
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
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
} */








'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAgent } from '@/src/services/auth.api'

export default function AgentLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  // ✅ Session check (NO redirect loops)
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
      const res = await loginAgent({ email, password })

      if (!res?.success || !res?.token) {
        setError('Invalid email or password')
        return
      }

      localStorage.setItem('auth_token', res.token)
      router.replace('/agent/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3ea]">
        <p className="text-gray-600">Verifying session…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1f3d12] to-[#0f2608] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center">
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="13" cy="8" r="4" />
              <path d="M4 22c0-4.4 4-8 9-8s9 3.6 9 8" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-green-900">
          Agent Login
        </h1>
        <p className="text-center text-sm text-gray-600 mt-1">
          For registered agents only
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-1">
              Email Address
            </label>
            <div className="flex items-center bg-blue-50 border rounded-lg px-3">
              <span className="mr-2 text-gray-500">📧</span>
              <input
                type="email"
                className="w-full bg-transparent py-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-1">
              Password
            </label>
            <div className="flex items-center bg-blue-50 border rounded-lg px-3">
              <span className="mr-2 text-gray-500">🔒</span>
              <input
                type="password"
                className="w-full bg-transparent py-2 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="text-yellow-600 cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Signing in…' : 'Login to Dashboard'}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 border border-yellow-300 bg-yellow-50 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-900 mb-1">
            Agent Portal Access
          </p>
          <p className="text-gray-700">
            This portal is exclusively for registered sales agents. If you
            don’t have login credentials, please contact your supervisor.
          </p>
        </div>

        {/* Back */}
        <p
          onClick={() => router.push('/')}
          className="mt-6 text-center text-sm text-white cursor-pointer hover:underline"
        >
          ← Back to Home
        </p>
      </div>
    </div>
  )
}







/*
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAgent } from '@/src/services/auth.api'

export default function AgentLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  // ✅ Session check (NO redirect loops)
  useEffect(() => {
    const token = localStorage.getItem('agent_auth_token')
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
      const res = await loginAgent({ email, password })

      if (!res?.success || !res?.token) {
        setError('Invalid email or password')
        return
      }

      //localStorage.setItem('agent_auth_token', res.token)
      // Clear admin session if switching roles
      localStorage.removeItem('admin_auth_token')

      localStorage.setItem('agent_auth_token', res.token)

      router.replace('/agent/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3ea]">
        <p className="text-gray-600">Verifying session…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1f3d12] to-[#0f2608] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Icon *
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center">
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="13" cy="8" r="4" />
              <path d="M4 22c0-4.4 4-8 9-8s9 3.6 9 8" />
            </svg>
          </div>
        </div>

        {/* Heading *
        <h1 className="text-3xl font-bold text-center text-green-900">
          Agent Login
        </h1>
        <p className="text-center text-sm text-gray-600 mt-1">
          For registered agents only
        </p>

        {/* Form *
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* Email *
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-1">
              Email Address
            </label>
            <div className="flex items-center bg-blue-50 border rounded-lg px-3">
              <span className="mr-2 text-gray-500">📧</span>
              <input
                type="email"
                className="w-full bg-transparent py-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password *
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-1">
              Password
            </label>
            <div className="flex items-center bg-blue-50 border rounded-lg px-3">
              <span className="mr-2 text-gray-500">🔒</span>
              <input
                type="password"
                className="w-full bg-transparent py-2 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Remember / Forgot *
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="text-yellow-600 cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Button *
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Signing in…' : 'Login to Dashboard'}
          </button>
        </form>

        {/* Info Box *
        <div className="mt-6 border border-yellow-300 bg-yellow-50 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-900 mb-1">
            Agent Portal Access
          </p>
          <p className="text-gray-700">
            This portal is exclusively for registered sales agents. If you
            don’t have login credentials, please contact your supervisor.
          </p>
        </div>

        {/* Back *
        <p
          onClick={() => router.push('/')}
          className="mt-6 text-center text-sm text-white cursor-pointer hover:underline"
        >
          ← Back to Home
        </p>
      </div>
    </div>
  )
} */