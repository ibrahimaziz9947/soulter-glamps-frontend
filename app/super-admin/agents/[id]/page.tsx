'use client'

import { useParams, useRouter } from 'next/navigation'

export default function SuperAdminAgentProfileView() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id

  // Mock agent data - in real app, fetch based on agentId
  const agentData = {
    id: agentId,
    name: 'Ahmed Khan',
    email: 'ahmed.khan@soulterglamps.com',
    phone: '+92 300 1234567',
    joinDate: 'January 15, 2024',
    agentId: `AG-${agentId}`,
    totalBookings: 38,
    totalCommission: 48000,
    pendingCommission: 12500,
    activeCustomers: 24,
    status: 'Active',
    address: 'House 123, Street 45, Islamabad, Pakistan',
    cnic: '12345-1234567-1',
    bankAccount: 'HBL - 1234567890',
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-green to-green-dark rounded-lg shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => router.back()}
              className="text-cream/80 hover:text-white mb-3 flex items-center gap-2 text-sm"
            >
              ← Back to Agents List
            </button>
            <h1 className="text-4xl font-bold mb-2">Agent Profile</h1>
            <p className="text-cream/90">Viewing agent information and performance</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-yellow text-green rounded-lg font-bold hover:bg-yellow/90 transition-smooth shadow-lg">
              ✏️ Edit Agent
            </button>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-smooth shadow-lg">
              🗑️ Deactivate
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-6 mb-8 pb-6 border-b-2 border-gray-200">
          <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {agentData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-green mb-1">{agentData.name}</h2>
            <p className="text-text-light">Sales Agent</p>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-yellow font-semibold">Agent ID: {agentData.agentId}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                agentData.status === 'Active' ? 'bg-green/10 text-green' : 'bg-red-100 text-red-600'
              }`}>
                {agentData.status}
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-green mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Email */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg">
            <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">EMAIL ADDRESS</p>
              <p className="text-sm font-medium text-text-dark break-all">{agentData.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg">
            <div className="w-12 h-12 bg-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">PHONE NUMBER</p>
              <p className="text-sm font-medium text-text-dark">{agentData.phone}</p>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">JOINED DATE</p>
              <p className="text-sm font-medium text-text-dark">{agentData.joinDate}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg md:col-span-2">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">ADDRESS</p>
              <p className="text-sm font-medium text-text-dark">{agentData.address}</p>
            </div>
          </div>

          {/* CNIC */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">CNIC NUMBER</p>
              <p className="text-sm font-medium text-text-dark">{agentData.cnic}</p>
            </div>
          </div>

          {/* Bank Account */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg md:col-span-2">
            <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">BANK ACCOUNT</p>
              <p className="text-sm font-medium text-text-dark">{agentData.bankAccount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div>
        <h2 className="text-2xl font-bold text-green mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center text-3xl shadow-md">
                📅
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-green">{agentData.totalBookings}</p>
            <p className="text-xs text-green/60 mt-2">All-time bookings</p>
          </div>

          {/* Total Commission Earned */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-green rounded-lg flex items-center justify-center text-3xl shadow-md">
                💰
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">Total Commission Earned</p>
            <p className="text-3xl font-bold text-green">PKR {agentData.totalCommission.toLocaleString()}</p>
            <p className="text-xs text-green/60 mt-2">Lifetime earnings</p>
          </div>

          {/* Pending Commission */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-yellow rounded-lg flex items-center justify-center text-3xl shadow-md">
                ⏳
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">Pending Commission</p>
            <p className="text-3xl font-bold text-yellow">PKR {agentData.pendingCommission.toLocaleString()}</p>
            <p className="text-xs text-yellow/60 mt-2">Awaiting payment</p>
          </div>

          {/* Active Customers */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center text-3xl shadow-md">
                👥
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">Active Customers</p>
            <p className="text-3xl font-bold text-green">{agentData.activeCustomers}</p>
            <p className="text-xs text-green/60 mt-2">Total customers brought</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green mb-6 pb-4 border-b-2 border-gray-200">
          Recent Bookings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50 border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-bold text-green">Booking ID</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-green">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-green">Date</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-green">Commission</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-green">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-cream/30">
                <td className="py-3 px-4 font-bold text-green">BK-2401</td>
                <td className="py-3 px-4">Ali Hassan</td>
                <td className="py-3 px-4 text-sm">2025-12-15</td>
                <td className="py-3 px-4 font-bold text-yellow">PKR 2,500</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green/10 text-green">Confirmed</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-cream/30">
                <td className="py-3 px-4 font-bold text-green">BK-2402</td>
                <td className="py-3 px-4">Sara Ahmed</td>
                <td className="py-3 px-4 text-sm">2025-12-18</td>
                <td className="py-3 px-4 font-bold text-yellow">PKR 3,200</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow/20 text-yellow">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
