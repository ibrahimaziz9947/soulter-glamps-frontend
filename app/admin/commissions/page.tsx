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

      {/* Commissions Table */}
      {!loading && !error && commissions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="py-4 px-6 text-left">Agent</th>
                  <th className="py-4 px-6 text-left">Booking ID</th>
                  <th className="py-4 px-6 text-left">Glamp</th>
                  <th className="py-4 px-6 text-left">Commission</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="border-b hover:bg-cream/50">
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="font-medium text-text-dark">
                          {commission.agentId.slice(0, 8)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-yellow font-medium">
                        {commission.bookingId.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {commission.booking?.glamp?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-green">
                        PKR {Number(commission.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          commission.status === 'PAID'
                            ? 'bg-green/10 text-green'
                            : 'bg-yellow/10 text-yellow'
                        }`}
                      >
                        {commission.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-text-light">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
