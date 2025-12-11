'use client'

export default function MonthlyStatementsPage() {
  const statements = [
    { month: 'December 2025', income: 2450000, expenses: 1680000, profit: 770000, transactions: 156, bookings: 127, status: 'current' },
    { month: 'November 2025', income: 1780000, expenses: 1180000, profit: 600000, transactions: 142, bookings: 102, status: 'finalized' },
    { month: 'October 2025', income: 1650000, expenses: 1100000, profit: 550000, transactions: 138, bookings: 77, status: 'finalized' },
    { month: 'September 2025', income: 1380000, expenses: 950000, profit: 430000, transactions: 124, bookings: 83, status: 'finalized' },
    { month: 'August 2025', income: 1520000, expenses: 1020000, profit: 500000, transactions: 131, bookings: 96, status: 'finalized' },
    { month: 'July 2025', income: 1450000, expenses: 980000, profit: 470000, transactions: 128, bookings: 68, status: 'finalized' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Monthly Financial Statements</h1>
          <p className="text-text-light mt-1">View monthly financial summaries and statements</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export All Statements
        </button>
      </div>

      {/* Monthly Statements Grid */}
      <div className="grid grid-cols-1 gap-6">
        {statements.map((statement, index) => (
          <div 
            key={statement.month} 
            className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in"
            style={{animationDelay: `${index * 0.05}s`}}
          >
            <div className="p-6 border-b border-gray-200 bg-cream">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-green">{statement.month}</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  statement.status === 'current' 
                    ? 'bg-yellow/10 text-yellow' 
                    : 'bg-green/10 text-green'
                }`}>
                  {statement.status === 'current' ? 'Current Month' : 'Finalized'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <div className="p-4 bg-cream rounded-lg">
                  <p className="text-text-light text-sm mb-2">Total Income</p>
                  <p className="font-serif text-2xl font-bold text-green">PKR {statement.income.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-cream rounded-lg">
                  <p className="text-text-light text-sm mb-2">Total Expenses</p>
                  <p className="font-serif text-2xl font-bold text-red-500">PKR {statement.expenses.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-cream rounded-lg">
                  <p className="text-text-light text-sm mb-2">Net Profit</p>
                  <p className="font-serif text-2xl font-bold text-yellow">PKR {statement.profit.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-cream rounded-lg">
                  <p className="text-text-light text-sm mb-2">Transactions</p>
                  <p className="font-serif text-2xl font-bold text-green">{statement.transactions}</p>
                </div>
                <div className="p-4 bg-cream rounded-lg">
                  <p className="text-text-light text-sm mb-2">Bookings</p>
                  <p className="font-serif text-2xl font-bold text-green">{statement.bookings}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 border border-green text-green rounded-lg hover:bg-cream transition-smooth">
                  View Details
                </button>
                <button className="px-4 py-2 bg-yellow text-green rounded-lg hover:bg-yellow-light transition-smooth">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
