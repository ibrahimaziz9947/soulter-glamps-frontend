'use client'

import { useState } from 'react'

export default function AdminAgentsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock agent data
  const agents = [
    { id: 1, name: 'Ali Raza', email: 'ali@agent.com', phone: '+92-300-1234567', totalBookings: 45, totalCommission: 112500, status: 'active', joinedDate: '2024-02-10' },
    { id: 2, name: 'Ayesha Khan', email: 'ayesha@agent.com', phone: '+92-321-9876543', totalBookings: 38, totalCommission: 95000, status: 'active', joinedDate: '2024-03-15' },
    { id: 3, name: 'Bilal Ahmed', email: 'bilal@agent.com', phone: '+92-333-5551234', totalBookings: 52, totalCommission: 130000, status: 'active', joinedDate: '2024-01-20' },
    { id: 4, name: 'Sana Malik', email: 'sana@agent.com', phone: '+92-345-7778888', totalBookings: 29, totalCommission: 72500, status: 'active', joinedDate: '2024-04-05' },
    { id: 5, name: 'Kamran Shah', email: 'kamran@agent.com', phone: '+92-300-9998877', totalBookings: 15, totalCommission: 37500, status: 'inactive', joinedDate: '2024-06-12' },
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green mb-2">Agent Management</h1>
            <p className="text-text-light">Manage booking agents and their performance</p>
          </div>
          <button className="px-6 py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition-smooth">
            + Add New Agent
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2 font-medium">Total Agents</p>
          <p className="text-3xl font-bold text-green">{totalAgents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2 font-medium">Active Agents</p>
          <p className="text-3xl font-bold text-green">{activeAgents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2 font-medium">Total Commissions</p>
          <p className="text-3xl font-bold text-yellow">PKR {totalCommissions.toLocaleString()}</p>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search agents by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50 border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">ID</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Name</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Email</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Phone</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Bookings</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Commission</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Status</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-green uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-100 hover:bg-cream/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-yellow">AG-{agent.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center text-white font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-text-dark">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-light">{agent.email}</td>
                  <td className="py-4 px-4 text-sm text-text-light">{agent.phone}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-green">{agent.totalBookings}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-yellow">PKR {agent.totalCommission.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      agent.status === 'active' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {agent.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <a 
                      href={`/admin/agents/${agent.id}`}
                      className="px-4 py-2 bg-green/10 text-green rounded-lg text-sm font-semibold hover:bg-green hover:text-white transition-smooth"
                    >
                      View Profile
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-light text-lg">No agents found</p>
          </div>
        )}
      </div>
    </div>
  )
}
