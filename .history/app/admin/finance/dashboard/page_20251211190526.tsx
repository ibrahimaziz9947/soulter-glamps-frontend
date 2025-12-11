'use client'

export default function FinanceDashboard() {
  const summaryCards = [
    { label: 'Total Income', value: 'PKR 2.45M', change: '+15%', icon: '💰', color: 'bg-green' },
    { label: 'Total Expenses', value: 'PKR 1.68M', change: '+8%', icon: '💸', color: 'bg-red-500' },
    { label: 'Net Profit', value: 'PKR 770K', change: '+22%', icon: '📈', color: 'bg-yellow' },
    { label: 'Pending Payables', value: 'PKR 285K', change: '6 staff', icon: '⏰', color: 'bg-orange-500' },
    { label: 'Cash on Hand', value: 'PKR 1.2M', change: 'Available', icon: '💵', color: 'bg-blue-500' },
    { label: 'Inventory Value', value: 'PKR 450K', change: '124 items', icon: '📦', color: 'bg-purple-500' },
  ]

  const quickLinks = [
    { title: 'Daily Expenses', href: '/admin/finance/expenses', icon: '📝', color: 'bg-red-500' },
    { title: 'Expense Categories', href: '/admin/finance/categories', icon: '📂', color: 'bg-orange-500' },
    { title: 'Inventory', href: '/admin/finance/inventory', icon: '📦', color: 'bg-purple-500' },
    { title: 'Purchases', href: '/admin/finance/purchases', icon: '🛒', color: 'bg-blue-500' },
    { title: 'Profit & Loss', href: '/admin/finance/profit-loss', icon: '📊', color: 'bg-yellow' },
    { title: 'Income Reports', href: '/admin/finance/income', icon: '💰', color: 'bg-green' },
    { title: 'Monthly Statements', href: '/admin/finance/monthly-statements', icon: '📋', color: 'bg-indigo-500' },
    { title: 'Staff Payables', href: '/admin/finance/staff-payables', icon: '👥', color: 'bg-pink-500' },
  ]

  const recentTransactions = [
    { id: 1, type: 'Income', description: 'Booking Payment - BK-001', amount: 75000, date: '2025-12-05', status: 'completed' },
    { id: 2, type: 'Expense', description: 'Food & Beverage Supplies', amount: -12500, date: '2025-12-05', status: 'completed' },
    { id: 3, type: 'Expense', description: 'Electricity Bill - December', amount: -18500, date: '2025-12-04', status: 'completed' },
    { id: 4, type: 'Income', description: 'Package Deal - Family Package', amount: 50000, date: '2025-12-04', status: 'completed' },
    { id: 5, type: 'Expense', description: 'Housekeeping Supplies', amount: -8500, date: '2025-12-03', status: 'pending' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">Finance Dashboard</h1>
        <p className="text-text-light mt-1">Financial overview and quick access to finance modules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <div 
            key={card.label} 
            className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
            style={{animationDelay: `${index * 0.05}s`}}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
              <span className="text-sm font-semibold text-green bg-green/10 px-3 py-1 rounded-full">
                {card.change}
              </span>
            </div>
            <h3 className="text-text-light text-sm mb-1">{card.label}</h3>
            <p className="font-serif text-3xl font-bold text-green">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Finance Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <a
              key={link.title}
              href={link.href}
              className="group p-6 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth animate-fade-in"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-smooth`}>
                {link.icon}
              </div>
              <h3 className="font-semibold text-green text-sm">{link.title}</h3>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-serif text-2xl font-bold text-green">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Description</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6 text-text-light text-sm">{transaction.date}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'Income' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-text-dark">{transaction.description}</td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold ${transaction.amount > 0 ? 'text-green' : 'text-red-500'}`}>
                      PKR {Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'completed' 
                        ? 'bg-green/10 text-green' 
                        : 'bg-yellow/10 text-yellow'
                    }`}>
                      {transaction.status}
                    </span>
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
