'use client'

import { useState } from 'react'

export default function StaffReportPage() {
  const [filterBy, setFilterBy] = useState('all')

  // Mock staff performance data
  const staffData = [
    { 
      id: 1, 
      name: 'Ahmad Khan', 
      role: 'Manager', 
      rating: 4.8, 
      completedTasks: 145, 
      totalTasks: 150, 
      attendance: 98, 
      performance: 'excellent',
      department: 'Operations'
    },
    { 
      id: 2, 
      name: 'Sara Ahmed', 
      role: 'Receptionist', 
      rating: 4.6, 
      completedTasks: 132, 
      totalTasks: 140, 
      attendance: 95, 
      performance: 'excellent',
      department: 'Front Desk'
    },
    { 
      id: 3, 
      name: 'Hassan Ali', 
      role: 'Maintenance', 
      rating: 4.5, 
      completedTasks: 128, 
      totalTasks: 135, 
      attendance: 96, 
      performance: 'excellent',
      department: 'Maintenance'
    },
    { 
      id: 4, 
      name: 'Fatima Malik', 
      role: 'Housekeeper', 
      rating: 4.4, 
      completedTasks: 118, 
      totalTasks: 125, 
      attendance: 94, 
      performance: 'good',
      department: 'Housekeeping'
    },
    { 
      id: 5, 
      name: 'Usman Shah', 
      role: 'Chef', 
      rating: 4.7, 
      completedTasks: 140, 
      totalTasks: 145, 
      attendance: 97, 
      performance: 'excellent',
      department: 'Kitchen'
    },
    { 
      id: 6, 
      name: 'Ayesha Siddiqui', 
      role: 'Housekeeper', 
      rating: 4.3, 
      completedTasks: 110, 
      totalTasks: 120, 
      attendance: 92, 
      performance: 'good',
      department: 'Housekeeping'
    },
    { 
      id: 7, 
      name: 'Bilal Rashid', 
      role: 'Security', 
      rating: 4.2, 
      completedTasks: 105, 
      totalTasks: 115, 
      attendance: 91, 
      performance: 'good',
      department: 'Security'
    },
    { 
      id: 8, 
      name: 'Zainab Noor', 
      role: 'Waitress', 
      rating: 4.0, 
      completedTasks: 98, 
      totalTasks: 110, 
      attendance: 89, 
      performance: 'average',
      department: 'Kitchen'
    },
  ]

  const filteredStaff = filterBy === 'all' 
    ? staffData 
    : staffData.filter(staff => staff.performance === filterBy)

  const totalStaff = staffData.length
  const excellentPerformers = staffData.filter(s => s.performance === 'excellent').length
  const avgRating = (staffData.reduce((sum, s) => sum + s.rating, 0) / totalStaff).toFixed(1)
  const avgAttendance = Math.round(staffData.reduce((sum, s) => sum + s.attendance, 0) / totalStaff)

  const topPerformers = [...staffData].sort((a, b) => b.rating - a.rating).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Staff Performance Report</h1>
          <p className="text-text-light mt-1">Staff performance metrics and ratings</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Staff</p>
          <p className="font-serif text-3xl font-bold text-green">{totalStaff}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Excellent Performers</p>
          <p className="font-serif text-3xl font-bold text-green">{excellentPerformers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Average Rating</p>
          <p className="font-serif text-3xl font-bold text-green">{avgRating}/5.0</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Avg Attendance</p>
          <p className="font-serif text-3xl font-bold text-green">{avgAttendance}%</p>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Top Performers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topPerformers.map((staff, index) => (
            <div key={staff.id} className="p-6 bg-cream rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-green">{staff.name}</h3>
                  <p className="text-sm text-text-light">{staff.role}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-light text-sm">Rating:</span>
                  <span className="font-semibold text-yellow">{staff.rating}/5.0 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light text-sm">Tasks:</span>
                  <span className="font-semibold text-green">{staff.completedTasks}/{staff.totalTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light text-sm">Attendance:</span>
                  <span className="font-semibold text-green">{staff.attendance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-green mb-4">Filter by Performance</h3>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
        >
          <option value="all">All Staff</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="average">Average</option>
        </select>
      </div>

      {/* Staff Performance Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Staff Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Department</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Rating</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Tasks Completed</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Attendance</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Performance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => {
                const taskCompletionRate = Math.round((staff.completedTasks / staff.totalTasks) * 100)
                
                return (
                  <tr key={staff.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center text-white font-bold">
                          {staff.name.charAt(0)}
                        </div>
                        <span className="font-medium text-text-dark">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-dark">{staff.role}</td>
                    <td className="py-4 px-6 text-text-light text-sm">{staff.department}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-yellow">{staff.rating}/5.0 ⭐</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-text-dark">{staff.completedTasks}/{staff.totalTasks}</span>
                        <span className="text-xs text-text-light">({taskCompletionRate}%)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-green">{staff.attendance}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        staff.performance === 'excellent' 
                          ? 'bg-green/10 text-green' 
                          : staff.performance === 'good'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-yellow/10 text-yellow'
                      }`}>
                        {staff.performance}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
