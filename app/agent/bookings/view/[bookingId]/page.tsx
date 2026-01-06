'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/src/services/apiClient'

/* =========================
   TYPES
========================= */

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

interface Booking {
  id: string
  customerName: string
  guests: number
  status: BookingStatus
  totalAmount: number
  checkInDate: string
  checkOutDate: string
  createdAt: string
  glamp?: {
    name: string
  }
}

/* =========================
   PAGE
========================= */

export default function AgentBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* =========================
     FETCH BOOKING
  ========================= */

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Booking }>(
          `/agent/bookings/${bookingId}`,
          { cache: 'no-store' }
        )

        setBooking(res.data)
      } catch (err) {
        console.error('Failed to load booking', err)
        setError('Unable to load booking details')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  /* =========================
     RENDER STATES
  ========================= */

  if (loading) {
    return <p className="p-6">Loading booking details...</p>
  }

  if (error || !booking) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => router.push('/agent/bookings')}
          className="mt-4 text-green-800 underline"
        >
          ← Back to bookings
        </button>
      </div>
    )
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
        <div>
          <h1 className="text-2xl font-semibold text-green-900">
            Booking Details
          </h1>
          <p className="text-sm text-gray-600 break-all">
            Booking ID: {booking.id}
          </p>
        </div>

        <StatusBadge status={booking.status} />
      </div>

      {/* Guest Info */}
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <h2 className="text-lg font-semibold text-green-900">
          Guest Information
        </h2>
        <p>
          <span className="font-semibold">Name:</span>{' '}
          {booking.customerName}
        </p>
        <p>
          <span className="font-semibold">Guests:</span>{' '}
          {booking.guests}
        </p>
      </div>

      {/* Accommodation */}
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <h2 className="text-lg font-semibold text-green-900">
          Accommodation Details
        </h2>
        <p>
          <span className="font-semibold">Glamp:</span>{' '}
          {booking.glamp?.name || 'Unknown'}
        </p>
        <p>
          <span className="font-semibold">Check-in:</span>{' '}
          {new Date(booking.checkInDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Check-out:</span>{' '}
          {new Date(booking.checkOutDate).toLocaleDateString()}
        </p>
      </div>

      {/* Payment */}
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <h2 className="text-lg font-semibold text-green-900">
          Payment Summary
        </h2>
        <p className="text-xl font-bold text-yellow-700">
          PKR {booking.totalAmount.toLocaleString()}
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <h2 className="text-lg font-semibold text-green-900">
          Booking Timeline
        </h2>
        <p>
          Created at:{' '}
          {new Date(booking.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push('/agent/bookings')}
        className="text-green-800 underline font-semibold"
      >
        ← Back to bookings
      </button>
    </div>
  )
}

/* =========================
   SMALL COMPONENTS
========================= */

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    CONFIRMED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  )
}
