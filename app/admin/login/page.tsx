'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginAdmin } from '@/src/services/auth.api'

export default function AdminLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('[Admin Login] Submitting login...')
      const response = await loginAdmin(formData)
      console.log('[Admin Login] Response:', response)
      
      if (response.success) {
        console.log('[Admin Login] Login successful! Redirecting...')
        const redirectTo = searchParams.get('redirect') || '/admin/dashboard'
        console.log('[Admin Login] Redirect URL:', redirectTo)
        // Always store JWT in localStorage for token-based auth
        if (response.token) {
          try {
            localStorage.setItem('auth_token', response.token);
          } catch (e) {
            console.error('Failed to store token in localStorage:', e);
          }
        }
        router.push(redirectTo)
      } else {
        console.log('[Admin Login] Login failed:', response.message)
        setError(response.message || 'Invalid email or password')
      }
      
    } catch (err: any) {
      console.error('[Admin Login] Error:', err)
      setError(err.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green via-green-dark to-green flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-yellow rounded-full p-4 mb-4 shadow-lg">
            <svg className="w-12 h-12 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-bold text-cream mb-2">Admin Portal</h1>
          <p className="text-cream/80">Management Dashboard Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <h2 className="font-serif text-2xl font-bold text-green mb-6 text-center">
            Sign In
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent transition-smooth"
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent transition-smooth"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green hover:bg-green-dark text-cream font-semibold py-3 px-4 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-text-light">
              Need assistance?{' '}
              <a href="/contact" className="text-green hover:text-green-dark font-medium transition-smooth">
                Contact Support
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-cream/80 hover:text-cream text-sm transition-smooth">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
