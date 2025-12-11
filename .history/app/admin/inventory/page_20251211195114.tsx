'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function InventoryManagementPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const inventory = [
    { id: 1, name: 'Bed Linens', category: 'Bedding', quantity: 45, minStock: 30, unit: 'sets', status: 'in-stock', lastUpdated: '2025-12-01' },
    { id: 2, name: 'Towels', category: 'Bathroom', quantity: 80, minStock: 50, unit: 'pieces', status: 'in-stock', lastUpdated: '2025-12-02' },
    { id: 3, name: 'Firewood', category: 'Outdoor', quantity: 12, minStock: 20, unit: 'bundles', status: 'low-stock', lastUpdated: '2025-12-03' },
    { id: 4, name: 'Coffee Beans', category: 'Kitchen', quantity: 8, minStock: 15, unit: 'kg', status: 'low-stock', lastUpdated: '2025-12-03' },
    { id: 5, name: 'Cleaning Supplies', category: 'Maintenance', quantity: 0, minStock: 10, unit: 'sets', status: 'out-of-stock', lastUpdated: '2025-11-28' },
    { id: 6, name: 'Pillows', category: 'Bedding', quantity: 52, minStock: 40, unit: 'pieces', status: 'in-stock', lastUpdated: '2025-12-01' },
    { id: 7, name: 'Toilet Paper', category: 'Bathroom', quantity: 35, minStock: 30, unit: 'rolls', status: 'in-stock', lastUpdated: '2025-12-04' },
    { id: 8, name: 'BBQ Equipment', category: 'Outdoor', quantity: 3, minStock: 5, unit: 'sets', status: 'low-stock', lastUpdated: '2025-12-02' },
    { id: 9, name: 'Kitchen Utensils', category: 'Kitchen', quantity: 25, minStock: 20, unit: 'sets', status: 'in-stock', lastUpdated: '2025-11-30' },
    { id: 10, name: 'Light Bulbs', category: 'Maintenance', quantity: 18, minStock: 15, unit: 'pieces', status: 'in-stock', lastUpdated: '2025-12-01' },
  ]

  const filteredInventory = inventory.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.category.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const statusCount = {
    all: inventory.length,
    'in-stock': inventory.filter(i => i.status === 'in-stock').length,
    'low-stock': inventory.filter(i => i.status === 'low-stock').length,
    'out-of-stock': inventory.filter(i => i.status === 'out-of-stock').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Inventory Management</h1>
          <p className="text-text-light mt-1">Track and manage all supplies and equipment</p>
        </div>
        <Link 
          href="/admin/inventory/add"
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', count: statusCount.all, color: 'bg-green' },
          { label: 'In Stock', count: statusCount['in-stock'], color: 'bg-green' },
          { label: 'Low Stock', count: statusCount['low-stock'], color: 'bg-yellow' },
          { label: 'Out of Stock', count: statusCount['out-of-stock'], color: 'bg-red-500' },
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
                placeholder="Search by item name or category..."
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
            {['all', 'in-stock', 'low-stock', 'out-of-stock'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth capitalize ${
                  filter === status
                    ? 'bg-yellow text-green'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Item Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Min. Stock</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Unit</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Last Updated</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-light">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6">
                      <span className="font-medium text-text-dark">{item.name}</span>
                    </td>
                    <td className="py-4 px-6 text-text-light">{item.category}</td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${
                        item.quantity === 0 
                          ? 'text-red-600' 
                          : item.quantity <= item.minStock
                          ? 'text-yellow'
                          : 'text-green'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-light">{item.minStock}</td>
                    <td className="py-4 px-6 text-text-dark capitalize">{item.unit}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        item.status === 'in-stock' 
                          ? 'bg-green/10 text-green' 
                          : item.status === 'low-stock'
                          ? 'bg-yellow/10 text-yellow'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-light text-sm">{item.lastUpdated}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/admin/inventory/view/${item.id}`}
                          className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button 
                          className="p-2 text-yellow hover:bg-cream rounded-lg transition-smooth"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 text-red-500 hover:bg-cream rounded-lg transition-smooth"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-text-light">
            Showing {filteredInventory.length} of {inventory.length} items
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-text-dark hover:bg-cream transition-smooth disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-yellow text-green rounded-lg font-semibold">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-text-dark hover:bg-cream transition-smooth">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
