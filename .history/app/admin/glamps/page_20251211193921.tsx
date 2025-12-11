'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function GlampsManagementPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const glamps = [
    { id: 1, name: 'Luxury Safari Tent', category: 'tent', price: 250, capacity: 4, status: 'available', image: '/images/safari-tent.jpg', bookings: 12 },
    { id: 2, name: 'Geodesic Dome', category: 'dome', price: 300, capacity: 2, status: 'available', image: '/images/dome.jpg', bookings: 8 },
    { id: 3, name: 'Treehouse Suite', category: 'treehouse', price: 350, capacity: 4, status: 'booked', image: '/images/treehouse.jpg', bookings: 15 },
    { id: 4, name: 'Woodland Cabin', category: 'cabin', price: 200, capacity: 3, status: 'available', image: '/images/cabin.jpg', bookings: 10 },
    { id: 5, name: 'Riverside Yurt', category: 'yurt', price: 180, capacity: 3, status: 'maintenance', image: '/images/yurt.jpg', bookings: 6 },
    { id: 6, name: 'Mountain View Pod', category: 'pod', price: 220, capacity: 2, status: 'available', image: '/images/pod.jpg', bookings: 9 },
  ]

  const filteredGlamps = glamps.filter(glamp => {
    if (filter !== 'all' && glamp.status !== filter) return false
    if (searchQuery && !glamp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const statusCount = {
    all: glamps.length,
    available: glamps.filter(g => g.status === 'available').length,
    booked: glamps.filter(g => g.status === 'booked').length,
    maintenance: glamps.filter(g => g.status === 'maintenance').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Glamps Management</h1>
          <p className="text-text-light mt-1">Manage all glamping accommodations</p>
        </div>
        <Link 
          href="/admin/glamps/add"
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Glamp
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Glamps', count: statusCount.all, color: 'bg-green' },
          { label: 'Available', count: statusCount.available, color: 'bg-green' },
          { label: 'Currently Booked', count: statusCount.booked, color: 'bg-yellow' },
          { label: 'Under Maintenance', count: statusCount.maintenance, color: 'bg-red-500' },
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
                placeholder="Search by glamp name..."
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
            {['all', 'available', 'booked', 'maintenance'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth capitalize ${
                  filter === status
                    ? 'bg-yellow text-green'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Glamps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGlamps.length === 0 ? (
          <div className="col-span-full py-12 text-center text-text-light">
            No glamps found
          </div>
        ) : (
          filteredGlamps.map((glamp, index) => (
            <div 
              key={glamp.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-smooth animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Image */}
              <div className="relative h-48 bg-cream">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    glamp.status === 'available' 
                      ? 'bg-green/90 text-cream' 
                      : glamp.status === 'booked'
                      ? 'bg-yellow/90 text-green'
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {glamp.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-serif text-xl font-bold text-green mb-2">{glamp.name}</h3>
                  <p className="text-sm text-text-light capitalize">{glamp.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-text-light mb-1">Price per Night</p>
                    <p className="font-semibold text-green">${glamp.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light mb-1">Capacity</p>
                    <p className="font-semibold text-text-dark">{glamp.capacity} Guests</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light mb-1">Total Bookings</p>
                    <p className="font-semibold text-text-dark">{glamp.bookings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light mb-1">Revenue</p>
                    <p className="font-semibold text-green">${glamp.price * glamp.bookings}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link 
                    href={`/admin/glamps/edit/${glamp.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow text-green px-4 py-2 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button 
                    className="px-4 py-2 border-2 border-green text-green rounded-lg font-semibold hover:bg-cream transition-smooth"
                  >
                    View
                  </button>
                  <button 
                    className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-smooth"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
