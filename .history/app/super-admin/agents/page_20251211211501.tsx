'use client'

import { useState } from 'react'

export default function AgentsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock agent data
  const agents = [
    { id: 1, name: 'Ali Raza', email: 'ali@agent.com', phone: '+92-300-1234567', totalBookings: 45, totalCommission: 112500, status: 'active', joinedDate: '2024-02-10' },
    { id: 2, name: 'Ayesha Khan', email: 'ayesha@agent.com', phone: '+92-321-9876543', totalBookings: 38, totalCommission: 95000, status: 'active', joinedDate: '2024-03-15' },
    { id: 3, name: 'Bilal Ahmed', email: 'bilal@agent.com', phone: '+92-333-5551234', totalBookings: 52, totalCommission: 130000, status: 'active', joinedDate: '2024-01-20' },
    { id: 4, name: 'Sana Malik', email: 'sana@agent.com', phone: '+92-345-7778888', totalBookings: 29, totalCommission: 72500, status: 'active', joinedDate: '2024-04-05' },
    { id: 5, name: 'Kamran Shah', email: 'kamran@agent.com', phone: '+92-300-9998877', totalBookings: 15, totalCommission: 37500, status: 'inactive', joinedDate: '2024-06-12' },
    { id: 6, name: 'Zainab Noor', email: 'zainab@agent.com', phone: '+92-321-4445566', totalBookings: 41, totalCommission: 102500, status: 'active', joinedDate: '2024-02-28' },
  ]

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalAgents = agents.length
  const activeAgents = agents.filter(a => a.status === 'active').length
  const totalCommissions = agents.reduce((sum, a) => sum + a.totalCommission, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Agent Management</h1>
          <p className="text-text-light mt-1">Manage all booking agents</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Agent
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Agents</p>
          <p className="font-serif text-3xl font-bold text-green">{totalAgents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Active Agents</p>
          <p className="font-serif text-3xl font-bold text-green">{activeAgents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Commissions Paid</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalCommissions.toLocaleString()}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Phone</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Bookings</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Commission Earned</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <span className="font-medium text-yellow">#{agent.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <span className="font-medium text-text-dark">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{agent.email}</td>
                  <td className="py-4 px-6 text-text-light text-sm">{agent.phone}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-yellow/10 text-yellow rounded-full font-semibold">
                      {agent.totalBookings}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-green">PKR {agent.totalCommission.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      agent.status === 'active' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <a 
                        href={`/super-admin/agents/${agent.id}`}
                        className="p-2 text-green hover:bg-green/10 rounded-lg transition-smooth"
                        title="View Profile"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth" title="Edit Agent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-smooth" title="Deactivate Agent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
