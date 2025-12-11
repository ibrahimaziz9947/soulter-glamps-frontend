'use client'

import { useState } from 'react'

export default function AddBooking() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    glamping: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    addOns: [],
    specialRequests: '',
  })

  const glampingOptions = [
    { id: 1, name: 'Luxury Tent', price: 12500 },
    { id: 2, name: 'Tree House', price: 16000 },
    { id: 3, name: 'Safari Tent', price: 14000 },
    { id: 4, name: 'Dome Tent', price: 15000 },
    { id: 5, name: 'Cabin', price: 17500 },
  ]

  const addOnOptions = [
    { id: 'bbq', name: 'BBQ Setup', price: 3500 },
    { id: 'bonfire', name: 'Bonfire Night', price: 2500 },
    { id: 'breakfast', name: 'Continental Breakfast', price: 1500 },
    { id: 'guide', name: 'Nature Guide', price: 4000 },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Booking created successfully! (UI placeholder - no backend)')
    console.log('Booking Data:', formData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green mb-2">Add New Booking</h1>
        <p className="text-text-light">Create a booking for your customer</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Customer Information */}
        <div>
          <h2 className="text-xl font-bold text-green mb-4 pb-2 border-b-2 border-green/20">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all"
                placeholder="Enter customer full name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all"
                placeholder="0300-1234567"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-dark mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all"
                placeholder="customer@example.com"
              />
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div>
          <h2 className="text-xl font-bold text-green mb-4 pb-2 border-b-2 border-green/20">Booking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-dark mb-2">
                Glamp Selection <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.glamping}
                onChange={(e) => setFormData({...formData, glamping: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all"
              >
                <option value="">Choose a glamping option</option>
                {glampingOptions.map(option => (
                  <option key={option.id} value={option.name}>
                    {option.name} - PKR {option.price.toLocaleString()}/night
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Check-In Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.checkIn}
                onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Check-Out Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.checkOut}
                onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-8 py-3 border-2 border-gray-300 text-text-dark rounded-lg font-bold hover:bg-gray-50 transition-smooth"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-green text-white rounded-lg font-bold hover:bg-green-dark transition-smooth shadow-lg hover:shadow-xl"
          >
            Create Booking
          </button>
        </div>
      </form>
    </div>
  )
}
