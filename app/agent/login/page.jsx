'use client'

import { useState } from 'react'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('[Agent Login] Submitting login...')

      const response = await loginAgent(formData)

      console.log('[Agent Login] Response:', response)

      if (!response?.success || !response?.token) {
        setError(response?.message || 'Invalid email or password')
        return
      }

      // ✅ Token-based auth ONLY
      localStorage.setItem('auth_token', response.token)

      console.log('[Agent Login] Login successful → redirecting to dashboard')

      // ✅ SINGLE redirect (do not duplicate elsewhere)
      router.replace('/agent/dashboard')

    } catch (err) {
      console.error('[Agent Login] Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Agent Login
        </h1>

        {error && (
          <p className="mb-4 text-red-600 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          className="w-full mb-6 px-4 py-2 border rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green text-white py-2 rounded hover:opacity-90"
        >
          {isLoading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
