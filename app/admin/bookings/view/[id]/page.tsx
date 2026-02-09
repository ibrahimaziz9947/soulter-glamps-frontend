'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/src/services/apiClient'


interface Booking {
  id: string
  customerName: string
  guests: number
  status: string
  createdAt: string

  checkInDate: string
  checkOutDate: string

  totalAmount?: number
  amountPaid?: number
  remainingAmount?: number

  glamp?: {
    name: string
    pricePerNight?: number
  }
}


interface Receipt {
  fileUrl: string
  fileName: string
  uploadedAt: string
}

export default function ViewBookingPage() {
  const params = useParams()
  const router = useRouter()

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [receiptLoading, setReceiptLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ---------------- FETCH REAL BOOKING ---------------- */
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await api.get(`/admin/bookings/${params.id}`)
        setBooking(data.data)
        console.log('API RESPONSE:', data)
      } catch (err: any) {
        setError(err.message || 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }

    const fetchReceipt = async () => {
      try {
        const data = await api.get(`/admin/bookings/${params.id}/receipt`)
        // Handle response where receipt might be in data.receipt or just data
        const receiptData = data.receipt || data.data || data
        
        // Check if we have valid receipt data
        if (receiptData && receiptData.fileUrl) {
          setReceipt(receiptData)
        } else {
          setReceipt(null)
        }
      } catch (err) {
        console.error('Failed to fetch receipt:', err)
        setReceipt(null)
      } finally {
        setReceiptLoading(false)
      }
    }

    if (params.id) {
      fetchBooking()
      fetchReceipt()
    }
  }, [params.id])

  const handleCancelBooking = () => {
    alert('Cancel booking API can be wired next')
    setShowCancelDialog(false)
    router.push('/admin/bookings')
  }

  const handleSendConfirmation = () => {
    alert('Confirmation email feature can be added later')
  }

  /* ---------------- LOADING / ERROR ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-500 mb-2">
            {error || 'Booking not found'}
          </p>
          <Link
            href="/admin/bookings"
            className="text-yellow hover:underline"
          >
            Return to bookings
          </Link>
        </div>
      </div>
    )
  }

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bookings"
            className="p-2 hover:bg-cream rounded-lg"
          >
            ←
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-green">
              Booking Details
            </h1>
            <p className="text-text-light mt-1">
              Booking ID: {booking.id}
            </p>
          </div>
        </div>

        <span className="px-4 py-2 rounded-full text-sm bg-green/10 text-green">
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-serif text-2xl font-bold text-green mb-4">
              Guest Information
            </h2>
            <p><strong>Name:</strong> {booking.customerName}</p>
            <p><strong>Guests:</strong> {booking.guests}</p>
          </div>

          {/* Accommodation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-serif text-2xl font-bold text-green mb-4">
              Accommodation Details
            </h2>
            <p><strong>Glamp:</strong> {booking.glamp?.name}</p>
            <p><strong>Check-in:</strong> {booking.checkInDate}</p>
            <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-serif text-2xl font-bold text-green mb-4">
              Booking Timeline
            </h2>
            {/*<p className="text-text-light">
              Created at: {new Date(booking.createdAt).toLocaleString()}
            </p> */}
            <p className="text-text-light">
              Created at:{' '}
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleString()
                : '—'}
            </p>

          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-serif text-2xl font-bold text-green mb-4">
              Payment Summary
            </h2>
            <p>Total: PKR {booking.totalAmount}</p>
            <p>Paid: PKR {booking.amountPaid}</p>
            <p>Remaining: PKR {booking.remainingAmount}</p>
          </div>

          {/* Payment Receipt */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-serif text-xl font-bold text-green mb-4">
              Payment Receipt
            </h2>

            {receiptLoading ? (
              <p className="text-text-light text-sm">Loading receipt...</p>
            ) : receipt ? (
              <div className="space-y-3">
                <a
                  href={receipt.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group overflow-hidden rounded-lg border border-gray-200"
                >
                  <img
                    src={receipt.fileUrl}
                    alt="Payment Receipt"
                    className="w-full object-cover max-h-[200px] hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded text-xs font-medium shadow-sm transition-opacity">
                      View Full Image
                    </span>
                  </div>
                </a>

                <div className="text-sm">
                  <p
                    className="font-medium text-text-dark truncate"
                    title={receipt.fileName}
                  >
                    {receipt.fileName}
                  </p>
                  <p className="text-text-light text-xs">
                    Uploaded: {new Date(receipt.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-text-light text-sm italic">
                Customer has not uploaded a payment receipt yet.
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-serif text-xl font-bold text-green mb-4">
              Quick Actions
            </h2>

            <button
              onClick={handleSendConfirmation}
              className="w-full bg-green text-white px-4 py-2 rounded mb-2"
            >
              Send Confirmation
            </button>

            <button
              onClick={() => setShowCancelDialog(true)}
              className="w-full border border-red-500 text-red-500 px-4 py-2 rounded"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">Cancel this booking?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 py-2 border rounded"
              >
                No
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-500 text-white rounded"
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

