'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ViewStaffPage() {
  const params = useParams()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  // Mock staff data - in real app, fetch based on params.id
  const staff = {
    id: params.id,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@soulterglamps.com',
    phone: '+1 234 567 8901',
    role: 'Manager',
    department: 'Operations',
    shift: 'Full Day',
    salary: 4500,
    dateOfJoining: '2024-01-15',
    address: '123 Main Street, Denver, CO 80202',
    emergencyContact: 'Jane Smith',
    emergencyPhone: '+1 234 567 8999',
    status: 'active',
  }

  const attendanceRecords = [
    { date: '2025-12-01', checkIn: '08:55 AM', checkOut: '05:12 PM', status: 'present', hours: 8.3 },
    { date: '2025-12-02', checkIn: '09:02 AM', checkOut: '05:05 PM', status: 'present', hours: 8.0 },
    { date: '2025-12-03', checkIn: '08:50 AM', checkOut: '05:20 PM', status: 'present', hours: 8.5 },
    { date: '2025-12-04', checkIn: '-', checkOut: '-', status: 'leave', hours: 0 },
    { date: '2025-12-05', checkIn: '09:10 AM', checkOut: '05:00 PM', status: 'late', hours: 7.8 },
  ]

  const performanceNotes = [
    { date: '2025-11-15', note: 'Excellent customer service. Received positive feedback from 5 guests.', type: 'positive' },
    { date: '2025-10-20', note: 'Successfully managed team during peak season. Great leadership.', type: 'positive' },
    { date: '2025-09-10', note: 'Needs improvement in time management for morning shifts.', type: 'improvement' },
  ]

  const handleDelete = () => {
    alert('Staff member removed successfully')
    router.push('/admin/staff')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/staff"
            className="p-2 hover:bg-cream rounded-lg transition-smooth"
          >
            <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-green">Staff Details</h1>
            <p className="text-text-light mt-1">View and manage team member information</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            staff.status === 'active' 
              ? 'bg-green/10 text-green' 
              : staff.status === 'on-leave'
              ? 'bg-yellow/10 text-yellow'
              : 'bg-red-50 text-red-600'
          }`}>
            {staff.status === 'on-leave' ? 'ON LEAVE' : staff.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-green text-cream rounded-full flex items-center justify-center font-bold text-3xl">
                {staff.firstName[0]}{staff.lastName[0]}
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-2xl font-bold text-green mb-2">
                  {staff.firstName} {staff.lastName}
                </h2>
                <p className="text-lg text-text-light mb-4">{staff.role} - {staff.department}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-text-dark">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-text-dark">{staff.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex border-b border-gray-200">
              {['details', 'attendance', 'performance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 font-semibold capitalize transition-smooth ${
                    activeTab === tab
                      ? 'text-green border-b-2 border-yellow bg-yellow/5'
                      : 'text-text-light hover:text-text-dark hover:bg-cream'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-green mb-4">Employment Information</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-text-light mb-1">Work Shift</p>
                        <p className="font-medium text-text-dark">{staff.shift}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-light mb-1">Date of Joining</p>
                        <p className="font-medium text-text-dark">{staff.dateOfJoining}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-light mb-1">Monthly Salary</p>
                        <p className="font-medium text-green">${staff.salary}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-light mb-1">Employee ID</p>
                        <p className="font-medium text-text-dark">EMP-{staff.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-serif text-xl font-bold text-green mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-text-light mb-1">Address</p>
                        <p className="font-medium text-text-dark">{staff.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-serif text-xl font-bold text-green mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-text-light mb-1">Contact Name</p>
                        <p className="font-medium text-text-dark">{staff.emergencyContact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-light mb-1">Contact Phone</p>
                        <p className="font-medium text-text-dark">{staff.emergencyPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === 'attendance' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl font-bold text-green">Recent Attendance</h3>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-cream text-text-dark rounded-lg font-medium hover:bg-yellow/20 transition-smooth">
                        This Week
                      </button>
                      <button className="px-4 py-2 text-text-light rounded-lg font-medium hover:bg-cream transition-smooth">
                        This Month
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-cream">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Check-in</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Check-out</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Hours</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceRecords.map((record, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-text-dark">{record.date}</td>
                            <td className="py-3 px-4 text-text-dark">{record.checkIn}</td>
                            <td className="py-3 px-4 text-text-dark">{record.checkOut}</td>
                            <td className="py-3 px-4 text-text-dark">{record.hours.toFixed(1)}h</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                record.status === 'present' 
                                  ? 'bg-green/10 text-green' 
                                  : record.status === 'late'
                                  ? 'bg-yellow/10 text-yellow'
                                  : 'bg-red-50 text-red-600'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="font-serif text-xl font-bold text-green mb-4">Performance Notes</h3>
                  
                  <div className="space-y-4">
                    {performanceNotes.map((note, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border-l-4 ${
                          note.type === 'positive'
                            ? 'bg-green/5 border-green'
                            : 'bg-yellow/5 border-yellow'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {note.type === 'positive' ? (
                              <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className="text-sm text-text-light">{note.date}</span>
                          </div>
                        </div>
                        <p className="text-text-dark">{note.note}</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 border-2 border-green text-green px-4 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth">
                    Add Performance Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h2 className="font-serif text-xl font-bold text-green mb-4">Quick Stats</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-light">Attendance Rate</span>
                <span className="font-semibold text-green">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-light">Total Days</span>
                <span className="font-semibold text-text-dark">320</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-light">Leave Taken</span>
                <span className="font-semibold text-text-dark">12 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-light">Leave Balance</span>
                <span className="font-semibold text-yellow">8 days</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h2 className="font-serif text-xl font-bold text-green mb-4">Quick Actions</h2>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-green text-cream px-4 py-3 rounded-lg font-semibold hover:bg-green-dark transition-smooth">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </button>

              <button className="w-full flex items-center justify-center gap-2 bg-yellow text-green px-4 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Details
              </button>

              <button className="w-full flex items-center justify-center gap-2 border-2 border-green text-green px-4 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Mark Leave
              </button>

              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 px-4 py-3 rounded-lg font-semibold hover:bg-red-50 transition-smooth"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Staff
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-slide-up">
            <h3 className="font-serif text-2xl font-bold text-green mb-4">Remove Staff Member?</h3>
            <p className="text-text-dark mb-6">
              Are you sure you want to remove <strong>{staff.firstName} {staff.lastName}</strong> from the team? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 border-2 border-gray-300 text-text-dark px-4 py-3 rounded-lg font-semibold hover:bg-cream transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition-smooth"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
