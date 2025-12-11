'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddBookingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    glampType: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
    addOns: [],
    paymentStatus: 'pending',
  })

  const glampTypes = [
    { id: 1, name: 'Luxury Safari Tent', price: 250 },
    { id: 2, name: 'Geodesic Dome', price: 300 },
    { id: 3, name: 'Treehouse Suite', price: 350 },
    { id: 4, name: 'Woodland Cabin', price: 200 },
    { id: 5, name: 'Riverside Yurt', price: 180 },
    { id: 6, name: 'Mountain View Pod', price: 220 },
  ]

  const addOnsOptions = [
    { id: 'breakfast', name: 'Daily Breakfast', price: 25 },
    { id: 'airport', name: 'Airport Pickup', price: 50 },
    { id: 'hiking', name: 'Guided Hiking Tour', price: 75 },
    { id: 'spa', name: 'Spa Package', price: 100 },
    { id: 'bbq', name: 'Private BBQ Setup', price: 60 },
    { id: 'photography', name: 'Photography Session', price: 150 },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddOnToggle = (addOnId) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }))
  }

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.glampType) return 0
    
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    
    const selectedGlamp = glampTypes.find(g => g.name === formData.glampType)
    const basePrice = selectedGlamp ? selectedGlamp.price * nights : 0
    
    const addOnsTotal = formData.addOns.reduce((sum, addOnId) => {
      const addOn = addOnsOptions.find(a => a.id === addOnId)
      return sum + (addOn ? addOn.price : 0)
    }, 0)
    
    return basePrice + addOnsTotal
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send to an API
    alert('Booking created successfully!')
    router.push('/admin/bookings')
  }

  const nights = formData.checkIn && formData.checkOut 
    ? Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/bookings"
          className="p-2 hover:bg-cream rounded-lg transition-smooth"
        >
          <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Create New Booking</h1>
          <p className="text-text-light mt-1">Add a new accommodation reservation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Accommodation Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Accommodation Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Glamp Type *
                </label>
                <select
                  name="glampType"
                  value={formData.glampType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                >
                  <option value="">Select accommodation...</option>
                  {glampTypes.map(glamp => (
                    <option key={glamp.id} value={glamp.name}>
                      {glamp.name} - ${glamp.price}/night
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Adults
                </label>
                <input
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Children
                </label>
                <input
                  type="number"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  min="0"
                  max="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Guest Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="guestEmail"
                  value={formData.guestEmail}
                  onChange={handleChange}
                  required
                  placeholder="john@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="guestPhone"
                  value={formData.guestPhone}
                  onChange={handleChange}
                  required
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any special requirements or requests..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Add-ons & Extras</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addOnsOptions.map(addOn => (
                <label
                  key={addOn.id}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-smooth ${
                    formData.addOns.includes(addOn.id)
                      ? 'border-yellow bg-yellow/10'
                      : 'border-gray-200 hover:border-yellow/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.addOns.includes(addOn.id)}
                    onChange={() => handleAddOnToggle(addOn.id)}
                    className="w-5 h-5 text-yellow focus:ring-yellow rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text-dark">{addOn.name}</p>
                    <p className="text-sm text-green font-semibold">${addOn.price}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Payment Status</h2>
            
            <div className="flex gap-4">
              {['pending', 'partial', 'paid'].map(status => (
                <label
                  key={status}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-smooth capitalize ${
                    formData.paymentStatus === status
                      ? 'border-yellow bg-yellow/10'
                      : 'border-gray-200 hover:border-yellow/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentStatus"
                    value={status}
                    checked={formData.paymentStatus === status}
                    onChange={handleChange}
                    className="w-5 h-5 text-yellow focus:ring-yellow"
                  />
                  <span className="font-medium text-text-dark">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Booking Summary</h2>
            
            <div className="space-y-4">
              {formData.glampType && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-text-light mb-1">Accommodation</p>
                  <p className="font-medium text-text-dark">{formData.glampType}</p>
                </div>
              )}

              {formData.checkIn && formData.checkOut && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-text-light mb-1">Duration</p>
                  <p className="font-medium text-text-dark">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                  <p className="text-sm text-text-light mt-1">
                    {formData.checkIn} to {formData.checkOut}
                  </p>
                </div>
              )}

              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-text-light mb-1">Guests</p>
                <p className="font-medium text-text-dark">
                  {formData.adults} {formData.adults === 1 ? 'Adult' : 'Adults'}
                  {formData.children > 0 && `, ${formData.children} ${formData.children === 1 ? 'Child' : 'Children'}`}
                </p>
              </div>

              {formData.addOns.length > 0 && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-text-light mb-2">Add-ons</p>
                  {formData.addOns.map(addOnId => {
                    const addOn = addOnsOptions.find(a => a.id === addOnId)
                    return (
                      <div key={addOnId} className="flex justify-between text-sm mb-1">
                        <span className="text-text-dark">{addOn?.name}</span>
                        <span className="text-green font-medium">${addOn?.price}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-xl font-bold text-text-dark">Total</span>
                  <span className="font-serif text-3xl font-bold text-green">${calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                className="w-full bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
              >
                Create Booking
              </button>
              <Link
                href="/admin/bookings"
                className="block w-full text-center border-2 border-gray-300 text-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
