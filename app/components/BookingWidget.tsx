'use client'

import { useState } from 'react'
import Button from './Button'

export default function BookingWidget() {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    glampType: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to booking page with query params
    const params = new URLSearchParams({
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests.toString(),
      glampType: formData.glampType,
    })
    window.location.href = `/booking?${params.toString()}`
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="font-serif text-2xl font-bold text-green mb-6">Book Your Stay</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            value={formData.checkIn}
            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Check-out Date
          </label>
          <input
            type="date"
            value={formData.checkOut}
            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Number of Guests
          </label>
          <select
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Glamp Type
          </label>
          <select
            value={formData.glampType}
            onChange={(e) => setFormData({ ...formData, glampType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            required
          >
            <option value="">Select a type</option>
            <option value="luxury-tent">Luxury Safari Tent</option>
            <option value="dome">Geodesic Dome</option>
            <option value="treehouse">Treehouse Suite</option>
            <option value="cabin">Woodland Cabin</option>
          </select>
        </div>

        <Button type="submit" variant="primary" size="large" className="w-full">
          Check Availability
        </Button>
      </form>
    </div>
  )
}
