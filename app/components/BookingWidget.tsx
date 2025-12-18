'use client'

import { useState } from 'react'
import Button from './Button'
import { createBooking, type BookingPayload } from '@/src/services/bookings.api'

interface BookingWidgetProps {
  glampId: string
  glampName?: string
}

export default function BookingWidget({ glampId, glampName }: BookingWidgetProps) {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 2,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [bookingReference, setBookingReference] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.checkInDate || formData.checkInDate.trim() === '') {
      newErrors.checkInDate = 'Check-in date is required'
    }

    if (!formData.checkOutDate || formData.checkOutDate.trim() === '') {
      newErrors.checkOutDate = 'Check-out date is required'
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Check-out must be after check-in'
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (checkIn < today) {
        newErrors.checkInDate = 'Check-in date cannot be in the past'
      }
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required'
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format'
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous messages
    setSuccessMessage(null)
    setErrorMessage(null)
    setBookingReference(null)

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      const payload: BookingPayload = {
        glampId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.guests,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
      }

      console.log('[BookingWidget] Creating booking with payload:', payload)
      console.log('[BookingWidget] Dates verification:', {
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        checkInType: typeof formData.checkInDate,
        checkOutType: typeof formData.checkOutDate,
        checkInLength: formData.checkInDate.length,
        checkOutLength: formData.checkOutDate.length
      })

      const response = await createBooking(payload)
      
      const bookingId = response?.booking?.id
      
      if (bookingId) {
        // Redirect to confirmation page
        window.location.href = `/booking/confirmation/${bookingId}`
      } else {
        setSuccessMessage('Booking created successfully!')
        setBookingReference(bookingId || 'N/A')
      }

    } catch (err: any) {
      console.error('[BookingWidget] Booking failed:', err)
      setErrorMessage(err.message || 'Failed to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName = (fieldName: string) => 
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent ${
      errors[fieldName] ? 'border-red-500' : 'border-gray-300'
    }`

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-2xl font-bold text-green">Book Your Stay</h3>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold text-green">{successMessage}</p>
              {bookingReference && (
                <p className="text-sm text-green-700 mt-1">
                  Booking Reference: <span className="font-mono">{bookingReference}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            value={formData.checkInDate}
            onChange={(e) => {
              setFormData({ ...formData, checkInDate: e.target.value })
              setErrors({ ...errors, checkInDate: '' })
            }}
            className={inputClassName('checkInDate')}
            disabled={isSubmitting}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.checkInDate && (
            <p className="text-red-500 text-xs mt-1">{errors.checkInDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Check-out Date
          </label>
          <input
            type="date"
            value={formData.checkOutDate}
            onChange={(e) => {
              setFormData({ ...formData, checkOutDate: e.target.value })
              setErrors({ ...errors, checkOutDate: '' })
            }}
            className={inputClassName('checkOutDate')}
            disabled={isSubmitting}
            min={formData.checkInDate || new Date().toISOString().split('T')[0]}
          />
          {errors.checkOutDate && (
            <p className="text-red-500 text-xs mt-1">{errors.checkOutDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Number of Guests
          </label>
          <select
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
            className={inputClassName('guests')}
            disabled={isSubmitting}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-text-dark mb-4">Your Information</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => {
                  setFormData({ ...formData, customerName: e.target.value })
                  setErrors({ ...errors, customerName: '' })
                }}
                className={inputClassName('customerName')}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => {
                  setFormData({ ...formData, customerEmail: e.target.value })
                  setErrors({ ...errors, customerEmail: '' })
                }}
                className={inputClassName('customerEmail')}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
              {errors.customerEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => {
                  setFormData({ ...formData, customerPhone: e.target.value })
                  setErrors({ ...errors, customerPhone: '' })
                }}
                className={inputClassName('customerPhone')}
                placeholder="+92 300 1234567"
                disabled={isSubmitting}
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>
              )}
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="large" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Booking...
            </span>
          ) : (
            'Confirm Booking'
          )}
        </Button>

        <p className="text-xs text-text-light text-center">
          By booking, you agree to our terms and conditions
        </p>
      </form>
    </div>
  )
}
