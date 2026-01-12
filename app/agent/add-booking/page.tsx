/*'use client'

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
     FETCH GLAMPS (FIXED)
  ------------------------------------------------------------ *
  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        const res = await api.get('/glamps')
        console.log('GLAMPS RAW RESPONSE:', res.data)

        const glampList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : []

        setGlamps(glampList)
      } catch (err) {
        console.error('Failed to fetch glamps', err)
        setError('Unable to load glamping options')
      }
    }

    fetchGlamps()
  }, [])

  /* ------------------------------------------------------------
     SUBMIT BOOKING
  ------------------------------------------------------------ *
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green mb-2">
          Add New Booking
        </h1>
        <p className="text-text-light">
          Create a booking for your customer
        </p>
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
        {/* Customer Info *
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

        {/* Booking Info *
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
              onChange={e =>
                setFormData({ ...formData, glampId: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
            >
              <option value="">Choose a glamp</option>
              {glamps.map(glamp => (
                <option key={glamp.id} value={glamp.id}>
                  {glamp.name} – PKR {glamp.pricePerNight.toLocaleString()}/night
                </option>
              ))}
            </select>
          </div>

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

        <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
          <button
            type="submit"
            disabled={loading || !formData.glampId}
            className="px-8 py-3 bg-green text-white rounded-lg font-bold"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
} */







