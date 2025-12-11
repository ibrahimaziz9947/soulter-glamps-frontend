'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ViewInventoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    unit: '',
    supplier: '',
    cost: '',
    location: '',
    description: '',
  })

  const categories = [
    'Bedding', 'Bathroom', 'Kitchen', 'Outdoor', 'Maintenance',
    'Cleaning', 'Electronics', 'Furniture', 'Decor', 'Other'
  ]

  const units = [
    'pieces', 'sets', 'kg', 'liters', 'bundles', 'boxes', 'rolls', 'packs'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Inventory item added successfully!')
    router.push('/admin/inventory')
  }

  const getStatus = () => {
    if (!formData.quantity || !formData.minStock) return 'in-stock'
    const qty = parseInt(formData.quantity)
    const min = parseInt(formData.minStock)
    if (qty === 0) return 'out-of-stock'
    if (qty <= min) return 'low-stock'
    return 'in-stock'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/inventory"
          className="p-2 hover:bg-cream rounded-lg transition-smooth"
        >
          <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Add Inventory Item</h1>
          <p className="text-text-light mt-1">Add a new supply or equipment item</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Bed Linens"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent capitalize"
                  >
                    <option value="">Select unit...</option>
                    {units.map(unit => (
                      <option key={unit} value={unit} className="capitalize">{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional details about the item..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Stock & Pricing */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Stock & Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Current Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Minimum Stock Level *
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
                <p className="text-sm text-text-light mt-1">
                  You'll be notified when stock falls below this level
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Cost per Unit ($)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Total Value
                </label>
                <div className="px-4 py-3 bg-cream rounded-lg font-semibold text-green">
                  ${formData.quantity && formData.cost ? (parseFloat(formData.quantity) * parseFloat(formData.cost)).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Supplier Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="ABC Supplies Co."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Storage Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Main Storage Room - Shelf A2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Barcode/SKU */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Identification</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  SKU / Product Code
                </label>
                <input
                  type="text"
                  placeholder="BED-LIN-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Barcode
                </label>
                <input
                  type="text"
                  placeholder="123456789012"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Summary</h2>
            
            <div className="space-y-6">
              {/* Status Preview */}
              <div>
                <p className="text-sm text-text-light mb-2">Current Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                  getStatus() === 'in-stock' 
                    ? 'bg-green/10 text-green' 
                    : getStatus() === 'low-stock'
                    ? 'bg-yellow/10 text-yellow'
                    : 'bg-red-50 text-red-600'
                }`}>
                  {getStatus().replace('-', ' ')}
                </span>
              </div>

              {/* Preview Info */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                {formData.name && (
                  <div>
                    <p className="text-sm text-text-light">Item Name</p>
                    <p className="font-medium text-text-dark">{formData.name}</p>
                  </div>
                )}
                {formData.category && (
                  <div>
                    <p className="text-sm text-text-light">Category</p>
                    <p className="font-medium text-text-dark">{formData.category}</p>
                  </div>
                )}
                {formData.quantity && (
                  <div>
                    <p className="text-sm text-text-light">Quantity</p>
                    <p className="font-semibold text-green">
                      {formData.quantity} {formData.unit || 'units'}
                    </p>
                  </div>
                )}
                {formData.minStock && (
                  <div>
                    <p className="text-sm text-text-light">Min. Stock</p>
                    <p className="font-medium text-text-dark">
                      {formData.minStock} {formData.unit || 'units'}
                    </p>
                  </div>
                )}
                {formData.cost && (
                  <div>
                    <p className="text-sm text-text-light">Unit Cost</p>
                    <p className="font-medium text-green">${formData.cost}</p>
                  </div>
                )}
                {formData.quantity && formData.cost && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-text-light">Total Value</p>
                    <p className="font-serif text-2xl font-bold text-green">
                      ${(parseFloat(formData.quantity) * parseFloat(formData.cost)).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Stock Alert */}
              {formData.quantity && formData.minStock && parseInt(formData.quantity) <= parseInt(formData.minStock) && (
                <div className="p-4 bg-yellow/10 border-l-4 border-yellow rounded">
                  <div className="flex gap-2">
                    <svg className="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow text-sm">Low Stock Alert</p>
                      <p className="text-xs text-text-dark mt-1">
                        Quantity is at or below minimum stock level
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <button
                  type="submit"
                  className="w-full bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
                >
                  Add to Inventory
                </button>
                <Link
                  href="/admin/inventory"
                  className="block w-full text-center border-2 border-gray-300 text-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
