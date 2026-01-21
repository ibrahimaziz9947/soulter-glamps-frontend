'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/src/services/apiClient'
import { checkAvailability } from '@/src/services/bookings.api'

type Glamp = {
  id: string
  name: string
  pricePerNight: number
}

export default function AddBooking() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [glamps, setGlamps] = useState<Glamp[]>([])
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const availabilityRequestId = useRef(0)

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    glampId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  })

  // Fetch glamps
  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        const res = await api.get('/glamps')
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? []
        setGlamps(list)
      } catch {
        setError('Unable to load glamping options')
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
      console.log('[Agent Add Booking] Invalid dates: checkOut must be after checkIn', { checkIn, checkOut })
      setIsAvailable(true)
      setAvailabilityChecked(false)
      return
    }

    // Log the dates being checked
    console.log('[Agent Add Booking] Checking availability with dates:', {
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
        console.log('[Agent Add Booking] Ignoring stale availability response')
        return
      }
      
      if (result.success) {
        const available = result.available ?? false
        console.log('[Agent Add Booking] Availability result:', { available, result })
        
        setIsAvailable(available)
        setAvailabilityChecked(true)
        
        // Only show toast if NOT available
        if (!available) {
          setToast({ message: 'Not available for selected dates', type: 'error' })
        }
      } else {
        // Handle 400 or other errors - treat as validation issue, not unavailability
        console.error('[Agent Add Booking] Availability check failed:', result.error)
        // Don't block on availability check failure (might be 400 validation error)
        setIsAvailable(true)
        setAvailabilityChecked(false)
        
        // Show validation error toast if it's a 400-type error
        if (result.error && result.error.includes('date')) {
          setToast({ message: result.error, type: 'error' })
        }
      }
    } catch (error) {
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

  // Submit booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select both check-in and check-out dates')
      return
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('Check-out date must be after check-in date')
      return
    }

    try {
      setLoading(true)

      await api.post('/agent/bookings', {
        customerName: formData.customerName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        glampId: formData.glampId,
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
        guests: formData.guests,
      })

      setToast({ message: 'Booking created successfully!', type: 'success' })
      setTimeout(() => router.push('/agent/bookings'), 500)
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create booking'
      setToast({ message: errorMessage, type: 'error' })
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
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

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-900">Add New Booking</h1>
        <p className="text-gray-600">Create a booking for your customer</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            required
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <input
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <input
            required
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="md:col-span-2 w-full px-4 py-3 border rounded-lg"
          />
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Glamp Selection *</label>
            <select
              required
              value={formData.glampId}
              onChange={e => setFormData({ ...formData, glampId: e.target.value })}
              className="w-full px-4 py-3 border-2 rounded-lg"
            >
              <option value="">Choose a glamp</option>
              {glamps.map(glamp => (
                <option key={glamp.id} value={glamp.id}>
                  {glamp.name} – PKR {glamp.pricePerNight.toLocaleString()}/night
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Check-in Date *</label>
              <input
                type="date"
                required
                value={formData.checkIn}
                onChange={e => {
                  const newCheckIn = e.target.value
                  // Clear availability state
                  setIsAvailable(true)
                  setAvailabilityChecked(false)
                  
                  // Auto-adjust checkOut if needed
                  if (formData.checkOut && newCheckIn) {
                    const checkInDate = new Date(newCheckIn)
                    const checkOutDate = new Date(formData.checkOut)
                    if (checkOutDate <= checkInDate) {
                      const nextDay = new Date(checkInDate)
                      nextDay.setDate(nextDay.getDate() + 1)
                      setFormData({ ...formData, checkIn: newCheckIn, checkOut: nextDay.toISOString().split('T')[0] })
                      console.log('[Agent Add Booking] Auto-adjusted checkOut')
                      return
                    }
                  }
                  setFormData({ ...formData, checkIn: newCheckIn })
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Check-out Date *</label>
              <input
                type="date"
                required
                value={formData.checkOut}
                onChange={e => {
                  // Clear availability state
                  setIsAvailable(true)
                  setAvailabilityChecked(false)
                  setFormData({ ...formData, checkOut: e.target.value })
                }}
                min={formData.checkIn ? (() => {
                  const minDate = new Date(formData.checkIn)
                  minDate.setDate(minDate.getDate() + 1)
                  return minDate.toISOString().split('T')[0]
                })() : new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Number of Guests *</label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={formData.guests}
              onChange={e => setFormData({ ...formData, guests: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 rounded-lg"
            />
          </div>
        </div>

        {/* Availability Status & Submit */}
        <div className="space-y-3 pt-4 border-t">
          {checkingAvailability && (
            <div className="text-center text-sm text-gray-600 py-2">Checking availability...</div>
          )}
          {availabilityChecked && !isAvailable && (
            <div className="text-center text-sm text-red-600 font-medium py-2 bg-red-50 rounded-lg">
              ⚠️ Selected dates are not available
            </div>
          )}
          <button
            type="submit"
            disabled={loading || checkingAvailability || (availabilityChecked && !isAvailable)}
            className="w-full px-8 py-3 bg-green-800 text-white rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}
