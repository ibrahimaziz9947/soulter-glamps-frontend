'use client'

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

  // ✅ If already logged in → dashboard
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
      const response = await loginAdmin({ email, password })

      if (!response?.success || !response?.token) {
        setError('Invalid email or password')
        return
      }

      // ✅ Store token
      localStorage.setItem('auth_token', response.token)

      // ✅ Redirect ONCE
      router.replace('/admin/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ⛔ Prevent flash while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying session…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green via-green-dark to-green flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-center mb-2">
          Admin Login
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Management Dashboard Access
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a href="/" className="text-green hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
