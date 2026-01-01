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
  console.log('🔥 ADD BOOKING PAGE – VERSION 2026-01-02')

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [loadingGlamps, setLoadingGlamps] = useState(true)
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

  /* ---------------- FETCH GLAMPS ---------------- */
  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        const res = await api.get('/glamps')
        const list = Array.isArray(res.data?.data) ? res.data.data : []
        setGlamps(list)
      } catch (err) {
        console.error('Failed to fetch glamps', err)
        setError('Unable to load glamping options')
      } finally {
        setLoadingGlamps(false)
      }
    }

    fetchGlamps()
  }, [])

  /* ---------------- SUBMIT ---------------- */
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

      router.push('/agent/bookings')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green mb-2">Add New Booking</h1>
        <p className="text-text-light">Create a booking for your customer</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg font-semibold">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 space-y-6"
      >
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            required
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={e =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          />

          <input
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={e =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          />

          <input
            required
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={e =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="md:col-span-2 w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          />
        </div>

        {/* Booking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            required
            disabled={loadingGlamps}
            value={formData.glampId}
            onChange={e =>
              setFormData({ ...formData, glampId: e.target.value })
            }
            className="md:col-span-2 w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          >
            <option value="">
              {loadingGlamps ? 'Loading glamps…' : 'Choose a glamp'}
            </option>
            {glamps.map(g => (
              <option key={g.id} value={g.id}>
                {g.name} – PKR {g.pricePerNight.toLocaleString()}/night
              </option>
            ))}
          </select>

          <input
            type="date"
            required
            value={formData.checkIn}
            onChange={e =>
              setFormData({ ...formData, checkIn: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          />

          <input
            type="date"
            required
            value={formData.checkOut}
            onChange={e =>
              setFormData({ ...formData, checkOut: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || !formData.glampId}
            className="px-8 py-3 bg-green text-white rounded-lg font-bold"
          >
            {loading ? 'Creating…' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}


