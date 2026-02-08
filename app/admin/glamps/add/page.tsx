'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createGlamp } from '@/src/services/glamps.api'

export default function AddGlampPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    amenities: [] as string[],
    images: [] as string[],
    status: 'available',
    discountEnabled: false,
    discountPercent: 0,
  })

  const categories = ['tent', 'dome', 'treehouse', 'cabin', 'yurt', 'pod']
  
  const amenitiesOptions = [
    'King-size bed', 'Private bathroom', 'Hot shower', 'Air conditioning',
    'Heating', 'Wi-Fi', 'Mini fridge', 'Coffee maker', 'Terrace',
    'Fire pit', 'BBQ grill', 'Kitchenette', 'Smart TV', 'Sound system',
    'Towels & linens', 'Toiletries', 'Hair dryer', 'Safe box',
  ]

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox' && name === 'discountEnabled') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
        setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      setToast({ message: 'Please fill in all required fields', type: 'error' })
      return
    }

    const priceNum = parseFloat(formData.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setToast({ message: 'Please enter a valid price', type: 'error' })
      return
    }

    try {
      setIsSubmitting(true)
      
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description || '',
        price: priceNum,
        capacity: formData.capacity,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area || undefined,
        amenities: formData.amenities,
        images: formData.images.length > 0 ? formData.images : undefined,
        status: formData.status as 'available' | 'unavailable' | 'maintenance',
        discountEnabled: formData.discountEnabled,
        discountPercent: Number(formData.discountPercent),
      }

      console.log('[Add Glamp] Submitting:', payload)

      const response = await createGlamp(payload)

      setToast({ message: 'Glamp created successfully!', type: 'success' })
      
      setTimeout(() => {
        router.push('/admin/glamps')
      }, 500)
    } catch (error: any) {
      console.error('[Add Glamp] Failed:', error)
      setToast({ 
        message: error.message || 'Failed to create glamp', 
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
          href="/admin/glamps"
          className="p-2 hover:bg-cream rounded-lg transition-smooth"
        >
          <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Add New Glamp</h1>
          <p className="text-text-light mt-1">Create a new glamping accommodation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Glamp Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., Luxury Safari Tent"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent capitalize disabled:bg-gray-50"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  placeholder="Describe the accommodation, its unique features, and what makes it special..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent resize-none disabled:bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Price per Night (PKR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    min="0"
                    placeholder="250"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    min="0"
                    placeholder="400"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Capacity & Features */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Capacity & Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Guest Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="1"
                  max="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                  max="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                  max="3"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Amenities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {amenitiesOptions.map(amenity => (
                <label
                  key={amenity}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-smooth ${
                    formData.amenities.includes(amenity)
                      ? 'border-yellow bg-yellow/10'
                      : 'border-gray-200 hover:border-yellow/50'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => !isSubmitting && handleAmenityToggle(amenity)}
                    disabled={isSubmitting}
                    className="w-5 h-5 text-yellow focus:ring-yellow rounded"
                  />
                  <span className="text-text-dark">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow transition-smooth">
              <svg className="w-12 h-12 text-text-light mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-text-dark font-medium mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-text-light">PNG, JPG or WEBP (max. 5MB each)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>

            <p className="text-sm text-text-light mt-4">
              Upload at least 5 high-quality images. First image will be the main display photo.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Status & Actions</h2>
            
            <div className="space-y-6">
              {/* Discount Settings */}
              <div className="border-b border-gray-200 pb-6">
                  <h2 className="font-serif text-xl font-bold text-green mb-4">Discount Settings</h2>
                  <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative">
                              <input 
                                  type="checkbox" 
                                  name="discountEnabled"
                                  checked={formData.discountEnabled}
                                  onChange={handleChange}
                                  className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
                          </div>
                          <span className="font-medium text-text-dark">Enable Discount</span>
                      </label>

                      <div>
                          <label className="block text-sm font-semibold text-text-dark mb-2">
                              Discount Percentage (%)
                          </label>
                          <input
                              type="number"
                              name="discountPercent"
                              value={formData.discountPercent}
                              onChange={handleChange}
                              disabled={!formData.discountEnabled}
                              min="0"
                              max="100"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                          />
                          {formData.discountEnabled && formData.price && (
                              <p className="text-xs text-green mt-1">
                                  Final Price: ${(Number(formData.price) * (1 - Number(formData.discountPercent) / 100)).toFixed(2)}
                              </p>
                          )}
                      </div>
                  </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-3">
                  Availability Status
                </label>
                <div className="space-y-2">
                  {['available', 'booked', 'maintenance'].map(status => (
                    <label
                      key={status}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-smooth capitalize ${
                        formData.status === status
                          ? 'border-yellow bg-yellow/10'
                          : 'border-gray-200 hover:border-yellow/50'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-5 h-5 text-yellow focus:ring-yellow"
                      />
                      <span className="text-text-dark">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preview Info */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-text-dark mb-4">Preview</h3>
                <div className="space-y-3">
                  {formData.name && (
                    <div>
                      <p className="text-sm text-text-light">Name</p>
                      <p className="font-medium text-text-dark">{formData.name}</p>
                    </div>
                  )}
                  {formData.price && (
                    <div>
                      <p className="text-sm text-text-light">Price</p>
                      <p className="font-semibold text-green">PKR {formData.price}/night</p>
                    </div>
                  )}
                  {formData.category && (
                    <div>
                      <p className="text-sm text-text-light">Category</p>
                      <p className="font-medium text-text-dark capitalize">{formData.category}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-text-light">Capacity</p>
                    <p className="font-medium text-text-dark">{formData.capacity} Guests</p>
                  </div>
                  {formData.amenities.length > 0 && (
                    <div>
                      <p className="text-sm text-text-light">Amenities Selected</p>
                      <p className="font-medium text-yellow">{formData.amenities.length}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Glamp...' : 'Create Glamp'}
                </button>
                <Link
                  href="/admin/glamps"
                  className={`block w-full text-center border-2 border-gray-300 text-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth ${
                    isSubmitting ? 'pointer-events-none opacity-50' : ''
                  }`}
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
