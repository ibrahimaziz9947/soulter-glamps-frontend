'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import IncomeForm from '@/app/components/IncomeForm'
import { createIncome } from '@/src/services/income.api'

export default function NewIncomePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (payload: {
    source: string
    status: string
    amount: number
    currency: string
    dateReceived: string
    reference?: string
    notes?: string
    bookingId?: string
  }) => {
    setIsSubmitting(true)
    setErrors({})
    setToast(null)

    try {
      // TEMP DEBUG: Log form values and payload
      console.log('[Income Form Values]', payload)
      
      // Validate currency before API call
      if (!payload.currency || !payload.currency.trim()) {
        setToast({
          message: 'Currency is required',
          type: 'error',
        })
        setIsSubmitting(false)
        return
      }

      const apiPayload = {
        title: `${payload.source} Income - ${new Date(payload.dateReceived).toLocaleDateString()}`,
        amount: payload.amount, // Already in cents
        currency: payload.currency.trim(), // <-- FIX: Include currency
        date: payload.dateReceived,
        category: payload.source.toLowerCase(),
        description: payload.notes || `${payload.source} income${payload.bookingId ? ` for booking ${payload.bookingId}` : ''}`,
        reference: payload.reference,
        status: payload.status as 'DRAFT' | 'SUBMITTED',
      }

      // TEMP DEBUG: Log final API payload
      console.log('[Income Submit Payload]', apiPayload)

      const response = await createIncome(apiPayload)

      // Show success toast
      setToast({
        message: 'Income created successfully!',
        type: 'success',
      })

      // Redirect to detail page after short delay
      setTimeout(() => {
        router.push(`/admin/finance/income/${response.data.id}`)
      }, 500)
    } catch (error: any) {
      console.error('Failed to create income:', error)

      // Handle validation errors
      if (error.errors && typeof error.errors === 'object') {
        setErrors(error.errors)
        setToast({
          message: 'Please fix the validation errors',
          type: 'error',
        })
      } else if (error.status === 401) {
        setToast({
          message: 'Please log in to create income records',
          type: 'error',
        })
      } else if (error.status === 403) {
        setToast({
          message: 'You do not have permission to create income records',
          type: 'error',
        })
      } else {
        setToast({
          message: error.message || 'Failed to create income record',
          type: 'error',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/finance/income')
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
              href="/admin/finance/income"
              className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
              title="Back to Income"
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
              <h1 className="text-3xl font-bold text-text-dark">New Income Record</h1>
              <p className="text-text-light mt-1">Create a new income entry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <IncomeForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Create Income"
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </div>
      </div>
    </div>
  )
}
