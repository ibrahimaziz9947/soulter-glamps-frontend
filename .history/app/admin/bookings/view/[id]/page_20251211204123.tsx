'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getBookingById } from '../../../../booking/utils/mockBooking'

interface Booking {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  guests: number
  glampName: string
  checkIn: string
  checkOut: string
  nights: number
  totalPrice?: number
  amountPaid?: number
  remainingAmount?: number
  status: string
  paymentMethod?: string
  arrivalTime?: string
  specialRequests?: string
  createdAt: string
}

export default function ViewBookingPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    // Get real booking from mockBookings.js
    const realBooking = getBookingById(params.id as string) as Booking | null
    if (realBooking) {
      setBooking(realBooking)
    }
    // Don't redirect if no booking found - just show loading state
  }, [params.id])

  const handleCancelBooking = () => {
    // In a real app, this would call an API
    alert('Booking cancelled successfully')
    setShowCancelDialog(false)
    router.push('/admin/bookings')
  }

  const handleSendConfirmation = () => {
    if (booking) {
      alert('Confirmation email sent to ' + booking.email)
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
          <p className="text-text-light">Loading booking details...</p>
          <p className="text-sm text-text-light mt-2">
            If booking not found, please{' '}
            <Link href="/admin/bookings" className="text-yellow hover:underline">
              return to bookings list
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="font-serif text-3xl font-bold text-green">Booking Details</h1>
            <p className="text-text-light mt-1">Booking ID: {booking.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            booking.status === 'advance-paid' 
              ? 'bg-green/10 text-green' 
              : booking.status === 'manual'
              ? 'bg-yellow/10 text-yellow'
              : booking.status === 'confirmed'
              ? 'bg-green/10 text-green'
              : booking.status === 'pending'
              ? 'bg-yellow/10 text-yellow'
              : 'bg-red-50 text-red-600'
          }`}>
            {booking.status === 'advance-paid' ? 'CONFIRMED' : booking.status === 'manual' ? 'PENDING' : booking.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-green">Guest Information</h2>
              <button className="text-yellow hover:text-yellow-light transition-smooth">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-text-light mb-1">Full Name</p>
                <p className="font-medium text-text-dark">{booking.firstName} {booking.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Email Address</p>
                <p className="font-medium text-text-dark">{booking.email}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Phone Number</p>
                <p className="font-medium text-text-dark">{booking.phone}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Number of Guests</p>
                <p className="font-medium text-text-dark">
                  {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>
            </div>
          </div>

          {/* Accommodation Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Accommodation Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-text-light mb-1">Accommodation Type</p>
                <p className="font-medium text-text-dark">{booking.glampName}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Price per Night</p>
                <p className="font-medium text-green">PKR 25,000</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Check-in Date</p>
                <p className="font-medium text-text-dark">{booking.checkIn}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Check-out Date</p>
                <p className="font-medium text-text-dark">{booking.checkOut}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Duration</p>
                <p className="font-medium text-text-dark">{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Accommodation Total</p>
                <p className="font-medium text-green">PKR {booking.totalPrice?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Arrival Time */}
          {booking.arrivalTime && (
            <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h2 className="font-serif text-2xl font-bold text-green mb-4">Arrival Information</h2>
              <div className="p-4 bg-cream rounded-lg">
                <p className="text-sm text-text-light mb-1">Expected Arrival Time</p>
                <p className="font-medium text-text-dark">{booking.arrivalTime}</p>
              </div>
            </div>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <h2 className="font-serif text-2xl font-bold text-green mb-4">Special Requests</h2>
              <p className="text-text-dark leading-relaxed bg-cream p-4 rounded-lg">
                {booking.specialRequests}
              </p>
            </div>
          )}

          {/* Booking Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Booking Timeline</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green rounded-full"></div>
                  <div className="w-0.5 h-full bg-green/20"></div>
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-medium text-text-dark">Booking Created</p>
                  <p className="text-sm text-text-light">{new Date(booking.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green rounded-full"></div>
                  <div className="w-0.5 h-full bg-green/20"></div>
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-medium text-text-dark">
                    {booking.status === 'advance-paid' ? 'Advance Payment Received' : 'Booking Request Submitted'}
                  </p>
                  <p className="text-sm text-text-light">{new Date(booking.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-yellow rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-dark">Check-in</p>
                  <p className="text-sm text-text-light">{booking.checkIn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Payment Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between pb-3 border-b border-gray-200">
                <span className="text-text-light">Booking Type</span>
                <span className="font-semibold text-text-dark">
                  {booking.status === 'advance-paid' ? 'Advance Payment' : 'Manual Booking'}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-200">
                <span className="text-text-light">Payment Method</span>
                <span className="font-medium text-text-dark">
                  {booking.paymentMethod === 'none' ? 'Not Yet Paid' : booking.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-200">
                <span className="text-text-light">Total Amount</span>
                <span className="font-semibold text-text-dark">PKR {booking.totalPrice?.toLocaleString()}</span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-200">
                <span className="text-text-light">Amount Paid</span>
                <span className="font-semibold text-green">PKR {booking.amountPaid?.toLocaleString()}</span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="font-serif text-xl font-bold text-text-dark">Outstanding Balance</span>
                <span className="font-serif text-2xl font-bold text-yellow">PKR {booking.remainingAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Manual Booking Warning */}
            {booking.status === 'manual' && (
              <div className="mt-6 p-4 bg-yellow/10 border-2 border-yellow rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green mb-1">Manual Follow-Up Required</p>
                    <p className="text-sm text-text-dark">
                      Customer has not paid advance. Please contact them to confirm booking and arrange payment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Advance Paid Badge */}
            {booking.status === 'advance-paid' && (
              <div className="mt-6 p-4 bg-green/10 border-2 border-green rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green mb-1">50% Advance Confirmed</p>
                    <p className="text-sm text-text-dark">
                      Remaining balance of PKR {booking.remainingAmount?.toLocaleString()} is due at check-in.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <h2 className="font-serif text-xl font-bold text-green mb-4">Quick Actions</h2>

            <div className="space-y-3">
              <button
                onClick={handleSendConfirmation}
                className="w-full flex items-center justify-center gap-2 bg-green text-cream px-4 py-3 rounded-lg font-semibold hover:bg-green-dark transition-smooth"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Confirmation
              </button>

              <button className="w-full flex items-center justify-center gap-2 bg-yellow text-green px-4 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>

              <button className="w-full flex items-center justify-center gap-2 border-2 border-green text-green px-4 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Booking
              </button>

              <button
                onClick={() => setShowCancelDialog(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 px-4 py-3 rounded-lg font-semibold hover:bg-red-50 transition-smooth"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-slide-up">
            <h3 className="font-serif text-2xl font-bold text-green mb-4">Cancel Booking?</h3>
            <p className="text-text-dark mb-6">
              Are you sure you want to cancel this booking for <strong>{booking.firstName} {booking.lastName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 border-2 border-gray-300 text-text-dark px-4 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition-smooth"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
