'use client'

import { useState, useEffect } from 'react'
import { displayToCents, centsToDisplay, isValidCurrencyInput, sanitizeCurrencyInput } from '@/src/utils/currency'

interface IncomeFormData {
  source: string
  status: string
  amount: string // Display value (decimal string)
  currency: string
  dateReceived: string
  reference: string
  notes: string
  bookingId: string
}

interface IncomeFormProps {
  initialData?: {
    source?: string
    status?: string
    amount?: number // In cents from backend
    currency?: string
    date?: string
    reference?: string
    description?: string
    notes?: string
    bookingId?: string
  }
  onSubmit: (data: {
    source: string
    status: string
    amount: number // In cents
    currency: string
    dateReceived: string
    reference?: string
    notes?: string
    bookingId?: string
  }) => Promise<void>
  onCancel: () => void
  submitLabel?: string
  isSubmitting?: boolean
  errors?: Record<string, string>
}

export default function IncomeForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Income',
  isSubmitting = false,
  errors = {},
}: IncomeFormProps) {
  const [formData, setFormData] = useState<IncomeFormData>({
    source: initialData?.source || 'MANUAL',
    status: initialData?.status || 'CONFIRMED',
    amount: initialData?.amount ? centsToDisplay(initialData.amount) : '',
    currency: initialData?.currency || 'PKR',
    dateReceived: initialData?.date || new Date().toISOString().split('T')[0],
    reference: initialData?.reference || '',
    notes: initialData?.notes || initialData?.description || '',
    bookingId: initialData?.bookingId || '',
  })

  const [showBookingField, setShowBookingField] = useState(
    initialData?.source === 'BOOKING' || !!initialData?.bookingId
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Update showBookingField when source changes
  useEffect(() => {
    if (formData.source === 'BOOKING') {
      setShowBookingField(true)
    }
  }, [formData.source])

  // Update fieldErrors when errors prop changes
  useEffect(() => {
    setFieldErrors(errors)
  }, [errors])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Special handling for amount field
    if (name === 'amount') {
      const sanitized = sanitizeCurrencyInput(value)
      setFormData(prev => ({ ...prev, amount: sanitized }))
      
      // Clear amount error if valid
      if (sanitized && isValidCurrencyInput(sanitized)) {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.amount
          return newErrors
        })
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // Clear field error when user types
      if (fieldErrors[name]) {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.amount || !isValidCurrencyInput(formData.amount)) {
      errors.amount = 'Please enter a valid amount'
    }

    if (parseFloat(formData.amount || '0') <= 0) {
      errors.amount = 'Amount must be greater than 0'
    }

    if (!formData.dateReceived) {
      errors.dateReceived = 'Date is required'
    }

    if (formData.source === 'BOOKING' && !formData.bookingId.trim()) {
      errors.bookingId = 'Booking ID is required when source is Booking'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const payload = {
        source: formData.source,
        status: formData.status,
        amount: displayToCents(formData.amount), // Convert to cents
        currency: formData.currency,
        dateReceived: formData.dateReceived,
        reference: formData.reference.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        bookingId: showBookingField && formData.bookingId.trim() ? formData.bookingId.trim() : undefined,
      }

      await onSubmit(payload)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source & Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Source <span className="text-red-500">*</span>
          </label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="MANUAL">Manual Entry</option>
            <option value="BOOKING">Booking Payment</option>
            <option value="OTHER">Other</option>
          </select>
          {fieldErrors.source && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.source}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="DRAFT">Draft</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          {fieldErrors.status && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.status}</p>
          )}
        </div>
      </div>

      {/* Amount & Currency Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
              fieldErrors.amount ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-green-600'
            }`}
          />
          {fieldErrors.amount && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.amount}</p>
          )}
          <p className="text-text-light text-xs mt-1">Enter amount as decimal (e.g., 123.45)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="PKR">PKR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          {fieldErrors.currency && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.currency}</p>
          )}
        </div>
      </div>

      {/* Date Received */}
      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">
          Date Received <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dateReceived"
          value={formData.dateReceived}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
            fieldErrors.dateReceived ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-green-600'
          }`}
        />
        {fieldErrors.dateReceived && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.dateReceived}</p>
        )}
      </div>

      {/* Reference */}
      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">Reference</label>
        <input
          type="text"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
          placeholder="e.g., Invoice number, receipt ID"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {fieldErrors.reference && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.reference}</p>
        )}
      </div>

      {/* Booking ID - Show if source is BOOKING or user toggles */}
      {formData.source !== 'BOOKING' && !showBookingField && (
        <button
          type="button"
          onClick={() => setShowBookingField(true)}
          disabled={isSubmitting}
          className="text-green hover:text-green-dark font-medium text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Link to Booking
        </button>
      )}

      {showBookingField && (
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Booking ID {formData.source === 'BOOKING' && <span className="text-red-500">*</span>}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="bookingId"
              value={formData.bookingId}
              onChange={handleChange}
              placeholder="Enter booking ID"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                fieldErrors.bookingId ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-green-600'
              }`}
            />
            {formData.source !== 'BOOKING' && (
              <button
                type="button"
                onClick={() => {
                  setShowBookingField(false)
                  setFormData(prev => ({ ...prev, bookingId: '' }))
                }}
                disabled={isSubmitting}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-smooth disabled:opacity-50"
                title="Remove booking link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {fieldErrors.bookingId && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.bookingId}</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes..."
          rows={4}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        ></textarea>
        {fieldErrors.notes && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.notes}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-100 text-text-dark rounded-lg font-semibold hover:bg-gray-200 transition-smooth disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
