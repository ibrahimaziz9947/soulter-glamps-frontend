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
}
