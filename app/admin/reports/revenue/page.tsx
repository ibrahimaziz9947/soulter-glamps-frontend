'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/src/utils/currency'

export default function RevenueReportPage() {
  // Mock revenue data
  const revenueData = {
    daily: { amount: 125000, bookings: 5, change: '+12%' },
    monthly: { amount: 2450000, bookings: 127, change: '+18%' },
    yearly: { amount: 18500000, bookings: 892, change: '+25%' },
  }

  const monthlyBreakdown = [
    { month: 'January', revenue: 1450000, bookings: 68 },
    { month: 'February', revenue: 1320000, bookings: 62 },
    { month: 'March', revenue: 1580000, bookings: 74 },
    { month: 'April', revenue: 1680000, bookings: 79 },
    { month: 'May', revenue: 1720000, bookings: 81 },
    { month: 'June', revenue: 1890000, bookings: 89 },
    { month: 'July', revenue: 2100000, bookings: 98 },
    { month: 'August', revenue: 2050000, bookings: 96 },
    { month: 'September', revenue: 1780000, bookings: 83 },
    { month: 'October', revenue: 1650000, bookings: 77 },
    { month: 'November', revenue: 2180000, bookings: 102 },
    { month: 'December', revenue: 2450000, bookings: 127 },
  ]

  const revenueBySource = [
    { source: 'Direct Bookings', amount: 1470000, percentage: 60 },
    { source: 'Package Deals', amount: 735000, percentage: 30 },
    { source: 'Additional Services', amount: 245000, percentage: 10 },
  ]

  const topGlamps = [
    { name: 'Luxury Safari Tent', revenue: 875000, bookings: 35 },
    { name: 'Geodesic Dome', revenue: 735000, bookings: 29 },
    { name: 'Treehouse Suite', revenue: 612500, bookings: 25 },
    { name: 'Woodland Cabin', revenue: 227500, bookings: 38 },
  ]

  const maxRevenue = Math.max(...monthlyBreakdown.map(m => m.revenue))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Revenue Report</h1>
          <p className="text-text-light mt-1">Comprehensive revenue analysis and insights</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green bg-green/10 px-3 py-1 rounded-full">
              {revenueData.daily.change}
            </span>
          </div>
          <h3 className="text-text-light text-sm mb-1">Daily Revenue</h3>
          <p className="font-serif text-3xl font-bold text-green">PKR {revenueData.daily.amount.toLocaleString()}</p>
          <p className="text-sm text-text-light mt-2">{revenueData.daily.bookings} bookings today</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green bg-green/10 px-3 py-1 rounded-full">
              {revenueData.monthly.change}
            </span>
          </div>
          <h3 className="text-text-light text-sm mb-1">Monthly Revenue</h3>
          <p className="font-serif text-3xl font-bold text-green">PKR {revenueData.monthly.amount.toLocaleString()}</p>
          <p className="text-sm text-text-light mt-2">{revenueData.monthly.bookings} bookings this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green bg-green/10 px-3 py-1 rounded-full">
              {revenueData.yearly.change}
            </span>
          </div>
          <h3 className="text-text-light text-sm mb-1">Yearly Revenue</h3>
          <p className="font-serif text-3xl font-bold text-green">PKR {revenueData.yearly.amount.toLocaleString()}</p>
          <p className="text-sm text-text-light mt-2">{revenueData.yearly.bookings} bookings this year</p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Monthly Revenue Trend (2025)</h2>
        <div className="space-y-4">
          {monthlyBreakdown.map((month) => {
            const widthPercentage = (month.revenue / maxRevenue) * 100
            
            return (
              <div key={month.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-dark font-medium w-24">{month.month}</span>
                  <span className="text-text-light text-sm">{month.bookings} bookings</span>
                  <span className="text-green font-semibold">PKR {month.revenue.toLocaleString()}</span>
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

      {/* Revenue by Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Top Revenue Glamps */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="font-serif text-2xl font-bold text-green mb-6">Top Revenue Glamps</h2>
          <div className="space-y-4">
            {topGlamps.map((glamp, index) => (
              <div key={glamp.name} className="flex items-center gap-4 p-4 bg-cream rounded-lg">
                <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center font-bold text-green">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-dark">{glamp.name}</p>
                  <p className="text-sm text-text-light">{glamp.bookings} bookings</p>
                </div>
                <span className="font-semibold text-green">PKR {glamp.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
