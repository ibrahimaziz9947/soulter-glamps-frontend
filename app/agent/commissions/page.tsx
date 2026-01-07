'use client'

import { useState, useEffect } from 'react'
import { getAgentCommissions, type Commission } from '@/src/services/commissions.api'

export default function AgentCommissions() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'PAID' | 'UNPAID'>('all')
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* =========================
     FETCH COMMISSIONS
  ========================= */
  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        setLoading(true)
        const data = await getAgentCommissions()
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

  /* =========================
     FILTER & CALCULATIONS
  ========================= */
  const filteredCommissions = filterStatus === 'all'
    ? commissions
    : commissions.filter(c => c.status === filterStatus)

  const totalEarned = commissions
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  const totalPending = commissions
    .filter(c => c.status === 'UNPAID')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green mb-2">Commission History</h1>
        <p className="text-text-light">Track all your commission earnings</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="animate-pulse">
            <div className="text-text-light text-lg">Loading commissions...</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-6">
          <p className="text-red-700 font-semibold">⚠️ Error: {error}</p>
        </div>
      )}

      {/* Content - Only show when not loading */}
      {!loading && !error && (
        <>
          {/* Total Commission Summary Card */}
          <div className="bg-gradient-to-r from-green to-green-dark rounded-lg shadow-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cream/80 text-lg mb-2">Total Commission Earned</p>
                <p className="text-5xl font-bold mb-4">PKR {totalEarned.toLocaleString()}</p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-cream/70">Pending: </span>
                    <span className="font-bold text-yellow">PKR {totalPending.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-cream/70">Total Bookings: </span>
                    <span className="font-bold">{commissions.length}</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-6xl">💰</span>
                </div>
              </div>
            </div>
          </div>

      {/* Commission Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-text-dark">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'PAID' | 'UNPAID')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
            >
              <option value="all">All Commissions</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>

          <button className="px-6 py-2 bg-green text-cream rounded-lg font-semibold hover:bg-green-dark transition-smooth">
            📥 Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50 border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Booking ID</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Glamp</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Check-in</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Commission</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map((commission) => (
                <tr key={commission.id} className="border-b border-gray-100 hover:bg-cream/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-green text-sm">
                      {commission.bookingId.slice(0, 8)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-text-dark">
                      {commission.booking?.customerName || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-text-dark">
                      {commission.booking?.glamp?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-text-light">
                      {commission.booking?.checkInDate 
                        ? new Date(commission.booking.checkInDate).toLocaleDateString() 
                        : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-yellow text-lg">
                      PKR {Number(commission.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                      commission.status === 'PAID' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-yellow/20 text-yellow'
                    }`}>
                      {commission.status === 'PAID' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCommissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-light text-lg">No commissions found</p>
          </div>
        )}
      </div>

      {/* Commission Info */}
      <div className="bg-yellow/10 border border-yellow rounded-lg p-6">
        <h3 className="font-bold text-green mb-3">📌 Commission Policy</h3>
        <ul className="space-y-2 text-sm text-text-dark">
          <li>✓ Standard commission rate: <strong>10%</strong> of booking amount</li>
          <li>✓ Commissions are paid within <strong>7 days</strong> after customer check-in</li>
          <li>✓ Cancelled bookings do not earn commission</li>
          <li>✓ Payment is processed via bank transfer to your registered account</li>
        </ul>
      </div>
        </>
      )}
    </div>
  )
}
