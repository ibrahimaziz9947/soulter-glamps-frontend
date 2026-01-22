'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPurchase } from '@/src/services/purchases.api'
import { isValidCurrencyInput, sanitizeCurrencyInput } from '@/src/utils/currency'

interface PurchaseFormData {
  vendorName: string
  purchaseDate: string
  amount: string // Display value (decimal string)
  currency: string
  status: string
  reference: string
  notes: string
}

export default function NewPurchasePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<PurchaseFormData>({
    vendorName: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    amount: '',
    currency: 'PKR',
    status: 'DRAFT',
    reference: '',
    notes: '',
  })

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

    if (!formData.vendorName.trim()) {
      errors.vendorName = 'Vendor name is required'
    }

    if (!formData.amount || !isValidCurrencyInput(formData.amount)) {
      errors.amount = 'Please enter a valid amount'
    }

    if (parseFloat(formData.amount || '0') <= 0) {
      errors.amount = 'Amount must be greater than 0'
    }

    if (!formData.purchaseDate) {
      errors.purchaseDate = 'Purchase date is required'
    }

    if (!formData.currency || !formData.currency.trim()) {
      errors.currency = 'Currency is required'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setToast({
        message: 'Please fix the validation errors',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)
    setFieldErrors({})
    setToast(null)

    try {
      const apiPayload = {
        vendorName: formData.vendorName.trim(),
        purchaseDate: formData.purchaseDate,
        amount: parseFloat(formData.amount) || 0, // Send as major units
        currency: formData.currency.trim(),
        status: formData.status,
        category: 'GENERAL', // Default category
        reference: formData.reference?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
      }

      console.log('[Purchase Submit] Payload keys:', Object.keys(apiPayload))
      console.log('[Purchase Submit] Full Payload:', apiPayload)

      const response = await createPurchase(apiPayload)

      // Show success toast
      setToast({
        message: 'Purchase created successfully!',
        type: 'success',
      })

      // Redirect to list page after short delay
      setTimeout(() => {
        router.push('/admin/finance/purchases')
      }, 500)
    } catch (error: any) {
      console.error('Failed to create purchase:', error)

      // Handle validation errors
      if (error.errors && typeof error.errors === 'object') {
        setFieldErrors(error.errors)
        setToast({
          message: 'Please fix the validation errors',
          type: 'error',
        })
      } else if (error.status === 401) {
        setToast({
          message: 'Please log in to create purchase records',
          type: 'error',
        })
      } else if (error.status === 403) {
        setToast({
          message: 'You do not have permission to create purchase records',
          type: 'error',
        })
      } else {
        setToast({
          message: error.message || 'Failed to create purchase record',
          type: 'error',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/finance/purchases')
  }

  // Auto-dismiss toast
  if (toast) {
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-800 border-2 border-green-600'
                : toast.type === 'error'
                ? 'bg-red-100 text-red-800 border-2 border-red-600'
                : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-600'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/finance/purchases"
              className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
              title="Back to Purchases"
            >
              <svg
                className="w-5 h-5 text-text-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-text-dark">New Purchase Record</h1>
              <p className="text-text-light mt-1">Create a new purchase entry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vendor Name */}
            <div>
              <label htmlFor="vendorName" className="block text-sm font-semibold text-text-dark mb-2">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-smooth ${
                  fieldErrors.vendorName
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-300 focus:border-green-600'
                }`}
                placeholder="Enter vendor name"
                disabled={isSubmitting}
              />
              {fieldErrors.vendorName && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.vendorName}</p>
              )}
            </div>

            {/* Purchase Date */}
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-semibold text-text-dark mb-2">
                Purchase Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-smooth ${
                  fieldErrors.purchaseDate
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-300 focus:border-green-600'
                }`}
                disabled={isSubmitting}
              />
              {fieldErrors.purchaseDate && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.purchaseDate}</p>
              )}
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-text-dark mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-smooth ${
                    fieldErrors.amount
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-green-600'
                  }`}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
                {fieldErrors.amount && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.amount}</p>
                )}
                <p className="mt-1 text-sm text-text-light">Enter amount in decimal format (e.g., 1500.50)</p>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-semibold text-text-dark mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-smooth ${
                    fieldErrors.currency
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-green-600'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="PKR">PKR - Pakistani Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
                {fieldErrors.currency && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.currency}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-text-dark mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-smooth"
                disabled={isSubmitting}
              >
                <option value="DRAFT">Draft</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <p className="mt-1 text-sm text-text-light">
                Draft: Not yet processed | Confirmed: Completed transaction | Cancelled: Transaction cancelled
              </p>
            </div>

            {/* Reference */}
            <div>
              <label htmlFor="reference" className="block text-sm font-semibold text-text-dark mb-2">
                Reference
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-smooth"
                placeholder="Invoice number, PO number, etc."
                disabled={isSubmitting}
              />
              <p className="mt-1 text-sm text-text-light">Optional reference identifier</p>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-text-dark mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-smooth resize-none"
                placeholder="Additional notes or description"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-sm text-text-light">Optional additional information</p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-text-dark rounded-lg font-semibold hover:bg-gray-50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Purchase'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
