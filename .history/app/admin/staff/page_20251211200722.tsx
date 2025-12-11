'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function StaffManagementPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const staff = [
    { id: 1, name: 'John Smith', role: 'Manager', department: 'Operations', email: 'john@soulterglamps.com', phone: '+1 234 567 8901', status: 'active', shift: 'Morning' },
    { id: 2, name: 'Emma Wilson', role: 'Receptionist', department: 'Front Desk', email: 'emma@soulterglamps.com', phone: '+1 234 567 8902', status: 'active', shift: 'Evening' },
    { id: 3, name: 'Michael Brown', role: 'Housekeeping', department: 'Cleaning', email: 'michael@soulterglamps.com', phone: '+1 234 567 8903', status: 'active', shift: 'Morning' },
    { id: 4, name: 'Sarah Davis', role: 'Chef', department: 'Kitchen', email: 'sarah@soulterglamps.com', phone: '+1 234 567 8904', status: 'active', shift: 'Full Day' },
    { id: 5, name: 'David Martinez', role: 'Maintenance', department: 'Technical', email: 'david@soulterglamps.com', phone: '+1 234 567 8905', status: 'on-leave', shift: 'Morning' },
    { id: 6, name: 'Lisa Anderson', role: 'Guide', department: 'Activities', email: 'lisa@soulterglamps.com', phone: '+1 234 567 8906', status: 'active', shift: 'Flexible' },
    { id: 7, name: 'James Taylor', role: 'Security', department: 'Security', email: 'james@soulterglamps.com', phone: '+1 234 567 8907', status: 'active', shift: 'Night' },
    { id: 8, name: 'Emily White', role: 'Receptionist', department: 'Front Desk', email: 'emily@soulterglamps.com', phone: '+1 234 567 8908', status: 'inactive', shift: 'Morning' },
  ]

  const filteredStaff = staff.filter(member => {
    if (filter !== 'all' && member.status !== filter) return false
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase()) && !member.role.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const statusCount = {
    all: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    'on-leave': staff.filter(s => s.status === 'on-leave').length,
    inactive: staff.filter(s => s.status === 'inactive').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Staff Management</h1>
          <p className="text-text-light mt-1">Manage team members and roles</p>
        </div>
        <Link 
          href="/admin/staff/add"
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Staff Member
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', count: statusCount.all, color: 'bg-green' },
          { label: 'Active', count: statusCount.active, color: 'bg-green' },
          { label: 'On Leave', count: statusCount['on-leave'], color: 'bg-yellow' },
          { label: 'Inactive', count: statusCount.inactive, color: 'bg-red-500' },
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-green">{stat.count}</p>
                <p className="text-sm text-text-light">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
              />
              <svg className="w-5 h-5 text-text-light absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'on-leave', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth capitalize ${
                  filter === status
                    ? 'bg-yellow text-green'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                {status === 'on-leave' ? 'On Leave' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full py-12 text-center text-text-light">
            No staff members found
          </div>
        ) : (
          filteredStaff.map((member, index) => (
            <div 
              key={member.id} 
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-smooth animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Avatar & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green text-cream rounded-full flex items-center justify-center font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-green">{member.name}</h3>
                    <p className="text-sm text-text-light">{member.role}</p>
                  </div>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  member.status === 'active' 
                    ? 'bg-green/10 text-green' 
                    : member.status === 'on-leave'
                    ? 'bg-yellow/10 text-yellow'
                    : 'bg-red-50 text-red-600'
                }`}>
                  {member.status === 'on-leave' ? 'On Leave' : member.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-text-dark">{member.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-text-dark">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-text-dark">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-text-dark">{member.shift} Shift</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Link 
                  href={`/admin/staff/view/${member.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow text-green px-4 py-2 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
                >
                  View Details
                </Link>
                <button 
                  className="px-4 py-2 border-2 border-green text-green rounded-lg font-semibold hover:bg-cream transition-smooth"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
