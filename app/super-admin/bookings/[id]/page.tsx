'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSuperAdminBookingById, type SuperAdminBooking } from '@/src/services/super-admin-bookings.api'
import { formatMoney } from '@/src/utils/currency'

export default function SuperAdminBookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  // State
  const [booking, setBooking] = useState<SuperAdminBooking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch booking detail
  const loadBooking = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getSuperAdminBookingById(id)
      setBooking(data)
    } catch (err: any) {
      let errorMessage = 'Failed to load booking details'
      if (err.message) {
        errorMessage = err.message
      } else if (err.data?.message) {
        errorMessage = err.data.message
      } else if (err.data?.error) {
        errorMessage = err.data.error
      }
      
      if (err.status) {
        errorMessage = `[${err.status}] ${errorMessage}`
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  // Load on mount
  useEffect(() => {
    if (params.id) {
      loadBooking(params.id as string)
    }
  }, [params.id])
  
  // Handle retry
  const handleRetry = () => {
    if (params.id) {
      loadBooking(params.id as string)
    }
  }
  
  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }
  
  // Calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    try {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch {
      return 0
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/super-admin/bookings"
            className="p-2 hover:bg-cream rounded-lg transition-smooth"
          >
            <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-green">Booking Details</h1>
            <p className="text-text-light mt-1">Error loading booking</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Error Loading Booking</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-4 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // No booking found
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-light text-lg mb-4">Booking not found</p>
          <Link 
            href="/super-admin/bookings"
            className="text-yellow hover:underline"
          >
            Return to bookings list
          </Link>
        </div>
      </div>
    )
  }
  
  const nights = calculateNights(booking.checkInDate, booking.checkOutDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/super-admin/bookings"
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
            booking.status === 'CONFIRMED' 
              ? 'bg-green/10 text-green' 
              : booking.status === 'PENDING'
              ? 'bg-yellow/10 text-yellow'
              : booking.status === 'COMPLETED'
              ? 'bg-blue-500/10 text-blue-600'
              : 'bg-red-50 text-red-600'
          }`}>
            {booking.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Booking Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-text-light mb-1">Glamp Site</p>
                <p className="font-medium text-text-dark">{booking.glampName || `Glamp #${booking.glampId}`}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Number of Guests</p>
                <p className="font-medium text-text-dark">
                  {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Check-in Date</p>
                <p className="font-medium text-text-dark">{formatDate(booking.checkInDate)}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Check-out Date</p>
                <p className="font-medium text-text-dark">{formatDate(booking.checkOutDate)}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Duration</p>
                <p className="font-medium text-text-dark">{nights} {nights === 1 ? 'night' : 'nights'}</p>
              </div>
              <div>
                <p className="text-sm text-text-light mb-1">Booking Date</p>
                <p className="font-medium text-text-dark">{formatDate(booking.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Customer Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-text-light mb-1">Customer Name</p>
                <p className="font-medium text-text-dark">{booking.customerName}</p>
              </div>
              {booking.customerEmail && (
                <div>
                  <p className="text-sm text-text-light mb-1">Email Address</p>
                  <p className="font-medium text-text-dark">{booking.customerEmail}</p>
                </div>
              )}
              {booking.customerPhone && (
                <div>
                  <p className="text-sm text-text-light mb-1">Phone Number</p>
                  <p className="font-medium text-text-dark">{booking.customerPhone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-text-light mb-1">Customer ID</p>
                <p className="font-medium text-text-dark">{booking.customerId}</p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h2 className="font-serif text-2xl font-bold text-green mb-4">Special Requests</h2>
              <p className="text-text-dark leading-relaxed bg-cream p-4 rounded-lg">
                {booking.specialRequests}
              </p>
            </div>
          )}

          {/* Add-ons */}
          {booking.addOns && booking.addOns.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <h2 className="font-serif text-2xl font-bold text-green mb-4">Add-ons</h2>
              <div className="space-y-2">
                {booking.addOns.map((addon, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-cream rounded-lg">
                    <svg className="w-5 h-5 text-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-dark">{addon}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Status Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'bg-green' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-text-dark">Booking Status</p>
                  <p className="text-sm text-text-light">{booking.status}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  booking.paymentStatus === 'PAID' ? 'bg-green' : booking.paymentStatus === 'PARTIAL' ? 'bg-yellow' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-text-dark">Payment Status</p>
                  <p className="text-sm text-text-light">{booking.paymentStatus || 'UNPAID'}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-text-light mb-1">Last Updated</p>
                <p className="font-medium text-text-dark">{formatDate(booking.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Amount Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-green mb-6">Amount Breakdown</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-light">Total Amount</span>
                <span className="font-semibold text-text-dark">{formatMoney(booking.totalAmount ?? 0)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-text-light">Amount Paid</span>
                <span className="font-semibold text-green">{formatMoney(booking.amountPaid ?? 0)}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-text-dark">Remaining Balance</span>
                  <span className="font-bold text-xl text-yellow">{formatMoney(booking.remainingAmount ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Information */}
          {booking.agentId && (
            <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <h2 className="font-serif text-xl font-bold text-green mb-6">Commission Details</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-light mb-1">Agent</p>
                  <p className="font-medium text-text-dark">{booking.agentName || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-light mb-1">Agent ID</p>
                  <p className="font-medium text-text-dark">{booking.agentId}</p>
                </div>
                
                {booking.commission !== undefined && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-text-light mb-1">Commission Amount</p>
                    <p className="font-bold text-xl text-green">{formatMoney(booking.commission)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-cream rounded-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h3 className="font-semibold text-text-dark mb-4">Quick Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-light">Booking ID</span>
                <span className="font-medium text-text-dark">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light">Glamp ID</span>
                <span className="font-medium text-text-dark">{booking.glampId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light">Customer ID</span>
                <span className="font-medium text-text-dark">{booking.customerId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
