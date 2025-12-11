'use client'

export default function ProfitLossPage() {
  const currentMonth = {
    month: 'December 2025',
    totalIncome: 2450000,
    totalExpenses: 1680000,
    netProfit: 770000,
    profitMargin: 31.4,
  }

  const incomeBreakdown = [
    { source: 'Room Bookings', amount: 1470000, percentage: 60 },
    { source: 'Package Deals', amount: 735000, percentage: 30 },
    { source: 'Additional Services', amount: 245000, percentage: 10 },
  ]

  const expenseBreakdown = [
    { category: 'Salaries', amount: 450000, percentage: 26.8 },
    { category: 'Food & Beverage', amount: 336000, percentage: 20 },
    { category: 'Utilities', amount: 252000, percentage: 15 },
    { category: 'Maintenance', amount: 252000, percentage: 15 },
    { category: 'Housekeeping', amount: 168000, percentage: 10 },
    { category: 'Marketing', amount: 134400, percentage: 8 },
    { category: 'Other', amount: 87600, percentage: 5.2 },
  ]

  const monthlyComparison = [
    { month: 'July', income: 1450000, expenses: 980000, profit: 470000 },
    { month: 'August', income: 1520000, expenses: 1020000, profit: 500000 },
    { month: 'September', income: 1380000, expenses: 950000, profit: 430000 },
    { month: 'October', income: 1650000, expenses: 1100000, profit: 550000 },
    { month: 'November', income: 1780000, expenses: 1180000, profit: 600000 },
    { month: 'December', income: 2450000, expenses: 1680000, profit: 770000 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Profit & Loss Statement</h1>
          <p className="text-text-light mt-1">Financial performance analysis</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export P&L Report
        </button>
      </div>

      {/* Current Month Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">{currentMonth.month}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-cream rounded-lg">
            <p className="text-text-light text-sm mb-2">Total Income</p>
            <p className="font-serif text-2xl font-bold text-green">PKR {currentMonth.totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-cream rounded-lg">
            <p className="text-text-light text-sm mb-2">Total Expenses</p>
            <p className="font-serif text-2xl font-bold text-red-500">PKR {currentMonth.totalExpenses.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-cream rounded-lg">
            <p className="text-text-light text-sm mb-2">Net Profit</p>
            <p className="font-serif text-2xl font-bold text-yellow">PKR {currentMonth.netProfit.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-cream rounded-lg">
            <p className="text-text-light text-sm mb-2">Profit Margin</p>
            <p className="font-serif text-2xl font-bold text-green">{currentMonth.profitMargin}%</p>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="font-serif text-2xl font-bold text-green mb-6">Income Breakdown</h2>
          <div className="space-y-4">
            {incomeBreakdown.map((item) => (
              <div key={item.source} className="p-4 bg-cream rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-text-dark">{item.source}</span>
                  <span className="text-sm font-semibold text-green">{item.percentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-4 overflow-hidden">
                    <div 
                      className="bg-green h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-green font-semibold whitespace-nowrap">PKR {item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="font-serif text-2xl font-bold text-green mb-6">Expense Breakdown</h2>
          <div className="space-y-4">
            {expenseBreakdown.map((item) => (
              <div key={item.category} className="p-4 bg-cream rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-text-dark">{item.category}</span>
                  <span className="text-sm font-semibold text-red-500">{item.percentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-4 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-red-500 font-semibold whitespace-nowrap">PKR {item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">6-Month Trend</h2>
        <div className="space-y-4">
          {monthlyComparison.map((month) => (
            <div key={month.month}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-dark font-medium w-24">{month.month}</span>
                <div className="flex gap-6 text-sm">
                  <span className="text-green">Income: PKR {month.income.toLocaleString()}</span>
                  <span className="text-red-500">Expenses: PKR {month.expenses.toLocaleString()}</span>
                  <span className="text-yellow font-semibold">Profit: PKR {month.profit.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-cream rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-yellow h-full rounded-full transition-all duration-500"
                  style={{ width: `${(month.profit / month.income) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
