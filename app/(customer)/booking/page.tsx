'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '../../components/Button'
// import { glamps } from '../../data/glamps' // Removed static import
import { createBooking, type BookingPayload } from '@/src/services/bookings.api'
import { getGlamps, type Glamp } from '@/src/services/glamps.api'

export const dynamic = 'force-dynamic'

function BookingPageContent() {
  console.log(
    '[BookingPage] NEXT_PUBLIC_API_URL =',
    process.env.NEXT_PUBLIC_API_URL
  )

  const router = useRouter()
  const searchParams = useSearchParams()

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [isLoadingGlamps, setIsLoadingGlamps] = useState(true)
  const [glamps, setGlamps] = useState<Glamp[]>([])

  // Fetch glamps from API
  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        setIsLoadingGlamps(true)
        const response = await getGlamps()
        if (response.success && Array.isArray(response.data)) {
          setGlamps(response.data)
          console.log('[BookingPage] Loaded glamps from API:', response.data)
        } else {
          console.error('[BookingPage] Failed to load glamps:', response)
          setError('Failed to load accommodation options.')
        }
      } catch (err) {
        console.error('[BookingPage] Error fetching glamps:', err)
        setError('Failed to load accommodation options.')
      } finally {
        setIsLoadingGlamps(false)
      }
    }
    fetchGlamps()
  }, [])

  const [formData, setFormData] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '2'),
    numberOfGlamps: parseInt(searchParams.get('numberOfGlamps') || '1'),
    glampType: searchParams.get('glampType') || '',

    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    specialRequests: '',
    arrivalTime: '',
  })

  const [selectedGlampIds, setSelectedGlampIds] = useState<string[]>([])
  const [nights, setNights] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Initialize selected glamps from URL params
  useEffect(() => {
    const glampId = searchParams.get('glampId')
    if (glampId) {
      console.log('[BookingPage] Found glampId in URL:', glampId)
      // Only set if we haven't selected anything yet
      if (selectedGlampIds.length === 0) {
        setSelectedGlampIds([glampId])
      }
    }
  }, [searchParams])

  // ===============================
  // 🔧 STEP 1 — STORE REAL GLAMP ID
  // ===============================//
  useEffect(() => {
    console.log('[BookingPage] selected glampIds', selectedGlampIds)
  }, [selectedGlampIds])

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays)
    }
  }, [formData.checkIn, formData.checkOut])

  useEffect(() => {
    if (nights > 0) {
      const perGlampTotals = selectedGlampIds.map((id) => {
        const g = glamps.find((x) => String(x.id || x._id) === String(id))
        // pricePerNight is the standard field on Glamp type.
        // Fallback to 25000 if not present.
        const pricePerNight = (g && (g.pricePerNight || 25000)) as number
        const numericPrice =
          typeof pricePerNight === 'string'
            ? 25000
            : (pricePerNight as number)
        return (numericPrice || 25000)
      })
      const sumPerNight = perGlampTotals.reduce((acc, n) => acc + n, 0)
      const total = sumPerNight * nights
      setTotalPrice(total)
      console.log('[BookingPage] Price calculated (multi):', { nights, perNightSum: sumPerNight, total })
    } else {
      setTotalPrice(0)
    }
  }, [selectedGlampIds, nights, glamps])

  const maxGuests = (Number(formData.numberOfGlamps) || 1) * 4
  const isGuestLimitExceeded = Number(formData.guests) > maxGuests
  const selectedCount = selectedGlampIds.length
  const numberOfGlamps = Number(formData.numberOfGlamps) || 1

  const handleAvailabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isGuestLimitExceeded) {
      setError(`Each glamp accommodates max 4 guests. With ${formData.numberOfGlamps} glamps you can book up to ${maxGuests} guests.`)
      return
    }
    if (selectedCount !== numberOfGlamps) {
      setError(`Please select exactly ${numberOfGlamps} glamp(s). Currently selected: ${selectedCount}.`)
      return
    }
    if (selectedCount > 4) {
      setError('You can select up to 4 glamps.')
      return
    }
    console.log('[BookingPage] numberOfGlamps', numberOfGlamps, 'guests', formData.guests, 'max', selectedCount * 4)
    setError(null)
    setCurrentStep(2)
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCurrentStep(3)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
    setToast(null)
  }

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4500)
  }

  const formatDateRangeShort = (startISO: string, endISO: string) => {
    if (!startISO || !endISO) return ''
    const start = new Date(startISO)
    const end = new Date(endISO)
    const startMonth = start.toLocaleString('en-US', { month: 'short' })
    const startDay = start.getDate()
    const endMonth = end.toLocaleString('en-US', { month: 'short' })
    const endDay = end.getDate()
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}–${endDay}`
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}`
  }

  // ==================================================
  // 🔧 STEP 2 — FIX CREATE BOOKING PAYLOAD (MANUAL)
  // ==================================================
  const handleManualBooking = async () => {
    setIsSubmitting(true)
    setError(null)

    const selectedCount = selectedGlampIds.length
    const requestedCount = Number(formData.numberOfGlamps) || 0

    if (!selectedCount) {
      setError('Please select at least 1 glamp.')
      setIsSubmitting(false)
      return
    }
    if (selectedCount !== requestedCount) {
      setError(`Please select exactly ${requestedCount} glamp(s). Currently selected: ${selectedCount}.`)
      setIsSubmitting(false)
      return
    }

    const basePayload = {
      glampIds: selectedGlampIds,
      numberOfGlamps: selectedCount,
      checkInDate: formData.checkIn,
      checkOutDate: formData.checkOut,
      guests: Number(formData.guests),
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerPhone: formData.phone,
    }
    const payload: BookingPayload =
      formData.email && formData.email.trim()
        ? { ...basePayload, customerEmail: formData.email.trim() }
        : basePayload

    console.log('[BookingPage] FINAL submit payload', payload)

    // Validate payload glampIds
    if (!payload.glampIds.every(id => typeof id === 'string' && id.length > 5 && !['1', '2', '3', '4', '5'].includes(id))) {
      console.warn('[BookingPage] WARNING: glampIds contain suspicious values (likely static IDs):', payload.glampIds)
    }

    const response = await createBooking(payload)

    if (response.success) {
      router.push(`/booking/confirmation/${response.booking.id}`)
    } else {
      // STRICT CHECK: Only show availability toast if backend explicitly reports it
      if (
        response.error === 'One or more selected glamps not available' &&
        Array.isArray(response.details) &&
        response.details.length > 0
      ) {
        const firstSelectedId = selectedGlampIds[0]
      const selectedGlamp = glamps.find(g => g.id === firstSelectedId || g._id === firstSelectedId)
      const glampName = selectedGlamp?.name || 'Selected glamp'
        const range = formatDateRangeShort(formData.checkIn, formData.checkOut)
        
        const msg = `${glampName} is already booked for ${range}. Please choose different dates.`
        showToast(msg, 'error')
      } else {
        // Fallback for other errors
        setError(response.error || 'Failed to create booking. Please try again.')
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
     
      <section className="relative h-64 flex items-center justify-center bg-green">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920')",
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mb-4">
            Complete Your Booking
          </h1>
          <p className="text-xl text-cream/90 max-w-2xl mx-auto">
            You&apos;re just a few steps away from your perfect getaway
          </p>
        </div>
      </section>
 
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-green text-cream' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-green' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-green text-cream' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-green' : 'bg-gray-300'}`}></div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-green text-cream' : 'bg-gray-300 text-gray-600'}`}>
              3
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-sm ${currentStep >= 1 ? 'text-green font-semibold' : 'text-gray-600'}`}>Check Availability</span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-green font-semibold' : 'text-gray-600'}`}>Guest Details</span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-green font-semibold' : 'text-gray-600'}`}>Payment</span>
          </div>
        </div>
      </section>

      {error && (
        <section className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-green text-white' 
            : toast.type === 'warning'
            ? 'bg-orange-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : toast.type === 'warning' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-8">

              {currentStep === 1 && (
                <form onSubmit={handleAvailabilitySubmit}>
                  <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <h2 className="font-serif text-3xl font-bold text-green mb-6">Check Availability</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Number of Glamps *
                        </label>
                        <select
                          name="numberOfGlamps"
                          value={formData.numberOfGlamps}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        >
                          {[1, 2, 3, 4].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Check-in Date *
                        </label>
                        <input
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Check-out Date *
                        </label>
                        <input
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Number of Guests *
                        </label>
                        <select
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent ${
                            isGuestLimitExceeded ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                          disabled={isSubmitting}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <p className={`text-xs mt-1 ${isGuestLimitExceeded ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                          Max guests allowed: {maxGuests} (4 per glamp)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Choose Glamps *
                        </label>
                        <div className="space-y-2">
                          {isLoadingGlamps && <p className="text-sm text-text-light">Loading accommodations...</p>}
                          {!isLoadingGlamps && glamps.map((glamp) => {
                            // Use glamp.id (or glamp._id) which should be the UUID
                            const glampId = glamp.id || glamp._id
                            const checked = selectedGlampIds.includes(String(glampId))
                            const disableNewSelection =
                              !checked && (selectedCount >= numberOfGlamps || selectedCount >= 4)
                            return (
                              <label key={glampId} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={isSubmitting || disableNewSelection}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked
                                    setError(null)
                                    setToast(null)
                                    setSelectedGlampIds((prev) => {
                                      if (isChecked) {
                                        if (prev.length >= 4) {
                                          setError('You can select up to 4 glamps.')
                                          return prev
                                        }
                                        if (prev.length >= numberOfGlamps) {
                                          setError(`You can select ${numberOfGlamps} glamp(s) for this booking.`)
                                          return prev
                                        }
                                        return [...prev, String(glampId)]
                                      } else {
                                        return prev.filter((id) => String(id) !== String(glampId))
                                      }
                                    })
                                  }}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm">{glamp.name}</span>
                              </label>
                            )
                          })}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Selected {selectedCount} of {numberOfGlamps} allowed
                        </p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        className="w-full"
                        disabled={isSubmitting || isGuestLimitExceeded || selectedCount !== numberOfGlamps || selectedCount > 4}
                      >
                        Continue to Guest Details
                      </Button>
                    </div>
                  </div>
                </form>
              )}


              {currentStep === 2 && (
                <form onSubmit={handleDetailsSubmit}>
                  <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <h2 className="font-serif text-2xl font-bold text-green mb-6">Guest Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                          placeholder="+92 300 1234567"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Estimated Arrival Time
                        </label>
                        <select
                          name="arrivalTime"
                          value={formData.arrivalTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          disabled={isSubmitting}
                        >
                          <option value="">Select arrival time</option>
                          <option value="3pm-4pm">3:00 PM - 4:00 PM</option>
                          <option value="4pm-5pm">4:00 PM - 5:00 PM</option>
                          <option value="5pm-6pm">5:00 PM - 6:00 PM</option>
                          <option value="6pm-7pm">6:00 PM - 7:00 PM</option>
                          <option value="7pm-8pm">7:00 PM - 8:00 PM</option>
                          <option value="after-8pm">After 8:00 PM</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Special Requests
                        </label>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          placeholder="Any special requirements or dietary preferences..."
                          disabled={isSubmitting}
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="large"
                        className="flex-1"
                        onClick={() => setCurrentStep(1)}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                      <Button type="submit" variant="primary" size="large" className="flex-1" disabled={isSubmitting}>
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 3: Booking Confirmation & Payment Instructions */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                  <h2 className="font-serif text-2xl font-bold text-green mb-6">Booking Confirmation & Payment Instructions</h2>

                  <div className="space-y-6">
                    <div className="bg-cream rounded-lg p-4">
                      <p className="text-text-dark">
                        For confirmed 🌟 booking kindly send 50% advance payment.
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green mb-2">Company Account</h3>
                      <div className="space-y-1 text-sm text-text-dark">
                        <p><span className="font-medium">Title:</span> MADNESS</p>
                        <p><span className="font-medium">Bank Name:</span> Bank Islami</p>
                        <p><span className="font-medium">Account No.:</span> 204600061300001</p>
                        <p><span className="font-medium">IBAN:</span> PK36BKIP0204600061300001</p>
                      </div>
                    </div>

                    <div className="text-center text-text-light">OR</div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green mb-2">EasyPaisa</h3>
                      <div className="space-y-1 text-sm text-text-dark">
                        <p><span className="font-medium">Number:</span> 03235521558</p>
                        <p><span className="font-medium">Name:</span> Salahuddin Aziz</p>
                      </div>
                    </div>

                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                      <p className="text-text-dark font-semibold">
                        Total Amount: PKR {totalPrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-text-light">
                        You’ll receive confirmation and payment instructions via WhatsApp/SMS from our team.
                      </p>
                    </div>

                    <Button
                      onClick={handleManualBooking}
                      disabled={
                        isSubmitting ||
                        selectedGlampIds.length === 0 ||
                        selectedGlampIds.length !== Number(formData.numberOfGlamps || 0)
                      }
                      variant="primary"
                      size="large"
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Booking Request
                    </Button>
                  </div>

                  <div className="mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      size="large"
                      className="w-full"
                      onClick={() => setCurrentStep(2)}
                      disabled={isSubmitting}
                    >
                      Back to Guest Details
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6">
                <h2 className="font-serif text-2xl font-bold text-green mb-6">Booking Summary</h2>

                {selectedGlampIds.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-semibold text-text-dark mb-2">
                        {selectedGlampIds.length} {selectedGlampIds.length === 1 ? 'Glamp' : 'Glamps'} selected
                      </h3>
                      <p className="text-sm text-text-light">{formData.guests} guests</p>
                    </div>

                    {formData.checkIn && formData.checkOut && (
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-light">Check-in</span>
                          <span className="text-text-dark">{new Date(formData.checkIn).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-light">Check-out</span>
                          <span className="text-text-dark">{new Date(formData.checkOut).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-light">Duration</span>
                          <span className="text-text-dark">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-light">
                          {selectedGlampIds.length} glamp{selectedGlampIds.length > 1 ? 's' : ''} x PKR {25000 .toLocaleString()} per night
                        </span>
                        <span className="text-text-dark">
                          PKR {(selectedGlampIds.length * 25000).toLocaleString()}/night
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-light">Nights</span>
                        <span className="text-text-dark">{nights}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-xl font-bold text-green">Total</span>
                        <span className="font-serif text-3xl font-bold text-green">PKR {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-cream rounded-lg p-4">
                      <p className="text-xs text-text-dark text-center">
                        All glamps are priced at approximately PKR 25,000 per night and include breakfast, parking, and room service.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-text-light py-8">
                    <p>Please select glamps to see pricing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
          <p className="text-text-light">Loading booking form...</p>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  )
}