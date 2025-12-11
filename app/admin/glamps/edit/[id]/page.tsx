'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditGlampPage() {
  const params = useParams()
  const router = useRouter()

  // Mock data - in real app, fetch based on params.id
  const [formData, setFormData] = useState({
    name: 'Luxury Safari Tent',
    category: 'tent',
    description: 'Experience the ultimate safari-style luxury in our spacious canvas tent. Featuring a king-size bed, private ensuite bathroom, and a private deck overlooking pristine wilderness.',
    price: '250',
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    area: '400',
    amenities: ['King-size bed', 'Private bathroom', 'Hot shower', 'Air conditioning', 'Heating', 'Wi-Fi', 'Mini fridge', 'Coffee maker', 'Terrace', 'Fire pit'],
    images: [] as string[],
    status: 'available',
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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
    alert('Glamp updated successfully!')
    router.push('/admin/glamps')
  }

  const handleDelete = () => {
    alert('Glamp deleted successfully!')
    router.push('/admin/glamps')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="font-serif text-3xl font-bold text-green">Edit Glamp</h1>
            <p className="text-text-light mt-1">Update glamping accommodation details</p>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-2 border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Glamp
        </button>
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
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[1, 2, 3, 4].map((img) => (
                <div key={img} className="relative aspect-square bg-cream rounded-lg overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-smooth">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow transition-smooth">
              <svg className="w-10 h-10 text-text-light mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-text-dark font-medium mb-1">Add more images</p>
              <p className="text-sm text-text-light">PNG, JPG or WEBP (max. 5MB)</p>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Recent Bookings</h2>
            
            <div className="space-y-3">
              {[
                { id: 'BK-001', guest: 'Sarah Johnson', dates: 'Dec 15-18, 2025', amount: '$750' },
                { id: 'BK-007', guest: 'Patricia Lee', dates: 'Jan 2-5, 2026', amount: '$750' },
              ].map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-cream rounded-lg">
                  <div>
                    <p className="font-medium text-text-dark">{booking.guest}</p>
                    <p className="text-sm text-text-light">{booking.dates}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green">{booking.amount}</p>
                    <p className="text-sm text-text-light">{booking.id}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              href="/admin/bookings"
              className="block text-center text-yellow hover:text-yellow-light font-medium mt-4 transition-smooth"
            >
              View All Bookings →
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 space-y-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
            {/* Status */}
            <div>
              <h2 className="font-serif text-xl font-bold text-green mb-4">Availability Status</h2>
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

            {/* Stats */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-text-dark mb-4">Performance Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-light">Total Bookings</span>
                  <span className="font-semibold text-text-dark">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">Total Revenue</span>
                  <span className="font-semibold text-green">$3,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">Occupancy Rate</span>
                  <span className="font-semibold text-yellow">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">Avg. Rating</span>
                  <span className="font-semibold text-text-dark">4.8/5.0</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200 space-y-3">
              <button
                type="submit"
                className="w-full bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
              >
                Update Glamp
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
      </form>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-slide-up">
            <h3 className="font-serif text-2xl font-bold text-green mb-4">Delete Glamp?</h3>
            <p className="text-text-dark mb-6">
              Are you sure you want to delete <strong>{formData.name}</strong>? This action cannot be undone and will remove all associated bookings and data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 border-2 border-gray-300 text-text-dark px-4 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition-smooth"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
