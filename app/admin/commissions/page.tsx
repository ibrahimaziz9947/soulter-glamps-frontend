'use client'

import { useEffect, useState } from 'react'
import { getAllCommissions, type Commission } from '@/src/services/commissions.api'

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        setLoading(true)
        const data = await getAllCommissions()
        setCommissions(data)
      } catch (err: any) {
        console.error('Failed to fetch commissions:', err)
        setError(err.message || 'Failed to load commissions')
      } finally {
        setLoading(false)
      }
    }

    fetchCommissions()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Agent Commissions</h1>
          <p className="text-text-light mt-1">Manage and review agent commission payments</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="animate-pulse">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-xl text-text-dark font-semibold mb-2">
              Loading Commissions
            </p>
            <p className="text-text-light">
              Fetching commission data from backend...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-red-50 border border-red-300 rounded-lg p-6">
            <p className="text-red-700 font-semibold mb-2">⚠️ Error Loading Commissions</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && commissions.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-xl text-text-dark font-semibold mb-2">
            No Commissions Found
          </p>
          <p className="text-text-light">
            No agent commissions have been generated yet.
          </p>
        </div>
      )}

      {/* Data Display - Simple List for Verification */}
      {!loading && !error && commissions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-green mb-4">
            Commission Data ({commissions.length} records)
          </h2>
          
          <div className="space-y-4">
            {commissions.map((commission) => (
              <div 
                key={commission.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-cream/30 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600">Commission ID:</span>{' '}
                    <span className="text-gray-900">{commission.id.slice(0, 8)}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Amount:</span>{' '}
                    <span className="text-green font-bold">PKR {Number(commission.amount).toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      commission.status === 'PAID' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-yellow/20 text-yellow'
                    }`}>
                      {commission.status}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Created:</span>{' '}
                    <span className="text-gray-900">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Agent ID:</span>{' '}
                    <span className="text-gray-900">{commission.agentId.slice(0, 8)}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-600">Booking ID:</span>{' '}
                    <span className="text-gray-900">{commission.bookingId.slice(0, 8)}</span>
                  </div>
                  
                  {commission.booking && (
                    <>
                      <div>
                        <span className="font-semibold text-gray-600">Customer:</span>{' '}
                        <span className="text-gray-900">{commission.booking.customerName}</span>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-600">Glamp:</span>{' '}
                        <span className="text-gray-900">
                          {commission.booking.glamp?.name || 'N/A'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-600">Check-in:</span>{' '}
                        <span className="text-gray-900">
                          {new Date(commission.booking.checkInDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-600">Booking Total:</span>{' '}
                        <span className="text-gray-900">
                          PKR {Number(commission.booking.totalAmount).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Raw JSON for debugging */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              📄 View Raw JSON Data
            </summary>
            <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(commissions, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
