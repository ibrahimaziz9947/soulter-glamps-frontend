'use client'

import { useState } from 'react'

export default function AdminsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock admin data
  const admins = [
    { id: 1, name: 'Ahmad Khan', email: 'ahmad@soulterglamps.com', role: 'Manager', status: 'active', lastLogin: '2025-12-05 10:30 AM', createdAt: '2024-01-15' },
    { id: 2, name: 'Sarah Ali', email: 'sarah@soulterglamps.com', role: 'Admin', status: 'active', lastLogin: '2025-12-04 03:45 PM', createdAt: '2024-03-20' },
    { id: 3, name: 'Hassan Malik', email: 'hassan@soulterglamps.com', role: 'Admin', status: 'active', lastLogin: '2025-12-03 09:15 AM', createdAt: '2024-05-10' },
    { id: 4, name: 'Fatima Noor', email: 'fatima@soulterglamps.com', role: 'Admin', status: 'inactive', lastLogin: '2025-11-28 02:20 PM', createdAt: '2024-07-05' },
    { id: 5, name: 'Usman Shah', email: 'usman@soulterglamps.com', role: 'Admin', status: 'active', lastLogin: '2025-12-05 08:00 AM', createdAt: '2024-09-12' },
  ]

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalAdmins = admins.length
  const activeAdmins = admins.filter(a => a.status === 'active').length
  const inactiveAdmins = admins.filter(a => a.status === 'inactive').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Admin Management</h1>
          <p className="text-text-light mt-1">Manage all administrator accounts</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Admins</p>
          <p className="font-serif text-3xl font-bold text-green">{totalAdmins}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Active</p>
          <p className="font-serif text-3xl font-bold text-green">{activeAdmins}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Inactive</p>
          <p className="font-serif text-3xl font-bold text-red-500">{inactiveAdmins}</p>
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

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Last Login</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <span className="font-medium text-yellow">#{admin.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center text-white font-bold">
                        {admin.name.charAt(0)}
                      </div>
                      <span className="font-medium text-text-dark">{admin.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{admin.email}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      admin.status === 'active' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{admin.lastLogin}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-smooth">
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
