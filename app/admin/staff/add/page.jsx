'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddStaffPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    shift: 'morning',
    salary: '',
    dateOfJoining: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    status: 'active',
  })

  const roles = [
    'Manager', 'Receptionist', 'Housekeeping', 'Chef', 'Cook',
    'Maintenance', 'Guide', 'Security', 'Driver', 'Gardener'
  ]

  const departments = [
    'Operations', 'Front Desk', 'Cleaning', 'Kitchen', 'Technical',
    'Activities', 'Security', 'Transportation', 'Maintenance'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Staff member added successfully!')
    router.push('/admin/staff')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/staff"
          className="p-2 hover:bg-cream rounded-lg transition-smooth"
        >
          <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Add New Staff Member</h1>
          <p className="text-text-light mt-1">Create a new team member profile</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

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
                  placeholder="john@soulterglamps.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Street address, city, state, zip code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Employment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                >
                  <option value="">Select role...</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                >
                  <option value="">Select department...</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Work Shift *
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent capitalize"
                >
                  <option value="morning">Morning (6 AM - 2 PM)</option>
                  <option value="evening">Evening (2 PM - 10 PM)</option>
                  <option value="night">Night (10 PM - 6 AM)</option>
                  <option value="full-day">Full Day (9 AM - 5 PM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Date of Joining *
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Monthly Salary ($)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  placeholder="3000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Emergency Contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Documents</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Resume / CV
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow transition-smooth">
                  <svg className="w-8 h-8 text-text-light mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-text-dark">Click to upload or drag and drop</p>
                  <p className="text-xs text-text-light mt-1">PDF, DOC, DOCX (max. 5MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  ID Proof
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow transition-smooth">
                  <svg className="w-8 h-8 text-text-light mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-text-dark">Click to upload or drag and drop</p>
                  <p className="text-xs text-text-light mt-1">PDF, JPG, PNG (max. 5MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Employment Status</h2>
            
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-3">
                  Status
                </label>
                <div className="space-y-2">
                  {['active', 'on-leave', 'inactive'].map(status => (
                    <label
                      key={status}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-smooth capitalize ${
                        formData.status === status
                          ? 'border-yellow bg-yellow/10'
                          : 'border-gray-200 hover:border-yellow/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={handleChange}
                        className="w-5 h-5 text-yellow focus:ring-yellow"
                      />
                      <span className="text-text-dark">
                        {status === 'on-leave' ? 'On Leave' : status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {formData.firstName && formData.lastName && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-text-dark mb-4">Preview</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green text-cream rounded-full flex items-center justify-center font-bold text-lg">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-text-dark">{formData.firstName} {formData.lastName}</p>
                      {formData.role && <p className="text-sm text-text-light">{formData.role}</p>}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {formData.email && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-text-dark truncate">{formData.email}</span>
                      </div>
                    )}
                    {formData.department && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-text-dark">{formData.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <button
                  type="submit"
                  className="w-full bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
                >
                  Add Staff Member
                </button>
                <Link
                  href="/admin/staff"
                  className="block w-full text-center border-2 border-gray-300 text-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
