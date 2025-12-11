'use client'

export default function SuperAdminFinancePage() {
  const financialStats = [
    { label: 'Total Revenue', value: 'PKR 18.5M', change: '+25%', icon: '💰', color: 'bg-green' },
    { label: 'Total Expenses', value: 'PKR 12.8M', change: '+12%', icon: '💸', color: 'bg-red-500' },
    { label: 'Net Profit', value: 'PKR 5.7M', change: '+38%', icon: '📈', color: 'bg-yellow' },
    { label: 'Agent Commissions', value: 'PKR 550K', change: '+15%', icon: '💳', color: 'bg-purple-500' },
    { label: 'Pending Payments', value: 'PKR 185K', change: '12 pending', icon: '⏰', color: 'bg-orange-500' },
    { label: 'Cash on Hand', value: 'PKR 2.3M', change: 'Available', icon: '💵', color: 'bg-blue-500' },
  ]

  const monthlyBreakdown = [
    { month: 'July', revenue: 1450000, expenses: 980000, profit: 470000 },
    { month: 'August', revenue: 1520000, expenses: 1020000, profit: 500000 },
    { month: 'September', revenue: 1380000, expenses: 950000, profit: 430000 },
    { month: 'October', revenue: 1650000, expenses: 1100000, profit: 550000 },
    { month: 'November', revenue: 1780000, expenses: 1180000, profit: 600000 },
    { month: 'December', revenue: 2050000, expenses: 1350000, profit: 700000 },
  ]

  const revenueBySource = [
    { source: 'Direct Bookings', amount: 11100000, percentage: 60 },
    { source: 'Agent Bookings', amount: 5550000, percentage: 30 },
    { source: 'Package Deals', amount: 1850000, percentage: 10 },
  ]

  const maxRevenue = Math.max(...monthlyBreakdown.map(m => m.revenue))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Financial Overview</h1>
          <p className="text-text-light mt-1">High-level financial insights and metrics</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Financial Report
        </button>
      </div>

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financialStats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
            style={{animationDelay: `${index * 0.05}s`}}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <span className="text-sm font-semibold text-green bg-green/10 px-3 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-text-light text-sm mb-1">{stat.label}</h3>
            <p className="font-serif text-3xl font-bold text-green">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Breakdown Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Monthly Financial Trend (Last 6 Months)</h2>
        <div className="space-y-4">
          {monthlyBreakdown.map((month) => {
            const revenuePercentage = (month.revenue / maxRevenue) * 100
            const expensePercentage = (month.expenses / maxRevenue) * 100
            
            return (
              <div key={month.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-dark font-medium w-24">{month.month}</span>
                  <div className="flex gap-6 text-sm">
                    <span className="text-green">Revenue: PKR {month.revenue.toLocaleString()}</span>
                    <span className="text-red-500">Expenses: PKR {month.expenses.toLocaleString()}</span>
                    <span className="text-yellow font-semibold">Profit: PKR {month.profit.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-cream rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-green h-full rounded-full transition-all duration-500"
                      style={{ width: `${revenuePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-cream rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${expensePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Revenue by Source */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Revenue by Source</h2>
        <div className="space-y-4">
          {revenueBySource.map((source) => (
            <div key={source.source} className="p-4 bg-cream rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-dark">{source.source}</span>
                <span className="text-sm font-semibold text-green">{source.percentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-4 overflow-hidden">
                  <div 
                    className="bg-yellow h-full rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <span className="text-green font-semibold whitespace-nowrap">PKR {source.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Financial Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold text-green">View Detailed Reports</span>
            </div>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="font-semibold text-green">Process Commissions</span>
            </div>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-green">Manage Expenses</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
