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

      {/* Commissions Cards */}
      {!loading && !error && commissions.length > 0 && (
        <div className="space-y-4">
          {commissions.map((commission) => (
            <div 
              key={commission.id} 
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section: Commission Details */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-light uppercase tracking-wide mb-1">Agent ID</p>
                    <p className="text-sm font-medium text-text-dark">{commission.agentId.slice(0, 8)}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-text-light uppercase tracking-wide mb-1">Booking ID</p>
                    <p className="text-sm font-medium text-yellow">{commission.bookingId.slice(0, 8)}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-text-light uppercase tracking-wide mb-1">Glamp</p>
                    <p className="text-sm font-medium text-text-dark">
                      {commission.booking?.glamp?.name || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-text-light uppercase tracking-wide mb-1">Customer</p>
                    <p className="text-sm font-medium text-text-dark">
                      {commission.booking?.customerName || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-text-light uppercase tracking-wide mb-1">Created Date</p>
                    <p className="text-sm font-medium text-text-dark">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right Section: Amount & Status */}
                <div className="lg:text-right space-y-3 lg:min-w-[200px]">
                  <div>
                    <p className="text-xs text-text-light uppercase tracking-wide mb-1">Commission Amount</p>
                    <p className="text-2xl font-bold text-green">
                      PKR {Number(commission.amount).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        commission.status === 'PAID'
                          ? 'bg-green text-white'
                          : 'bg-yellow text-green'
                      }`}
                    >
                      {commission.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
