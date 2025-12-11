'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../components/Button'

export default function ConfirmationPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [bookingNumber, setBookingNumber] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'>('Upcoming')

  // Helper function to determine booking status
  const getBookingStatus = (checkIn: string, checkOut: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkInDate = new Date(checkIn)
    checkInDate.setHours(0, 0, 0, 0)
    const checkOutDate = new Date(checkOut)
    checkOutDate.setHours(0, 0, 0, 0)

    if (today < checkInDate) return 'Upcoming'
    if (today >= checkInDate && today <= checkOutDate) return 'Ongoing'
    if (today > checkOutDate) return 'Completed'
    return 'Upcoming'
  }

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData')
    if (!data) {
      router.push('/booking')
      return
    }
    
    const parsedData = JSON.parse(data)
    setBookingData(parsedData)
    
    // Generate a random booking number
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    setBookingNumber(`SG-${randomNum}`)
    
    // Determine booking status
    const status = getBookingStatus(parsedData.checkIn, parsedData.checkOut)
    setBookingStatus(status)
    
    // Clear the booking data after retrieving
    // sessionStorage.removeItem('bookingData')
  }, [router])

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
          <p className="text-text-light">Loading confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Success Header */}
      <section className="relative bg-green py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-yellow rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
            <svg className="w-12 h-12 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-4 animate-slide-up">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-cream/90 mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Thank you for choosing Soulter Glamps
          </p>
          <div className="bg-green-light rounded-lg p-4 inline-block animate-slide-up" style={{animationDelay: '0.4s'}}>
            <p className="text-cream/80 text-sm mb-1">Your Booking Number</p>
            <p className="font-mono text-2xl font-bold text-yellow">{bookingNumber}</p>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-6 animate-slide-up" style={{animationDelay: '0.6s'}}>
            <span className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg ${
              bookingStatus === 'Upcoming' ? 'bg-blue-500 text-white' :
              bookingStatus === 'Ongoing' ? 'bg-green text-white' :
              bookingStatus === 'Completed' ? 'bg-gray-600 text-white' :
              'bg-red-600 text-white'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              {bookingStatus}
            </span>
          </div>
        </div>
      </section>

      {/* Confirmation Details */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Email Confirmation Notice */}
          <div className="bg-yellow/10 border-l-4 border-yellow rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="font-semibold text-green mb-1">Confirmation Email Sent</h3>
                <p className="text-text-light text-sm">
                  We've sent a confirmation email to <span className="font-semibold text-green">{bookingData.email}</span> with all your booking details and directions to the property.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="font-serif text-2xl font-bold text-green mb-6 pb-4 border-b border-gray-200">
              Booking Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Guest Information */}
              <div>
                <h3 className="font-semibold text-green mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Guest Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-text-light">Name:</span>
                    <span className="ml-2 text-text-dark font-medium">
                      {bookingData.firstName} {bookingData.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-light">Email:</span>
                    <span className="ml-2 text-text-dark">{bookingData.email}</span>
                  </div>
                  <div>
                    <span className="text-text-light">Phone:</span>
                    <span className="ml-2 text-text-dark">{bookingData.phone}</span>
                  </div>
                  <div>
                    <span className="text-text-light">Guests:</span>
                    <span className="ml-2 text-text-dark">{bookingData.guests}</span>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div>
                <h3 className="font-semibold text-green mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Stay Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-text-light">Accommodation:</span>
                    <span className="ml-2 text-text-dark font-medium">{bookingData.glampName}</span>
                  </div>
                  <div>
                    <span className="text-text-light">Check-in:</span>
                    <span className="ml-2 text-text-dark">
                      {new Date(bookingData.checkIn).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-light">Check-out:</span>
                    <span className="ml-2 text-text-dark">
                      {new Date(bookingData.checkOut).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-light">Duration:</span>
                    <span className="ml-2 text-text-dark">
                      {bookingData.nights} {bookingData.nights === 1 ? 'night' : 'nights'}
                    </span>
                  </div>
                  {bookingData.arrivalTime && (
                    <div>
                      <span className="text-text-light">Arrival Time:</span>
                      <span className="ml-2 text-text-dark">{bookingData.arrivalTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add-ons */}
            {(bookingData.breakfast || bookingData.airportPickup || bookingData.hikingGuide || bookingData.spa) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-green mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add-ons & Extras
                </h3>
                <ul className="space-y-2 text-sm">
                  {bookingData.breakfast && (
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-dark">Gourmet Breakfast</span>
                    </li>
                  )}
                  {bookingData.airportPickup && (
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-dark">Airport Pickup</span>
                    </li>
                  )}
                  {bookingData.hikingGuide && (
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-dark">Guided Hiking Tour</span>
                    </li>
                  )}
                  {bookingData.spa && (
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-dark">Couples Spa Treatment</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Special Requests */}
            {bookingData.specialRequests && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-green mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Special Requests
                </h3>
                <p className="text-sm text-text-dark bg-cream p-4 rounded-lg">
                  {bookingData.specialRequests}
                </p>
              </div>
            )}

            {/* Payment Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-green mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Payment Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-light">Total Amount:</span>
                  <span className="text-text-dark font-semibold">PKR {bookingData.totalPrice?.toLocaleString()}</span>
                </div>
                
                {bookingData.status === 'advance-paid' ? (
                  <>
                    <div className="bg-green/10 border border-green rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-green">50% Advance Paid via {bookingData.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-light">Paid Now:</span>
                        <span className="text-green font-bold">PKR {bookingData.amountPaid?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-light">Remaining (at check-in):</span>
                        <span className="text-text-dark font-semibold">PKR {bookingData.remainingAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-yellow/10 border border-yellow rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-green">Manual Booking Request</span>
                    </div>
                    <p className="text-sm text-text-light">
                      Your booking request has been submitted. Our team will contact you to confirm. Full payment of PKR {bookingData.totalPrice?.toLocaleString()} is due at check-in.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="font-serif text-2xl font-bold text-green mb-6">What's Next?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow rounded-full flex items-center justify-center text-green font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-green mb-2">Check Your Email</h3>
                  <p className="text-text-light text-sm">
                    You'll receive a confirmation email with detailed directions, parking information, and check-in instructions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow rounded-full flex items-center justify-center text-green font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-green mb-2">Prepare for Your Trip</h3>
                  <p className="text-text-light text-sm">
                    We'll send you a packing list and information about local activities and weather conditions closer to your arrival date.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow rounded-full flex items-center justify-center text-green font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-green mb-2">Arrive & Enjoy</h3>
                  <p className="text-text-light text-sm">
                    Check in at our welcome center between 3:00 PM and 8:00 PM on your arrival date. Our team will be waiting to welcome you!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green text-cream rounded-lg p-6 md:p-8 mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4">Questions About Your Booking?</h2>
            <p className="text-cream/90 mb-6">
              Our team is here to help! Feel free to reach out if you have any questions or need to make changes to your reservation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-cream/70">Email</p>
                  <a href="mailto:bookings@soulterglamps.com" className="font-semibold hover:text-yellow transition-smooth">
                    bookings@soulterglamps.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-sm text-cream/70">Phone</p>
                  <a href="tel:+15551234567" className="font-semibold hover:text-yellow transition-smooth">
                    (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="large">
                Return to Home
              </Button>
            </Link>
            <Link href="/glamps">
              <Button variant="outline" size="large">
                Browse More Glamps
              </Button>
            </Link>
            <button 
              onClick={() => setShowCancelModal(true)}
              className="px-8 py-3 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-smooth"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </section>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center text-green mb-2">Cancel Booking?</h3>
              <p className="text-text-light text-center mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              
              <div className="bg-cream p-4 rounded-lg mb-6">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-light">Booking Number:</span>
                    <span className="font-semibold text-green">{bookingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-light">Guest Name:</span>
                    <span className="font-semibold text-green">{bookingData?.firstName} {bookingData?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-light">Total Amount:</span>
                    <span className="font-semibold text-green">PKR {bookingData?.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow/10 border border-yellow rounded-lg p-4 mb-6">
                <p className="text-sm text-text-dark">
                  <strong>Cancellation Policy:</strong> Cancellations made 48 hours before check-in are eligible for a full refund. Cancellations made within 48 hours may incur charges.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-text-dark rounded-lg font-semibold hover:bg-gray-50 transition-smooth"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => {
                    // Placeholder for cancel action
                    setBookingStatus('Cancelled')
                    alert('Booking cancellation request submitted. You will receive a confirmation email shortly.')
                    setShowCancelModal(false)
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-smooth"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
