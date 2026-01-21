'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getGlamps, type Glamp } from '@/src/services/glamps.api'
import { createBooking, checkAvailability } from '@/src/services/bookings.api'

export default function AddBookingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [glamps, setGlamps] = useState<Glamp[]>([])
  const [loadingGlamps, setLoadingGlamps] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const availabilityRequestId = useRef(0)
  
  const [formData, setFormData] = useState({
    glampId: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
    addOns: [] as string[],
  })

  // Fetch glamps on mount
  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        setLoadingGlamps(true)
        const response = await getGlamps()
        setGlamps(response.data || [])
        console.log('[Add Booking] Glamps loaded:', response.data?.length || 0)
      } catch (error: any) {
        console.error('[Add Booking] Failed to load glamps:', error)
        setToast({ message: 'Failed to load accommodations', type: 'error' })
      } finally {
        setLoadingGlamps(false)
      }
    }

    fetchGlamps()
  }, [])

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Debounced availability check
  const checkDatesAvailability = useCallback(async (glampId: string, checkIn: string, checkOut: string) => {
    // Validate all required fields exist
    if (!glampId || !checkIn || !checkOut) {
      setIsAvailable(true)
      setAvailabilityChecked(false)
      return
    }

    // Validate checkOut is after checkIn (prevent invalid API calls)
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    if (checkOutDate <= checkInDate) {
      console.log('[Add Booking] Invalid dates: checkOut must be after checkIn', { checkIn, checkOut })
      setIsAvailable(true)
      setAvailabilityChecked(false)
      return
    }

    // Log the dates being checked
    console.log('[Add Booking] Checking availability with dates:', {
      glampId,
      checkIn,
      checkOut,
      nights: Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    })

    // Increment request ID to track latest request
    availabilityRequestId.current += 1
    const currentRequestId = availabilityRequestId.current

    // Reset state before checking
    setIsAvailable(true)
    setCheckingAvailability(true)
    setAvailabilityChecked(false)

    try {
      const result = await checkAvailability(glampId, checkIn, checkOut)
      
      // Ignore stale responses
      if (currentRequestId !== availabilityRequestId.current) {
        console.log('[Add Booking] Ignoring stale availability response')
        return
      }
      
      if (result.success) {
        const available = result.available ?? false
        console.log('[Add Booking] Availability result:', { available, result })
        
        setIsAvailable(available)
        setAvailabilityChecked(true)
        
        // Only show toast if NOT available
        if (!available) {
          setToast({ 
            message: 'Not available for selected dates', 
            type: 'error' 
          })
        }
      } else {
        // Handle 400 or other errors - treat as validation issue, not unavailability
        console.error('[Add Booking] Availability check failed:', result.error)
        // Don't block on availability check failure (might be 400 validation error)
        setIsAvailable(true)
        setAvailabilityChecked(false)
        
        // Show validation error toast if it's a 400-type error
        if (result.error && result.error.includes('date')) {
          setToast({ 
            message: result.error, 
            type: 'error' 
          })
        }
      }
    } catch (error) {
      console.error('[Add Booking] Availability check error:', error)
      setIsAvailable(true)
      setAvailabilityChecked(false)
    } finally {
      // Only update if still the latest request
      if (currentRequestId === availabilityRequestId.current) {
        setCheckingAvailability(false)
      }
    }
  }, [])

  // Debounced effect for availability check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.glampId && formData.checkIn && formData.checkOut) {
        checkDatesAvailability(formData.glampId, formData.checkIn, formData.checkOut)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [formData.glampId, formData.checkIn, formData.checkOut, checkDatesAvailability])

  const addOnsOptions = [
    { id: 'breakfast', name: 'Daily Breakfast', price: 25 },
    { id: 'airport', name: 'Airport Pickup', price: 50 },
    { id: 'hiking', name: 'Guided Hiking Tour', price: 75 },
    { id: 'spa', name: 'Spa Package', price: 100 },
    { id: 'bbq', name: 'Private BBQ Setup', price: 60 },
    { id: 'photography', name: 'Photography Session', price: 150 },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Custom handler for check-in date changes
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value
    
    // Clear availability state when date changes
    setIsAvailable(true)
    setAvailabilityChecked(false)
    
    setFormData(prev => {
      const updates: any = { checkIn: newCheckIn }
      
      // If checkOut exists and is <= new checkIn, auto-adjust checkOut to checkIn + 1 day
      if (prev.checkOut && newCheckIn) {
        const checkInDate = new Date(newCheckIn)
        const checkOutDate = new Date(prev.checkOut)
        
        if (checkOutDate <= checkInDate) {
          const nextDay = new Date(checkInDate)
          nextDay.setDate(nextDay.getDate() + 1)
          updates.checkOut = nextDay.toISOString().split('T')[0]
          console.log('[Add Booking] Auto-adjusted checkOut to:', updates.checkOut)
        }
      }
      
      return { ...prev, ...updates }
    })
  }

  // Custom handler for check-out date changes
  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckOut = e.target.value
    
    // Clear availability state when date changes
    setIsAvailable(true)
    setAvailabilityChecked(false)
    
    setFormData(prev => ({ ...prev, checkOut: newCheckOut }))
  }

  const handleAddOnToggle = (addOnId: string) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }))
  }

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.glampId) return 0
    
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    const selectedGlamp = glamps.find(g => (g._id || g.id) === formData.glampId)
    const basePrice = selectedGlamp ? selectedGlamp.pricePerNight * nights : 0
    
    const addOnsTotal = formData.addOns.reduce((sum, addOnId) => {
      const addOn = addOnsOptions.find(a => a.id === addOnId)
      return sum + (addOn ? addOn.price : 0)
    }, 0)
    
    return basePrice + addOnsTotal
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.glampId) {
      setToast({ message: 'Please select an accommodation', type: 'error' })
      return
    }
    if (!formData.checkIn || !formData.checkOut) {
      setToast({ message: 'Please select check-in and check-out dates', type: 'error' })
      return
    }
    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone) {
      setToast({ message: 'Please fill in all guest information', type: 'error' })
      return
    }

    try {
      setIsSubmitting(true)
      
      const payload = {
        glampId: formData.glampId,
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
        guests: formData.guests,
        customerName: formData.guestName,
        customerEmail: formData.guestEmail,
        customerPhone: formData.guestPhone,
        specialRequests: formData.specialRequests || undefined,
        addOns: formData.addOns.length > 0 ? formData.addOns : undefined,
      }

      console.log('[Add Booking] Submitting:', payload)

      const response = await createBooking(payload)

      if (response.success) {
        setToast({ message: 'Booking created successfully!', type: 'success' })
        
        setTimeout(() => {
          router.push('/admin/bookings')
        }, 500)
      } else {
        // Handle 409 or other errors
        const errorMessage = response.error || 'Failed to create booking'
        setToast({ 
          message: errorMessage, 
          type: 'error' 
        })
        // Don't redirect, keep form values
        setIsSubmitting(false)
      }
    } catch (error: any) {
      console.error('[Add Booking] Failed:', error)
      setToast({ 
        message: error.message || 'Failed to create booking', 
        type: 'error' 
      })
      setIsSubmitting(false)
    }
  }

  const nights = formData.checkIn && formData.checkOut 
    ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const selectedGlamp = glamps.find(g => (g._id || g.id) === formData.glampId)

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
                {loadingGlamps ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-text-light">
                    Loading accommodations...
                  </div>
                ) : (
                  <select
                    name="glampId"
                    value={formData.glampId}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select accommodation...</option>
                    {glamps.map(glamp => (
                      <option key={glamp._id || glamp.id} value={glamp._id || glamp.id}>
                        {glamp.name} - PKR {glamp.pricePerNight}/night
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleCheckInChange}
                  required
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
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
                  onChange={handleCheckOutChange}
                  required
                  disabled={isSubmitting}
                  min={formData.checkIn ? (() => {
                    const minDate = new Date(formData.checkIn)
                    minDate.setDate(minDate.getDate() + 1)
                    return minDate.toISOString().split('T')[0]
                  })() : new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
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
                  disabled={isSubmitting}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
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
                  disabled={isSubmitting}
                  placeholder="john@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
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
                  disabled={isSubmitting}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent disabled:bg-gray-50"
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
                  rows={4}
                  disabled={isSubmitting}
                  placeholder="Any special requirements or requests..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent resize-none disabled:bg-gray-50"
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
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.addOns.includes(addOn.id)}
                    onChange={() => !isSubmitting && handleAddOnToggle(addOn.id)}
                    disabled={isSubmitting}
                    className="w-5 h-5 text-yellow focus:ring-yellow rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text-dark">{addOn.name}</p>
                    <p className="text-sm text-green font-semibold">PKR {addOn.price}</p>
                  </div>
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
              {selectedGlamp && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-text-light mb-1">Accommodation</p>
                  <p className="font-medium text-text-dark">{selectedGlamp.name}</p>
                </div>
              )}

              {formData.checkIn && formData.checkOut && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-text-light mb-1">Duration</p>
                  <p className="font-medium text-text-dark">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                  <p className="text-sm text-text-light mt-1">
                    {new Date(formData.checkIn).toLocaleDateString()} to {new Date(formData.checkOut).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-text-light mb-1">Guests</p>
                <p className="font-medium text-text-dark">{formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}</p>
              </div>

              {formData.addOns.length > 0 && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-text-light mb-2">Add-ons</p>
                  {formData.addOns.map(addOnId => {
                    const addOn = addOnsOptions.find(a => a.id === addOnId)
                    return (
                      <div key={addOnId} className="flex justify-between text-sm mb-1">
                        <span className="text-text-dark">{addOn?.name}</span>
                        <span className="text-green font-medium">PKR {addOn?.price}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-xl font-bold text-text-dark">Total</span>
                  <span className="font-serif text-3xl font-bold text-green">PKR {calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {checkingAvailability && (
                <div className="text-center text-sm text-text-light py-2">
                  Checking availability...
                </div>
              )}
              {availabilityChecked && !isAvailable && (
                <div className="text-center text-sm text-red-600 font-medium py-2 bg-red-50 rounded-lg">
                  ⚠️ Selected dates are not available
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || loadingGlamps || checkingAvailability || (availabilityChecked && !isAvailable)}
                className="w-full bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Booking...' : 'Create Booking'}
              </button>
              <Link
                href="/admin/bookings"
                className={`block w-full text-center border-2 border-gray-300 text-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth ${
                  isSubmitting ? 'pointer-events-none opacity-50' : ''
                }`}
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
