/*
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentDashboard() {
  // ...existing code...

  return <DashboardContent />;
} */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentDashboard() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.replace('/agent/login')
    }
  }, [router])

  return <DashboardContent />
}


function DashboardContent() {
  const summaryCards = [
    { 
      label: 'Total Customers Brought', 
      value: '24', 
      icon: '👥', 
      bgColor: 'bg-blue-500',
      change: '+3 this month',
      changePositive: true
    },
    { 
      label: 'Total Bookings', 
      value: '38', 
      icon: '📅', 
      bgColor: 'bg-green',
      change: '+5 this month',
      changePositive: true
    },
    { 
      label: 'Commission Earned', 
      value: 'PKR 48,000', 
      icon: '💰', 
      bgColor: 'bg-yellow',
      change: 'This month',
      changePositive: true
    },
    { 
      label: 'Pending Commission', 
      value: 'PKR 12,500', 
      icon: '⏳', 
      bgColor: 'bg-purple-500',
      change: '3 payments',
      changePositive: false
    },
  ]

  const recentBookings = [
    { id: 'BK-2401', customer: 'Ali Hassan', glamping: 'Luxury Tent', date: '2025-12-15', commission: 'PKR 2,500', status: 'Confirmed' },
    { id: 'BK-2402', customer: 'Sara Ahmed', glamping: 'Tree House', date: '2025-12-18', commission: 'PKR 3,200', status: 'Pending' },
    { id: 'BK-2403', customer: 'Usman Khan', glamping: 'Safari Tent', date: '2025-12-20', commission: 'PKR 2,800', status: 'Confirmed' },
    { id: 'BK-2404', customer: 'Fatima Noor', glamping: 'Dome Tent', date: '2025-12-25', commission: 'PKR 3,000', status: 'Confirmed' },
  ]

  // Mock data for chart
  const monthlyData = [
    { month: 'Jul', bookings: 4, commission: 8500 },
    { month: 'Aug', bookings: 6, commission: 12000 },
    { month: 'Sep', bookings: 5, commission: 10500 },
    { month: 'Oct', bookings: 7, commission: 15000 },
    { month: 'Nov', bookings: 8, commission: 18000 },
    { month: 'Dec', bookings: 8, commission: 16000 },
  ]

  const maxCommission = Math.max(...monthlyData.map(d => d.commission))

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green to-green-dark rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome Back, Agent!</h1>
        <p className="text-cream/90 text-lg">Here's your performance overview for December 2025</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.bgColor} w-14 h-14 rounded-lg flex items-center justify-center text-3xl shadow-md`}>
                {card.icon}
              </div>
              {card.changePositive !== undefined && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  card.changePositive ? 'bg-green/10 text-green' : 'bg-yellow/20 text-yellow'
                }`}>
                  {card.change}
                </span>
              )}
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">{card.label}</p>
            <p className="text-3xl font-bold text-green">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Overview Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green">Performance Overview</h2>
            <p className="text-text-light text-sm mt-1">Monthly bookings and commission trends</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green rounded"></div>
              <span className="text-text-light">Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow rounded"></div>
              <span className="text-text-light">Commission</span>
            </div>
          </div>
        </div>

        {/* Custom Bar Chart Placeholder */}
        <div className="bg-cream/30 rounded-lg p-6 border border-gray-200">
          <div className="flex items-end justify-between gap-4 h-64">
            {monthlyData.map((data, index) => {
              const height = (data.commission / maxCommission) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  {/* Bar */}
                  <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                    <div className="text-xs font-semibold text-green mb-1">
                      {data.bookings}
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-green to-green-dark rounded-t-lg shadow-md hover:shadow-lg transition-all relative group"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        PKR {data.commission.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {/* Month Label */}
                  <div className="text-sm font-semibold text-text-dark">{data.month}</div>
                </div>
              )
            })}
          </div>
          
          {/* Chart Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-text-light text-xs mb-1">Avg. Bookings/Month</p>
                <p className="text-lg font-bold text-green">6.3</p>
              </div>
              <div>
                <p className="text-text-light text-xs mb-1">Avg. Commission/Month</p>
                <p className="text-lg font-bold text-yellow">PKR 13,333</p>
              </div>
              <div>
                <p className="text-text-light text-xs mb-1">Growth Rate</p>
                <p className="text-lg font-bold text-green">+12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green">Recent Bookings</h2>
            <p className="text-text-light text-sm mt-1">Your latest customer bookings</p>
          </div>
          <a 
            href="/agent/bookings" 
            className="px-4 py-2 bg-yellow text-green rounded-lg font-semibold hover:bg-yellow/80 transition-smooth text-sm"
          >
            View All →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Booking ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Glamping</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Check-In Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Commission</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-cream/30 transition-colors">
                  <td className="py-4 px-4 font-semibold text-green">{booking.id}</td>
                  <td className="py-4 px-4 font-medium">{booking.customer}</td>
                  <td className="py-4 px-4 text-text-light">{booking.glamping}</td>
                  <td className="py-4 px-4 text-text-light">{booking.date}</td>
                  <td className="py-4 px-4 font-bold text-yellow">{booking.commission}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'Confirmed' ? 'bg-green/10 text-green' : 'bg-yellow/20 text-yellow'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a 
          href="/agent/add-booking"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-green group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green rounded-lg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              ➕
            </div>
            <div>
              <h3 className="text-xl font-bold text-green mb-1">Add New Booking</h3>
              <p className="text-text-light text-sm">Create a booking for your customer</p>
            </div>
          </div>
        </a>

        <a 
          href="/agent/commissions"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-yellow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow rounded-lg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              💰
            </div>
            <div>
              <h3 className="text-xl font-bold text-green mb-1">View Commissions</h3>
              <p className="text-text-light text-sm">Check your earnings and history</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
