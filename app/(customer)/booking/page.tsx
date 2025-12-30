/*'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '../../components/Button'
import { glamps } from '../../data/glamps'
import { createBooking, type BookingPayload } from '@/src/services/bookings.api'

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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '2'),
    glampType: searchParams.get('glampType') || '',

    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    specialRequests: '',
    arrivalTime: '',
  })

  const [selectedGlamp, setSelectedGlamp] = useState<any>(null)
  const [nights, setNights] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // ===============================
  // 🔧 STEP 1 — STORE REAL GLAMP ID
  // ===============================//
  useEffect(() => {
    if (formData.glampType) {
      const glamp = glamps.find(g => g.id === formData.glampType)
      setSelectedGlamp(glamp || null)
    }
  }, [formData.glampType])

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
    if (selectedGlamp && nights > 0) {
      const price = 25000 * nights
      setTotalPrice(price)
    }
  }, [selectedGlamp, nights])

  const handleAvailabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
  }

  const handleAdvancePayment = () => {
    setShowPaymentModal(true)
    setError(null)
  }

  // ==================================================
  // 🔧 STEP 2 — FIX CREATE BOOKING PAYLOAD (MANUAL)
  // ==================================================
  const handleManualBooking = async () => {
    setIsSubmitting(true)
    setError(null)

    if (!selectedGlamp?.id) {
      setError('Invalid glamp selection. Please try again.')
      setIsSubmitting(false)
      return
    }

    const payload: BookingPayload = {
      glampId: selectedGlamp.id, // ✅ REAL DATABASE ID
      checkInDate: formData.checkIn,
      checkOutDate: formData.checkOut,
      guests: Number(formData.guests),
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
    }

    console.log('[BookingPage] Selected glamp:', selectedGlamp)
    console.log('[BookingPage] Booking payload:', payload)

    const response = await createBooking(payload)

    if (response.success) {
      router.push(`/booking/confirmation/${response.booking.id}`)
    } else {
      setError(response.error)
      setIsSubmitting(false)
    }
  }

  // ==================================================
  // 🔧 STEP 2 — FIX CREATE BOOKING PAYLOAD (EASYPAISA)
  // ==================================================
  const handleEasyPaisaPayment = async () => {
    setIsSubmitting(true)
    setError(null)

    await new Promise(resolve => setTimeout(resolve, 1500))
    setPaymentSuccess(true)

    if (!selectedGlamp?.id) {
      setError('Invalid glamp selection. Please try again.')
      setIsSubmitting(false)
      return
    }

    const payload: BookingPayload = {
      glampId: selectedGlamp.id, // ✅ REAL DATABASE ID
      checkInDate: formData.checkIn,
      checkOutDate: formData.checkOut,
      guests: Number(formData.guests),
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
    }

    console.log('[BookingPage] Selected glamp:', selectedGlamp)
    console.log('[BookingPage] Booking payload:', payload)

    const response = await createBooking(payload)

    if (response.success) {
      setTimeout(() => {
        router.push(`/booking/confirmation/${response.booking.id}`)
      }, 2000)
    } else {
      setPaymentSuccess(false)
      setShowPaymentModal(false)
      setError(response.error)
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Select Glamp *
                        </label>
                        <select
                          name="glampType"
                          value={formData.glampType}
                          onChange={handleInputChange}
                          value={selectedGlamp?.id || ''}
                          onChange={(e) => {
                            const glamp = glamps.find(g => g.id === e.target.value)
                            setSelectedGlamp(glamp || null)
                            setFormData(prev => ({
                              ...prev,
                              glampType: e.target.value, // ✅ REAL ID ONLY
                            }))
                          }}

                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        >
                          <option value="">Choose your glamp</option>
                          {glamps.map((glamp) => (
                            <option key={glamp.id} value={glamp.id}>
                              {glamp.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button type="submit" variant="primary" size="large" className="w-full" disabled={isSubmitting}>
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
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
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


              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                  <h2 className="font-serif text-2xl font-bold text-green mb-6">Choose Payment Method</h2>

                  <div className="space-y-4">
                    <button
                      onClick={handleAdvancePayment}
                      disabled={isSubmitting}
                      className="w-full p-6 border-2 border-green rounded-lg hover:bg-cream transition-smooth text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-green mb-2">Pay 50% Advance (Recommended)</h3>
                          <p className="text-text-light text-sm mb-3">
                            Secure your booking with a 50% advance payment via EasyPaisa. Pay the remaining amount upon arrival.
                          </p>
                          <div className="bg-yellow/10 border border-yellow rounded-lg p-3">
                            <p className="text-green font-bold">
                              Pay Now: PKR {Math.round(totalPrice * 0.5).toLocaleString()}
                            </p>
                            <p className="text-sm text-text-light">
                              Remaining: PKR {Math.round(totalPrice * 0.5).toLocaleString()} (at check-in)
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleManualBooking}
                      disabled={isSubmitting}
                      className="w-full p-6 border-2 border-gray-300 rounded-lg hover:bg-cream transition-smooth text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-green mb-2">Manual Booking Request</h3>
                          <p className="text-text-light text-sm mb-3">
                            Submit your booking request and our team will contact you to confirm. Payment can be made upon arrival.
                          </p>
                          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                            <p className="text-text-dark font-semibold">
                              Total Amount: PKR {totalPrice.toLocaleString()}
                            </p>
                            <p className="text-sm text-text-light">
                              Payment at check-in
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
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


            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6">
                <h2 className="font-serif text-2xl font-bold text-green mb-6">Booking Summary</h2>

                {selectedGlamp ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-semibold text-text-dark mb-2">{selectedGlamp.name}</h3>
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
                        <span className="text-text-light">PKR 25,000 x {nights} nights</span>
                        <span className="text-text-dark">PKR {(25000 * nights).toLocaleString()}</span>
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
                        All glamps are priced at PKR 25,000 per night and include breakfast, parking, and room service.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-text-light py-8">
                    <p>Please select a glamp to see pricing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-fade-in">
            {!paymentSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-green mb-2">EasyPaisa Payment</h3>
                  <p className="text-text-light text-sm">
                    Pay 50% advance using EasyPaisa to confirm your booking.
                  </p>
                </div>

                <div className="bg-cream rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-text-light">Advance Amount (50%)</span>
                    <span className="font-bold text-green text-xl">PKR {Math.round(totalPrice * 0.5).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-light">Remaining at check-in</span>
                    <span className="text-text-dark">PKR {Math.round(totalPrice * 0.5).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleEasyPaisaPayment}
                    disabled={isSubmitting}
                    className="w-full bg-green text-cream px-6 py-4 rounded-lg font-semibold hover:bg-green/90 transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Pay PKR {Math.round(totalPrice * 0.5).toLocaleString()} Now
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isSubmitting}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-text-light text-center mt-4">
                  This is a demo payment interface. No actual transaction will be processed.
                </p>
              </>
            ) : (
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-green mb-2">Payment Successful!</h3>
                <p className="text-text-light mb-4">
                  Your advance payment has been processed. Redirecting to confirmation...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
}  */






