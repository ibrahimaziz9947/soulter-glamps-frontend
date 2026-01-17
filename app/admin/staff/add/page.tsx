'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createStaff } from '@/src/services/staff.api'

export default function AddStaffPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'STAFF' as 'STAFF' | 'ADMIN',
    password: '',
  })

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.fullName || !formData.email) {
      setToast({ message: 'Please fill in all required fields', type: 'error' })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setToast({ message: 'Please enter a valid email address', type: 'error' })
      return
    }

    try {
      setIsSubmitting(true)
      
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        password: formData.password || undefined,
      }

      console.log('[Add Staff] Submitting:', payload)

      const response = await createStaff(payload)

      setToast({ message: 'Staff member created successfully!', type: 'success' })
      
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 500)
    } catch (error: any) {
      console.error('[Add Staff] Failed:', error)
      setToast({ 
        message: error.message || 'Failed to create staff member', 
        type: 'error' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
          toast.type === 'success' ? 'bg-green text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/dashboard"
          className="p-2 hover:bg-cream rounded-lg transition-smooth"
        >
          <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Add Staff Member</h1>
          <p className="text-text-light mt-1">Create a new staff or admin account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-green mb-6">Staff Information</h2>
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="john@soulterglamps.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="+92 300 1234567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
            >
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="text-sm text-text-light mt-2">
              Staff members can view bookings. Admins have full access.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Password (Optional)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Leave blank for system to generate"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
            />
            <p className="text-sm text-text-light mt-2">
              If left blank, a temporary password will be generated and sent via email.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-200 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Staff Member'}
            </button>
            <Link
              href="/admin/dashboard"
              className={`flex-1 text-center border-2 border-gray-300 text-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth ${
                isSubmitting ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
