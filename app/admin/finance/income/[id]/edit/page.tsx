'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import IncomeForm from '@/app/components/IncomeForm'
import { getIncomeById, updateIncome } from '@/src/services/income.api'

interface Income {
  id: string
  title: string
  amount: number
  date: string
  category?: string | { id: string; name: string }
  description?: string
  reference?: string
  status?: string
}

export default function EditIncomePage() {
  const router = useRouter()
  const params = useParams()
  const incomeId = params.id as string

  const [income, setIncome] = useState<Income | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        setIsLoading(true)
        setFetchError(null)
        const response = await getIncomeById(incomeId)
        setIncome(response.data)
      } catch (error: any) {
        console.error('Failed to fetch income:', error)
        if (error.status === 404) {
          setFetchError('Income record not found')
        } else if (error.status === 403) {
          setFetchError('You do not have permission to edit this record')
        } else {
          setFetchError(error.message || 'Failed to load income record')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (incomeId) {
      fetchIncome()
    }
  }, [incomeId])

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true)
    setErrors({})
    setToast(null)

    try {
      await updateIncome(incomeId, {
        title: `${payload.source} Income - ${new Date(payload.dateReceived).toLocaleDateString()}`,
        amount: payload.amount, // Already in cents
        date: payload.dateReceived,
        category: payload.source.toLowerCase(),
        description: payload.notes || `${payload.source} income${payload.bookingId ? ` for booking ${payload.bookingId}` : ''}`,
        reference: payload.reference,
        status: payload.status as 'DRAFT' | 'SUBMITTED',
      })
      setToast({ message: 'Income updated successfully!', type: 'success' })
      setTimeout(() => { router.push(`/admin/finance/income/${incomeId}`) }, 500)
    } catch (error: any) {
      console.error('Failed to update income:', error)
      setToast({ message: error.message || 'Failed to update income record', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/finance/income/${incomeId}`)
  }

  if (toast) {
    setTimeout(() => { setToast(null) }, 4000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green border-t-transparent"></div>
          <p className="mt-4 text-text-light">Loading income record...</p>
        </div>
      </div>
    )
  }

  if (fetchError || !income) {
    return (
      <div className="min-h-screen bg-cream p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/finance/income" className="text-green hover:text-green-dark flex items-center gap-2 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Income
          </Link>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 text-lg">{fetchError}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href={`/admin/finance/income/${incomeId}`} className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-text-dark">Edit Income Record</h1>
              <p className="text-text-light mt-1">Update income entry details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <IncomeForm
            initialData={{
              source: typeof income.category === 'string' ? income.category.toUpperCase() : 'MANUAL',
              status: income.status || 'DRAFT',
              amount: income.amount,
              currency: 'PKR',
              date: income.date,
              reference: income.reference,
              notes: income.description,
              bookingId: undefined
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Update Income"
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </div>
      </div>
    </div>
  )
}
