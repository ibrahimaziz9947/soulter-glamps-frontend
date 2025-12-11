'use client'

export default function StatementsPage() {
  // Mock monthly statement data
  const monthlyStatements = [
    { 
      month: 'December 2025', 
      income: 2450000, 
      expenses: 1680000, 
      profit: 770000, 
      status: 'current',
      transactions: 156,
      bookings: 42
    },
    { 
      month: 'November 2025', 
      income: 2180000, 
      expenses: 1520000, 
      profit: 660000, 
      status: 'closed',
      transactions: 142,
      bookings: 38
    },
    { 
      month: 'October 2025', 
      income: 1950000, 
      expenses: 1450000, 
      profit: 500000, 
      status: 'closed',
      transactions: 128,
      bookings: 35
    },
    { 
      month: 'September 2025', 
      income: 2320000, 
      expenses: 1590000, 
      profit: 730000, 
      status: 'closed',
      transactions: 148,
      bookings: 40
    },
    { 
      month: 'August 2025', 
      income: 2680000, 
      expenses: 1720000, 
      profit: 960000, 
      status: 'closed',
      transactions: 167,
      bookings: 48
    },
    { 
      month: 'July 2025', 
      income: 2890000, 
      expenses: 1850000, 
      profit: 1040000, 
      status: 'closed',
      transactions: 178,
      bookings: 52
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Monthly Statements</h1>
          <p className="text-text-light mt-1">Review financial performance and monthly reports</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Summary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Revenue (6 months)</p>
          <p className="font-serif text-2xl font-bold text-green">
            PKR {monthlyStatements.reduce((sum, s) => sum + s.income, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Expenses</p>
          <p className="font-serif text-2xl font-bold text-red-500">
            PKR {monthlyStatements.reduce((sum, s) => sum + s.expenses, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Net Profit</p>
          <p className="font-serif text-2xl font-bold text-green">
            PKR {monthlyStatements.reduce((sum, s) => sum + s.profit, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Average Monthly Profit</p>
          <p className="font-serif text-2xl font-bold text-green">
            PKR {Math.round(monthlyStatements.reduce((sum, s) => sum + s.profit, 0) / monthlyStatements.length).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Monthly Statements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {monthlyStatements.map((statement, index) => (
          <div key={statement.month} className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-green">{statement.month}</h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  statement.status === 'current' 
                    ? 'bg-yellow/20 text-yellow' 
                    : 'bg-green/10 text-green'
                }`}>
                  {statement.status === 'current' ? 'Current Month' : 'Closed'}
                </span>
              </div>
              <button className="p-2 text-green hover:bg-cream rounded-lg transition-smooth" title="View Details">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Income */}
              <div className="flex items-center justify-between p-4 bg-green/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green rounded-lg flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Income</p>
                    <p className="font-semibold text-green">PKR {statement.income.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Expenses</p>
                    <p className="font-semibold text-red-500">PKR {statement.expenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Profit/Loss */}
              <div className="flex items-center justify-between p-4 bg-yellow/10 rounded-lg border-2 border-yellow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Net Profit</p>
                    <p className="font-bold text-green text-lg">PKR {statement.profit.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-text-light text-xs mb-1">Transactions</p>
                  <p className="font-semibold text-text-dark">{statement.transactions}</p>
                </div>
                <div>
                  <p className="text-text-light text-xs mb-1">Bookings</p>
                  <p className="font-semibold text-text-dark">{statement.bookings}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profit Trend */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">6-Month Profit Trend</h2>
        <div className="space-y-4">
          {monthlyStatements.map((statement) => {
            const maxProfit = Math.max(...monthlyStatements.map(s => s.profit))
            const widthPercentage = (statement.profit / maxProfit) * 100
            
            return (
              <div key={statement.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-dark font-medium">{statement.month}</span>
                  <span className="text-green font-semibold">PKR {statement.profit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-cream rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-green h-full rounded-full transition-all duration-500"
                    style={{ width: `${widthPercentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