'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '../../components/Button'
import { createBooking, type BookingPayload } from '@/src/services/bookings.api'

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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ===============================
  // 🔧 STEP 1 — FETCH GLAMPS FROM BACKEND
  // ===============================
  const [glamps, setGlamps] = useState<any[]>([])
  const [isLoadingGlamps, setIsLoadingGlamps] = useState(true)

  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        setIsLoadingGlamps(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/glamps`)
        const data = await response.json()
        setGlamps(data.data || [])
        console.log('[BookingPage] Glamps loaded:', data.data)
      } catch (err) {
        console.error('[BookingPage] Failed to load glamps:', err)
        setError('Failed to load accommodation options. Please refresh the page.')
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
    glampType: searchParams.get('glampType') || '',

    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    specialRequests: '',
    arrivalTime: '',
  })

  const [selectedGlamp, setSelectedGlamp] = useState<any>(null)
  const [nights, setNights] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // ===============================
  // 🔧 STEP 2 — SELECT REAL GLAMP BY ID
  // ===============================
  useEffect(() => {
    if (formData.glampType && glamps.length > 0) {
      const glamp = glamps.find(g => String(g.id) === String(formData.glampType))
      setSelectedGlamp(glamp || null)
      console.log('[BookingPage] Selected glamp:', glamp)
    }
  }, [formData.glampType, glamps])

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
    if (selectedGlamp && nights > 0) {
      // Calculate price using backend pricePerNight or fallback to 25000
      const pricePerNight = selectedGlamp.pricePerNight || 25000
      const price = pricePerNight * nights
      setTotalPrice(price)
      console.log('[BookingPage] Price calculated:', { pricePerNight, nights, total: price })
    }
  }, [selectedGlamp, nights])

  const handleAvailabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCurrentStep(2)
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCurrentStep(3)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleAdvancePayment = () => {
    setShowPaymentModal(true)
    setError(null)
  }

  // ==================================================
  // 🔧 STEP 3 — FIX CREATE BOOKING PAYLOAD (MANUAL)
  // ==================================================
  const handleManualBooking = async () => {
    setIsSubmitting(true)
    setError(null)

    if (!selectedGlamp?.id) {
      setError('Invalid glamp selection. Please try again.')
      setIsSubmitting(false)
      return
    }

    const payload: BookingPayload = {
      glampId: String(selectedGlamp.id), // ✅ REAL DATABASE ID
      checkInDate: formData.checkIn,
      checkOutDate: formData.checkOut,
      guests: Number(formData.guests),
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
    }

    console.log('[BookingPage] Selected glamp:', selectedGlamp)
    console.log('[BookingPage] Booking payload:', payload)

    const response = await createBooking(payload)

    if (response.success) {
      router.push(`/booking/confirmation/${response.booking.id}`)
    } else {
      setError(response.error)
      setIsSubmitting(false)
    }
  }

  // ==================================================
  // 🔧 STEP 3 — FIX CREATE BOOKING PAYLOAD (EASYPAISA)
  // ==================================================
  const handleEasyPaisaPayment = async () => {
    setIsSubmitting(true)
    setError(null)

    await new Promise(resolve => setTimeout(resolve, 1500))
    setPaymentSuccess(true)

    if (!selectedGlamp?.id) {
      setError('Invalid glamp selection. Please try again.')
      setIsSubmitting(false)
      return
    }

    const payload: BookingPayload = {
      glampId: String(selectedGlamp.id), // ✅ REAL DATABASE ID
      checkInDate: formData.checkIn,
      checkOutDate: formData.checkOut,
      guests: Number(formData.guests),
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
    }

    console.log('[BookingPage] Selected glamp:', selectedGlamp)
    console.log('[BookingPage] Booking payload:', payload)

    const response = await createBooking(payload)

    if (response.success) {
      setTimeout(() => {
        router.push(`/booking/confirmation/${response.booking.id}`)
      }, 2000)
    } else {
      setPaymentSuccess(false)
      setShowPaymentModal(false)
      setError(response.error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <section className="relative h-64 flex items-center justify-center bg-green">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920')"}}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mb-4 animate-fade-in">
            Complete Your Booking
          </h1>
          <p className="text-xl text-cream/90 max-w-2xl mx-auto animate-slide-up">
            You&apos;re just a few steps away from your perfect getaway
          </p>
        </div>
      </section>

      {/* Progress Steps */}
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

      {/* Error Message */}
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

      {/* Booking Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Check Availability */}
              {currentStep === 1 && (
                <form onSubmit={handleAvailabilitySubmit}>
                  <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <h2 className="font-serif text-3xl font-bold text-green mb-6">Check Availability</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Select Glamp *
                        </label>
                        <select
                          name="glampType"
                          value={selectedGlamp?.id || ''}
                          onChange={(e) => {
                            const glamp = glamps.find(g => String(g.id) === e.target.value)
                            setSelectedGlamp(glamp || null)
                            setFormData(prev => ({
                              ...prev,
                              glampType: e.target.value, // ✅ REAL ID ONLY
                            }))
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
                          disabled={isSubmitting || isLoadingGlamps}
                        >
                          <option value="">
                            {isLoadingGlamps ? 'Loading accommodations...' : 'Choose your glamp'}
                          </option>
                          {glamps.map((glamp) => (
                            <option key={glamp.id} value={glamp.id}>
                              {glamp.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button type="submit" variant="primary" size="large" className="w-full" disabled={isSubmitting}>
                        Continue to Guest Details
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 2: Guest Details */}
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
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                          required
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

              {/* Step 3: Payment Options */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                  <h2 className="font-serif text-2xl font-bold text-green mb-6">Choose Payment Method</h2>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleAdvancePayment}
                      disabled={isSubmitting}
                      className="w-full p-6 border-2 border-green rounded-lg hover:bg-cream transition-smooth text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-green mb-2">Pay 50% Advance (Recommended)</h3>
                          <p className="text-text-light text-sm mb-3">
                            Secure your booking with a 50% advance payment via EasyPaisa. Pay the remaining amount upon arrival.
                          </p>
                          <div className="bg-yellow/10 border border-yellow rounded-lg p-3">
                            <p className="text-green font-bold">
                              Pay Now: PKR {Math.round(totalPrice * 0.5).toLocaleString()}
                            </p>
                            <p className="text-sm text-text-light">
                              Remaining: PKR {Math.round(totalPrice * 0.5).toLocaleString()} (at check-in)
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleManualBooking}
                      disabled={isSubmitting}
                      className="w-full p-6 border-2 border-gray-300 rounded-lg hover:bg-cream transition-smooth text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-green mb-2">Manual Booking Request</h3>
                          <p className="text-text-light text-sm mb-3">
                            Submit your booking request and our team will contact you to confirm. Payment can be made upon arrival.
                          </p>
                          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                            <p className="text-text-dark font-semibold">
                              Total Amount: PKR {totalPrice.toLocaleString()}
                            </p>
                            <p className="text-sm text-text-light">
                              Payment at check-in
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
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
                
                {selectedGlamp ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-semibold text-text-dark mb-2">{selectedGlamp.name}</h3>
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
                          PKR {(selectedGlamp?.pricePerNight || 25000).toLocaleString()} x {nights} nights
                        </span>
                        <span className="text-text-dark">
                          PKR {((selectedGlamp?.pricePerNight || 25000) * nights).toLocaleString()}
                        </span>
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
                        Price includes breakfast, parking, and room service.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-text-light py-8">
                    <p>Please select a glamp to see pricing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EasyPaisa Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-fade-in">
            {!paymentSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-green mb-2">EasyPaisa Payment</h3>
                  <p className="text-text-light text-sm">
                    Pay 50% advance using EasyPaisa to confirm your booking.
                  </p>
                </div>

                <div className="bg-cream rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-text-light">Advance Amount (50%)</span>
                    <span className="font-bold text-green text-xl">PKR {Math.round(totalPrice * 0.5).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-light">Remaining at check-in</span>
                    <span className="text-text-dark">PKR {Math.round(totalPrice * 0.5).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleEasyPaisaPayment}
                    disabled={isSubmitting}
                    className="w-full bg-green text-cream px-6 py-4 rounded-lg font-semibold hover:bg-green/90 transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Pay PKR {Math.round(totalPrice * 0.5).toLocaleString()} Now
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isSubmitting}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-text-light text-center mt-4">
                  This is a demo payment interface. No actual transaction will be processed.
                </p>
              </>
            ) : (
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-green mb-2">Payment Successful!</h3>
                <p className="text-text-light mb-4">
                  Your advance payment has been processed. Redirecting to confirmation...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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














