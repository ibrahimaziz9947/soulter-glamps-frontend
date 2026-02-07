'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getBookingById } from '@/src/services/bookings.api'
import type { Booking } from '@/src/services/bookings.api'
import Button from '@/app/components/Button'

export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true)
        const response = await getBookingById(params.id)
        
        if (response.success && response.booking) {
          setBooking(response.booking)
        } else {
          setError('Booking not found')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load booking details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBooking()
    }
  }, [params.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const file = e.target.files?.[0] || null
    if (!file) {
      setSelectedFile(null)
      return
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    const isAllowed = allowedTypes.includes(file.type)
    const isWithinSize = file.size <= 5 * 1024 * 1024
    if (!isAllowed) {
      setUploadError('Only JPG, PNG or PDF files are allowed.')
      setSelectedFile(null)
      return
    }
    if (!isWithinSize) {
      setUploadError('File must be 5MB or smaller.')
      setSelectedFile(null)
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !params.id) return
    setUploadError(null)
    setUploadSuccess(false)
    setUploading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const url = `${baseUrl}/public/bookings/${params.id}/receipt`
      const formData = new FormData()
      formData.append('receipt', selectedFile)

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = (data && (data.error || data.message)) || `Upload failed (HTTP ${response.status})`
        throw new Error(message)
      }

      setUploadSuccess(true)
      setSelectedFile(null)
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload receipt. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-green mb-4"></div>
          <p className="text-text-light">Loading your booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-dark mb-2">Booking Not Found</h2>
          <p className="text-text-light mb-6">{error || 'The booking you are looking for could not be found.'}</p>
          <Link href="/">
            <Button variant="primary" size="medium">Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-bold text-green mb-2">Booking Confirmed!</h1>
          <p className="text-text-light text-lg">Your reservation has been successfully created</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 animate-slide-up">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green to-green-dark p-6 text-cream">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-2xl font-bold">Booking Reference</h2>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            <p className="font-mono text-yellow text-xl font-semibold">{booking.id}</p>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-6">
            {/* Accommodation Name */}
            <div>
              <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-2">Accommodation</h3>
              <p className="text-xl font-semibold text-text-dark">Glamp ID: {booking.glampId}</p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-2">Check-in</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-text-dark">{formatDate(booking.checkInDate)}</p>
                    <p className="text-sm text-text-light">After 3:00 PM</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-2">Check-out</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-text-dark">{formatDate(booking.checkOutDate)}</p>
                    <p className="text-sm text-text-light">Before 11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guests */}
            <div>
              <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-2">Guests</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-text-dark">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-gray-200 pt-6">
              {booking.totalAmount !== undefined ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-light">Total Amount</span>
                    <span className="text-2xl font-bold text-green">PKR {booking.totalAmount.toLocaleString()}</span>
                  </div>
                  {booking.amountPaid !== undefined && booking.amountPaid > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-light">Amount Paid</span>
                      <span className="text-lg font-semibold text-text-dark">PKR {booking.amountPaid.toLocaleString()}</span>
                    </div>
                  )}
                  {booking.remainingAmount !== undefined && booking.remainingAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-light">Remaining Balance</span>
                      <span className="text-lg font-semibold text-yellow">PKR {booking.remainingAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-text-light text-sm">Pricing details will be shared via confirmation email.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow/10 border border-yellow/30 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-text-dark mb-2">Important Information</h3>
              <ul className="text-sm text-text-light space-y-1">
                <li>• Please save your booking reference for future correspondence</li>
                <li>• Check-in time: 3:00 PM - 8:00 PM</li>
                <li>• Check-out time: Before 11:00 AM</li>
                <li>• A confirmation email will be sent to your registered email address</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Payment Receipt */}
        {(() => {
          const status = booking.status?.toUpperCase?.() || ''
          const isPendingPayment = status === 'PENDING_PAYMENT' || status === 'PENDING'
          const alreadyNotPending = status && !isPendingPayment
          return (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="font-serif text-2xl font-bold text-green mb-2">Upload Payment Receipt</h3>
              <p className="text-text-light mb-4">
                Please upload a screenshot or PDF of your 50% advance payment receipt.
              </p>

              {alreadyNotPending ? (
                <div className="bg-green/10 border border-green/30 rounded-lg p-4 text-green">
                  Receipt already submitted or payment verified.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      disabled={uploading || uploadSuccess}
                      className="block w-full text-sm text-text-light file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green file:text-cream hover:file:bg-green-dark rounded-lg border border-gray-200 p-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Allowed: JPG, PNG, PDF. Max size: 5MB.</p>
                  </div>

                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
                      {uploadError}
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3">
                      Receipt uploaded successfully. Our team will verify your payment.
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    className="w-full"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading || uploadSuccess}
                  >
                    {uploading ? 'Uploading...' : 'Upload Receipt'}
                  </Button>
                </div>
              )}
            </div>
          )
        })()}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button variant="secondary" size="large" className="w-full">
              Return to Home
            </Button>
          </Link>
          <Link href="/glamps" className="flex-1">
            <Button variant="primary" size="large" className="w-full">
              Browse More Accommodations
            </Button>
          </Link>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8">
          <p className="text-text-light text-sm mb-2">Need help with your booking?</p>
          <Link href="/contact" className="text-green font-semibold hover:text-green-dark transition-smooth">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
