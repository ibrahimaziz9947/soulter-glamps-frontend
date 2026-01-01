
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/src/services/apiClient'

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

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    glampId: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
  })

  /* ------------------------------------------------------------
     FETCH GLAMPS (REAL DATA)
  ------------------------------------------------------------ */
  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        //const res = await api.get('/glamps')
        //setGlamps(res.data?.data || [])
        const res = await api.get('/glamps')
        console.log('GLAMPS RAW RESPONSE:', res.data)

        setGlamps(Array.isArray(res.data?.data) ? res.data.data : [])

      } catch (err) {
        console.error('Failed to fetch glamps', err)
        setError('Unable to load glamping options')
      }
    }

    fetchGlamps()
  }, [])

  /* ------------------------------------------------------------
     SUBMIT BOOKING (AGENT API)
  ------------------------------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/agent/bookings', {
        customerName: formData.customerName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        glampId: formData.glampId,
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
        guests: formData.guests,
      })

      // success → redirect to bookings list
      router.push('/agent/bookings')
    } catch (err: any) {
      console.error('Booking creation failed', err)
      setError(
        err?.response?.data?.message ||
        'Failed to create booking. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green mb-2">
          Add New Booking
        </h1>
        <p className="text-text-light">
          Create a booking for your customer
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg font-semibold">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 space-y-6"
      >
        {/* Customer Information */}
        <div>
          <h2 className="text-xl font-bold text-green mb-4 pb-2 border-b-2 border-green/20">
            Customer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-dark mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
              />
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div>
          <h2 className="text-xl font-bold text-green mb-4 pb-2 border-b-2 border-green/20">
            Booking Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-dark mb-2">
                Glamp Selection <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500">
                Loaded glamps: {glamps.length}
              </p>

              <select
                required
                value={formData.glampId}
                onChange={(e) =>
                  setFormData({ ...formData, glampId: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
              >
                <option value="">Choose a glamp</option>
                {glamps.map((glamp) => (
                  <option key={glamp.id} value={glamp.id}>
                    {glamp.name} – PKR{' '}
                    {glamp.pricePerNight.toLocaleString()}/night
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Check-In Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.checkIn}
                onChange={(e) =>
                  setFormData({ ...formData, checkIn: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Check-Out Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.checkOut}
                onChange={(e) =>
                  setFormData({ ...formData, checkOut: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border-2 border-gray-300 rounded-lg font-bold"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-green text-white rounded-lg font-bold hover:bg-green-dark shadow-lg disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}

