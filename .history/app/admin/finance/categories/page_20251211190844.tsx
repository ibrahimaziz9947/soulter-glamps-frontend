'use client'

import { useState } from 'react'

export default function CategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock categories data
  const categories = [
    { id: 'CAT-001', name: 'Food & Beverage', description: 'Restaurant supplies, groceries, beverages', totalExpenses: 145000, color: 'bg-green' },
    { id: 'CAT-002', name: 'Utilities', description: 'Electricity, water, gas, internet', totalExpenses: 78000, color: 'bg-blue-500' },
    { id: 'CAT-003', name: 'Housekeeping', description: 'Cleaning supplies, toiletries, amenities', totalExpenses: 56000, color: 'bg-purple-500' },
    { id: 'CAT-004', name: 'Maintenance', description: 'Repairs, equipment, tools', totalExpenses: 125000, color: 'bg-orange-500' },
    { id: 'CAT-005', name: 'Transportation', description: 'Fuel, vehicle maintenance, transport services', totalExpenses: 45000, color: 'bg-yellow' },
    { id: 'CAT-006', name: 'Marketing', description: 'Advertising, promotions, social media', totalExpenses: 85000, color: 'bg-pink-500' },
    { id: 'CAT-007', name: 'Salaries', description: 'Staff salaries and wages', totalExpenses: 450000, color: 'bg-red-500' },
    { id: 'CAT-008', name: 'Administrative', description: 'Office supplies, software, subscriptions', totalExpenses: 32000, color: 'bg-gray-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Expense Categories</h1>
          <p className="text-text-light mt-1">Organize and manage expense categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Categories</p>
          <p className="font-serif text-3xl font-bold text-green">{categories.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Expenses Tracked</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {categories.reduce((sum, cat) => sum + cat.totalExpenses, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Active Categories</p>
          <p className="font-serif text-3xl font-bold text-green">{categories.length}</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={category.id} className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-yellow hover:bg-cream rounded-lg transition-smooth" title="Edit">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2 text-red-500 hover:bg-cream rounded-lg transition-smooth" title="Delete">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <h3 className="font-serif text-xl font-bold text-green mb-2">{category.name}</h3>
            <p className="text-text-light text-sm mb-4">{category.description}</p>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-text-light text-xs mb-1">Total Expenses</p>
              <p className="font-semibold text-green text-lg">PKR {category.totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-slide-up">
            <h3 className="font-serif text-2xl font-bold text-green mb-4">Add New Category</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Category Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                  placeholder="e.g., Office Supplies"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                  placeholder="Brief description of this category"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Color</label>
                <div className="flex gap-2">
                  {['bg-green', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow', 'bg-pink-500', 'bg-red-500', 'bg-gray-500'].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 ${color} rounded-lg border-2 border-transparent hover:border-green transition-smooth`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border-2 border-gray-300 text-text-dark px-4 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-yellow text-green px-4 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
