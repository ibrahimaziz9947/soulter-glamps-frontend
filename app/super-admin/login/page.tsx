'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LOGIN_ENDPOINT } from '../../config/api'

export default function SuperAdminLogin() {
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
      console.log('[Super-Admin Login] Submitting to:', LOGIN_ENDPOINT)
      
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      console.log('[Super-Admin Login] Response status:', response.status)
      console.log('[Super-Admin Login] Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json().catch(() => ({}))
        console.log('[Super-Admin Login] Login successful, data:', data)
        console.log('[Super-Admin Login] Cookies after login:', document.cookie)
        
        // Check for redirect param, otherwise go to dashboard
        const redirectTo = searchParams.get('redirect') || '/super-admin/dashboard'
        console.log('[Super-Admin Login] Redirecting to:', redirectTo)
        router.push(redirectTo)
      } else {
        const data = await response.json()
        console.log('[Super-Admin Login] Login failed:', data)
        setError(data.message || 'Invalid email or password')
      }
    } catch (err) {
      console.error('[Super-Admin Login] Error:', err)
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-dark to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-gradient-to-br from-yellow to-yellow-light rounded-full p-5 mb-4 shadow-2xl border-4 border-yellow/30">
            <svg className="w-14 h-14 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Super Admin</h1>
          <p className="text-yellow text-sm font-semibold tracking-wider uppercase">System Control Panel</p>
          <div className="mt-4 inline-block bg-red-600/20 border border-red-500/50 rounded-lg px-4 py-2">
            <p className="text-red-400 text-xs font-bold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Restricted access — authorized personnel only
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-t-4 border-yellow animate-slide-up">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-semibold">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow transition-all font-medium"
                  placeholder="superadmin@soulterglamps.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow transition-all font-medium"
                  placeholder="Enter secure password"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green border-gray-400 rounded focus:ring-yellow"
                />
                <span className="ml-2 text-gray-700 font-medium group-hover:text-green transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-yellow hover:text-green font-bold transition-colors">
                Need help?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green via-green-dark to-green text-white py-4 px-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all shadow-lg transform hover:-translate-y-0.5 uppercase tracking-wide border-2 border-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {isLoading ? 'Logging in...' : 'Secure Login'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600 font-bold uppercase tracking-wider">Security Notice</span>
              </div>
            </div>

            {/* Security Warning */}
            <div className="bg-gradient-to-r from-yellow/10 to-red-500/10 border-2 border-yellow/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="text-sm text-gray-800">
                  <p className="font-bold text-green mb-1">High-Level Access</p>
                  <p className="text-xs leading-relaxed">
                    This portal grants full system access. All login attempts are monitored and logged. 
                    Unauthorized access is strictly prohibited and will be prosecuted.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <a href="/" className="block text-white hover:text-yellow transition-colors text-sm font-bold">
            ← Return to Main Site
          </a>
          <p className="text-gray-500 text-xs">
            © 2025 Soulter Glamps. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
