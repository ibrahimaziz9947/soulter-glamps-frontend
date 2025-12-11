'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddGlampPage() {
  const router = useRouter()
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
  })

  const categories = ['tent', 'dome', 'treehouse', 'cabin', 'yurt', 'pod']
  
  const amenitiesOptions = [
    'King-size bed', 'Private bathroom', 'Hot shower', 'Air conditioning',
    'Heating', 'Wi-Fi', 'Mini fridge', 'Coffee maker', 'Terrace',
    'Fire pit', 'BBQ grill', 'Kitchenette', 'Smart TV', 'Sound system',
    'Towels & linens', 'Toiletries', 'Hair dryer', 'Safe box',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to an API
    alert('Glamp created successfully!')
    router.push('/admin/glamps')
  }

  return (
    <div className="space-y-6">
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
                  placeholder="e.g., Luxury Safari Tent"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent capitalize"
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
                  rows={5}
                  placeholder="Describe the accommodation, its unique features, and what makes it special..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Price per Night ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="250"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
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
                    min="0"
                    placeholder="400"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
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
                  min="1"
                  max="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
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
                  min="0"
                  max="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
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
                  min="0"
                  max="3"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
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
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
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
                      <p className="font-semibold text-green">${formData.price}/night</p>
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
                  className="w-full bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
                >
                  Create Glamp
                </button>
                <button
                  type="button"
                  className="w-full border-2 border-green text-green px-6 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth"
                >
                  Save as Draft
                </button>
                <Link
                  href="/admin/glamps"
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
