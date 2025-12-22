'use client'

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
}
