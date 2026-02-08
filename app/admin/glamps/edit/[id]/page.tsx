'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getGlampById, updateGlamp, type Glamp } from '@/src/services/glamps.api'

export default function EditGlampPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    capacity: 1,
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    amenities: [] as string[],
    images: [] as string[],
    status: 'available',
    discountEnabled: false,
    discountPercent: 0,
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const categories = ['tent', 'dome', 'treehouse', 'cabin', 'yurt', 'pod']
  
  const amenitiesOptions = [
    'King-size bed', 'Private bathroom', 'Hot shower', 'Air conditioning',
    'Heating', 'Wi-Fi', 'Mini fridge', 'Coffee maker', 'Terrace',
    'Fire pit', 'BBQ grill', 'Kitchenette', 'Smart TV', 'Sound system',
    'Towels & linens', 'Toiletries', 'Hair dryer', 'Safe box',
  ]

  useEffect(() => {
    const fetchGlamp = async () => {
      try {
        setIsLoading(true)
        const id = Array.isArray(params.id) ? params.id[0] : params.id
        const response = await getGlampById(id)
        // Handle both 'data' (standard) and 'glamp' (legacy/potential backend variance)
        const glampData = response.data || (response as any).glamp
        if (response.success && glampData) {
          const g = glampData
          setFormData({
            name: g.name,
            category: g.category || '',
            description: g.description,
            price: String(g.pricePerNight || 0),
            capacity: g.capacity,
            bedrooms: g.bedrooms || 1,
            bathrooms: g.bathrooms || 1,
            area: g.area || '',
            amenities: g.amenities || [],
            images: g.images || [],
            status: g.status || 'available',
            discountEnabled: g.discountEnabled || false,
            discountPercent: g.discountPercent || 0,
          })
        } else {
          setError('Failed to load glamp details')
        }
      } catch (err) {
        console.error('Error fetching glamp:', err)
        setError('An error occurred while fetching glamp details')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchGlamp()
    }
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked
        setFormData(prev => ({ ...prev, [name]: checked }))
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
    setError(null)
    
    try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id
        const payload = {
            ...formData,
            price: Number(formData.price),
            capacity: Number(formData.capacity),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            discountPercent: Number(formData.discountPercent),
            status: formData.status as 'available' | 'unavailable' | 'maintenance'
        }
        
        const response = await updateGlamp(id, payload)
        if (response.success) {
            alert('Glamp updated successfully!')
            router.push('/admin/glamps')
        } else {
            setError(response.message || 'Failed to update glamp')
        }
    } catch (err) {
        console.error('Update failed:', err)
        setError('An error occurred while updating')
    }
  }

  const handleDelete = () => {
    // Delete not implemented yet in this phase
    alert('Delete functionality coming soon')
    setShowDeleteDialog(false)
  }

  if (isLoading) {
      return <div className="p-8 text-center">Loading...</div>
  }

  if (error) {
      return <div className="p-8 text-center text-red-500">{error}</div>
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
              {/* Image preview logic simplified for now */}
              {[1, 2, 3, 4].map((img) => (
                <div key={img} className="relative aspect-square bg-cream rounded-lg overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow transition-smooth">
              <p className="text-text-dark font-medium mb-1">Add more images</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 space-y-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
            
            {/* Discount Settings - NEW SECTION */}
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
                        {formData.discountEnabled && (
                            <p className="text-xs text-green mt-1">
                                Final Price: ${(Number(formData.price) * (1 - Number(formData.discountPercent) / 100)).toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

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

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200 space-y-3">
              <button
                type="submit"
                className="w-full bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
              >
                Update Glamp
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
              Are you sure you want to delete <strong>{formData.name}</strong>? This action cannot be undone.
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