// MOst recent correct file
/*'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiError } from '@/src/services/apiClient'

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
     FETCH GLAMPS (FIXED & SAFE)
  ------------------------------------------------------------ *
  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Glamp[] }>('/glamps')

        if (res.success && Array.isArray(res.data)) {
          setGlamps(res.data)
        } else {
          setGlamps([])
          console.error('Unexpected glamps response shape', res)
        }
      } catch (err) {
        console.error('Failed to fetch glamps', err)
        setError('Unable to load glamping options')
      }
    }

    fetchGlamps()
  }, [])

  /* ------------------------------------------------------------
     SUBMIT BOOKING (FIXED)
  ------------------------------------------------------------ *
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/agent/bookings', {
        customerName: formData.customerName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        glampId: formData.glampId, // ✅ ID, not name
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
        guests: formData.guests,
      })

      router.push('/agent/bookings')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to create booking. Please try again.')
      }
      console.error('Create booking error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green mb-2">
          Add New Booking
        </h1>
        <p className="text-text-light">
          Create a booking for your customer
        </p>
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
        {/* Customer Info *
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

        {/* Booking Info *
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-text-dark mb-2">
              Glamp Selection <span className="text-red-500">*</span>
            </label>

            <select
              required
              value={formData.glampId}
              onChange={e =>
                setFormData({ ...formData, glampId: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
            >
              <option value="">Choose a glamp</option>
              {glamps.map(glamp => (
                <option key={glamp.id} value={glamp.id}>
                  {glamp.name} – PKR {glamp.pricePerNight.toLocaleString()}/night
                </option>
              ))}
            </select>
          </div>

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

        <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
          <button
            type="submit"
            disabled={loading || !formData.glampId}
            className="px-8 py-3 bg-green text-white rounded-lg font-bold"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
} */








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
    guests: 1,
  })

  const [showCalendar, setShowCalendar] = useState(false)
  const [selectingField, setSelectingField] = useState<'checkIn' | 'checkOut' | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Helper to format date for display
  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Get days in month
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const formattedDate = formatDate(selectedDate)

    if (selectingField === 'checkIn') {
      setFormData(prev => ({
        ...prev,
        checkIn: formattedDate,
        // Clear check-out if it's before new check-in
        checkOut: prev.checkOut && new Date(prev.checkOut) <= selectedDate ? '' : prev.checkOut
      }))
      setShowCalendar(false)
      setSelectingField(null)
    } else if (selectingField === 'checkOut') {
      // Prevent selecting check-out before check-in
      if (formData.checkIn && selectedDate <= new Date(formData.checkIn)) {
        setError('Check-out date must be after check-in date')
        return
      }
      setFormData(prev => ({ ...prev, checkOut: formattedDate }))
      setShowCalendar(false)
      setSelectingField(null)
    }
  }

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Check if date is in the past
  const isPastDate = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Check if date is selected
  const isSelectedDate = (day: number): boolean => {
    const date = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
    return date === formData.checkIn || date === formData.checkOut
  }

  // Check if date is in range
  const isInRange = (day: number): boolean => {
    if (!formData.checkIn || !formData.checkOut) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date > new Date(formData.checkIn) && date < new Date(formData.checkOut)
  }

  /* =========================
     FETCH GLAMPS
  ========================= */
  useEffect(() => {
    const fetchGlamps = async () => {
      try {
        const res = await api.get('/glamps')
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? []

        setGlamps(list)
      } catch {
        setError('Unable to load glamping options')
      }
    }

    fetchGlamps()
  }, [])

  /* =========================
     SUBMIT BOOKING
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate dates are selected
    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select both check-in and check-out dates')
      return
    }

    // Validate check-out is after check-in
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('Check-out date must be after check-in date')
      return
    }

    if (formData.guests < 1 || formData.guests > 3) {
      setError('Guests must be between 1 and 3')
      return
    }

    try {
      setLoading(true)

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
      setError(
        err?.message ||
        'Failed to create booking. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-900">
          Add New Booking
        </h1>
        <p className="text-gray-600">
          Create a booking for your customer
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
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
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={e =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            required
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={e =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="md:col-span-2 w-full px-4 py-3 border rounded-lg"
          />
        </div>

        {/* Booking Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-text-dark mb-2">
              Glamp Selection <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.glampId}
              onChange={e =>
                setFormData({ ...formData, glampId: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            >
              <option value="">Choose a glamp</option>
              {glamps.map(glamp => (
                <option key={glamp.id} value={glamp.id}>
                  {glamp.name} – PKR {glamp.pricePerNight.toLocaleString()}/night
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-bold text-text-dark mb-2">
              Check-in & Check-out Dates <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Select your check-in and check-out dates from the calendar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Check-in Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Check-in Date
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSelectingField('checkIn')
                    setShowCalendar(true)
                    setError(null)
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-left hover:border-green-600 focus:border-green-600 focus:outline-none transition-colors"
                >
                  {formData.checkIn ? (
                    <span className="text-gray-900 font-medium">
                      {formatDisplayDate(formData.checkIn)}
                    </span>
                  ) : (
                    <span className="text-gray-400">Select check-in date</span>
                  )}
                </button>
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Check-out Date
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.checkIn) {
                      setError('Please select check-in date first')
                      return
                    }
                    setSelectingField('checkOut')
                    setShowCalendar(true)
                    setError(null)
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-left hover:border-green-600 focus:border-green-600 focus:outline-none transition-colors"
                >
                  {formData.checkOut ? (
                    <span className="text-gray-900 font-medium">
                      {formatDisplayDate(formData.checkOut)}
                    </span>
                  ) : (
                    <span className="text-gray-400">Select check-out date</span>
                  )}
                </button>
              </div>
            </div>

            {/* Display selected date range */}
            {formData.checkIn && formData.checkOut && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-green-800 font-medium">
                    {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))} night(s) selected
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Calendar Modal */}
          {showCalendar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectingField === 'checkIn' ? 'Select Check-in Date' : 'Select Check-out Date'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCalendar(false)
                      setSelectingField(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold text-gray-900">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Calendar days */}
                  {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                    const day = i + 1
                    const isPast = isPastDate(day)
                    const isSelected = isSelectedDate(day)
                    const inRange = isInRange(day)

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => !isPast && handleDateSelect(day)}
                        disabled={isPast}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          isPast
                            ? 'text-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-green-600 text-white'
                            : inRange
                            ? 'bg-green-100 text-green-800'
                            : 'text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {/* Calendar Footer */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    {selectingField === 'checkIn' 
                      ? 'Select the date you want to check in'
                      : 'Select the date you want to check out'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Number of Guests */}
          <div>
            <label className="block text-sm font-bold text-text-dark mb-2">
              Number of Guests <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min={1}
              max={3}
              required
              value={formData.guests}
              onChange={e =>
                setFormData({
                  ...formData,
                  guests: Math.min(3, Math.max(1, Number(e.target.value))),
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />

            <p className="text-xs text-gray-500 mt-1">
              Maximum 3 guests per glamp
            </p>
          </div>
        </div>



        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-green-800 text-white rounded-lg font-bold"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}
