'use client'

import Link from 'next/link'

export default function ReportsPage() {
  const reportCategories = [
    {
      title: 'Booking Report',
      description: 'Comprehensive booking analytics and trends',
      href: '/admin/reports/bookings',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      stats: '127 bookings',
      color: 'bg-green',
    },
    {
      title: 'Revenue Report',
      description: 'Revenue breakdown and financial insights',
      href: '/admin/reports/revenue',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      stats: 'PKR 2.45M',
      color: 'bg-yellow',
    },
    {
      title: 'Expense Report',
      description: 'Detailed expense analysis by category',
      href: '/admin/reports/expenses',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      stats: 'PKR 1.68M',
      color: 'bg-red-500',
    },
    {
      title: 'Occupancy Report',
      description: 'Glamp occupancy rates and utilization',
      href: '/admin/reports/occupancy',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      stats: '78% average',
      color: 'bg-blue-500',
    },
    {
      title: 'Customer Report',
      description: 'Customer data and booking history',
      href: '/admin/reports/customers',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      stats: '89 customers',
      color: 'bg-purple-500',
    },
    {
      title: 'Staff Performance',
      description: 'Staff performance metrics and ratings',
      href: '/admin/reports/staff',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      stats: '24 staff members',
      color: 'bg-orange-500',
    },
  ]

  const quickStats = [
    { label: 'Total Reports Generated', value: '1,247', change: '+12%', icon: '📊' },
    { label: 'This Month', value: '156', change: '+8%', icon: '📈' },
    { label: 'Average Response Time', value: '2.3s', change: '-15%', icon: '⚡' },
    { label: 'Report Categories', value: '6', change: '0%', icon: '📁' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Reports Dashboard</h1>
          <p className="text-text-light mt-1">Generate and view comprehensive business reports</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export All Reports
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'} bg-${stat.change.startsWith('+') ? 'green' : stat.change.startsWith('-') ? 'red' : 'gray'}/10 px-3 py-1 rounded-full`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-text-light text-sm mb-1">{stat.label}</h3>
            <p className="font-serif text-2xl font-bold text-green">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Report Categories */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Report Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((report, index) => (
            <Link
              key={report.title}
              href={report.href}
              className="group p-6 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth animate-fade-in"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className={`w-16 h-16 ${report.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-smooth`}>
                {report.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-green mb-2">{report.title}</h3>
              <p className="text-text-light text-sm mb-4">{report.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-green">{report.stats}</span>
                <svg className="w-5 h-5 text-yellow group-hover:translate-x-1 transition-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Recent Report Activity</h2>
        <div className="space-y-4">
          {[
            { report: 'Booking Report', user: 'Admin User', time: '2 hours ago', action: 'Generated' },
            { report: 'Revenue Report', user: 'Admin User', time: '5 hours ago', action: 'Exported' },
            { report: 'Occupancy Report', user: 'Admin User', time: '1 day ago', action: 'Generated' },
            { report: 'Customer Report', user: 'Admin User', time: '2 days ago', action: 'Viewed' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-cream rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center text-white font-bold">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-text-dark">{activity.report}</p>
                  <p className="text-sm text-text-light">{activity.action} by {activity.user}</p>
                </div>
              </div>
              <span className="text-sm text-text-light">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
