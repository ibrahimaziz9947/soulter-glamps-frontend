'use client'

import { useState } from 'react'

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSupplier, setFilterSupplier] = useState('all')

  // Mock purchases data
  const purchases = [
    { id: 'PUR-001', item: 'Fresh Vegetables & Fruits', supplier: 'Local Market', cost: 12500, quantity: '50 kg', date: '2025-12-04', status: 'delivered' },
    { id: 'PUR-002', item: 'Cleaning Supplies Bundle', supplier: 'CleanPro Suppliers', cost: 8900, quantity: '1 set', date: '2025-12-03', status: 'delivered' },
    { id: 'PUR-003', item: 'Bed Linens & Towels', supplier: 'Textile Traders', cost: 45000, quantity: '20 sets', date: '2025-12-02', status: 'delivered' },
    { id: 'PUR-004', item: 'Kitchen Equipment - Cookware', supplier: 'Kitchen Solutions', cost: 75000, quantity: '15 items', date: '2025-12-01', status: 'pending' },
    { id: 'PUR-005', item: 'Toiletries & Amenities', supplier: 'Hospitality Supplies Co', cost: 18000, quantity: '100 units', date: '2025-11-30', status: 'delivered' },
    { id: 'PUR-006', item: 'Furniture - Outdoor Seating', supplier: 'Furniture Hub', cost: 125000, quantity: '8 sets', date: '2025-11-29', status: 'delivered' },
    { id: 'PUR-007', item: 'Lighting Fixtures', supplier: 'Lights & More', cost: 35000, quantity: '12 units', date: '2025-11-28', status: 'delivered' },
    { id: 'PUR-008', item: 'Coffee & Tea Supplies', supplier: 'Beverage Distributors', cost: 9500, quantity: '30 kg', date: '2025-11-27', status: 'delivered' },
  ]

  const suppliers = ['all', ...new Set(purchases.map(p => p.supplier))]

  const filteredPurchases = purchases.filter(purchase => {
    if (filterSupplier !== 'all' && purchase.supplier !== filterSupplier) return false
    if (searchQuery && !purchase.item.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.cost, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Purchases</h1>
          <p className="text-text-light mt-1">Track inventory purchases and supplier payments</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Purchase
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Purchases</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalPurchases.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">This Month</p>
          <p className="font-serif text-3xl font-bold text-green">{purchases.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Delivered</p>
          <p className="font-serif text-3xl font-bold text-green">{purchases.filter(p => p.status === 'delivered').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Pending</p>
          <p className="font-serif text-3xl font-bold text-yellow">{purchases.filter(p => p.status === 'pending').length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search purchases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
              />
              <svg className="w-5 h-5 text-text-light absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <select
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
            >
              <option value="all">All Suppliers</option>
              {suppliers.filter(s => s !== 'all').map((supplier) => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Purchase ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Item</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Supplier</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Cost</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-light">
                    No purchases found
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6">
                      <span className="font-medium text-yellow">{purchase.id}</span>
                    </td>
                    <td className="py-4 px-6 text-text-dark">{purchase.item}</td>
                    <td className="py-4 px-6 text-text-dark">{purchase.supplier}</td>
                    <td className="py-4 px-6 text-text-light">{purchase.quantity}</td>
                    <td className="py-4 px-6 font-semibold text-green">PKR {purchase.cost.toLocaleString()}</td>
                    <td className="py-4 px-6 text-text-light text-sm">{purchase.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        purchase.status === 'delivered' 
                          ? 'bg-green/10 text-green' 
                          : 'bg-yellow/10 text-yellow'
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                          title="View"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
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
      </div>
    </div>
  )
}
