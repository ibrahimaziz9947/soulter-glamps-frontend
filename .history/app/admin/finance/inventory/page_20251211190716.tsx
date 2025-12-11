'use client'

export default function InventoryPage() {
  const inventoryItems = [
    { id: 1, name: 'Bed Linens (King)', category: 'Bedding', currentStock: 45, minStock: 30, maxStock: 60, unit: 'sets', status: 'good', lastRestocked: '2025-11-28' },
    { id: 2, name: 'Towels (Bath)', category: 'Bedding', currentStock: 120, minStock: 80, maxStock: 150, unit: 'pcs', status: 'good', lastRestocked: '2025-11-30' },
    { id: 3, name: 'Toilet Paper', category: 'Housekeeping', currentStock: 15, minStock: 20, maxStock: 50, unit: 'packs', status: 'low', lastRestocked: '2025-11-20' },
    { id: 4, name: 'Cleaning Supplies', category: 'Housekeeping', currentStock: 8, minStock: 15, maxStock: 30, unit: 'kits', status: 'critical', lastRestocked: '2025-11-15' },
    { id: 5, name: 'Coffee (Ground)', category: 'Kitchen', currentStock: 25, minStock: 20, maxStock: 40, unit: 'kg', status: 'good', lastRestocked: '2025-12-01' },
    { id: 6, name: 'Tea Bags', category: 'Kitchen', currentStock: 180, minStock: 100, maxStock: 200, unit: 'boxes', status: 'good', lastRestocked: '2025-12-02' },
    { id: 7, name: 'Hand Soap', category: 'Housekeeping', currentStock: 12, minStock: 20, maxStock: 40, unit: 'bottles', status: 'low', lastRestocked: '2025-11-25' },
    { id: 8, name: 'Firewood', category: 'Outdoor', currentStock: 150, minStock: 100, maxStock: 200, unit: 'bundles', status: 'good', lastRestocked: '2025-12-03' },
  ]

  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter(item => item.status === 'low' || item.status === 'critical').length
  const totalValue = 450000 // Mock value

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Inventory Management</h1>
          <p className="text-text-light mt-1">Track and manage inventory stock levels</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Inventory Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Items</p>
          <p className="font-serif text-3xl font-bold text-green">{totalItems}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Low Stock Items</p>
          <p className="font-serif text-3xl font-bold text-orange-500">{lowStockItems}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Inventory Value</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Item Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Current Stock</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Min/Max</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Last Restocked</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6">
                    <span className="font-medium text-yellow">#{item.id}</span>
                  </td>
                  <td className="py-4 px-6 font-medium text-text-dark">{item.name}</td>
                  <td className="py-4 px-6 text-text-light text-sm">{item.category}</td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-green">{item.currentStock} {item.unit}</span>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{item.minStock}/{item.maxStock}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'good' 
                        ? 'bg-green/10 text-green' 
                        : item.status === 'low'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-text-light text-sm">{item.lastRestocked}</td>
                  <td className="py-4 px-6">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
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
