'use client'

export default function AgentProfile() {
  const agentData = {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@soulterglamps.com',
    phone: '+92 300 1234567',
    joinDate: 'January 15, 2024',
    agentId: 'AG-1045',
    totalBookings: 38,
    totalCommission: 48000,
    pendingCommission: 12500,
    activeCustomers: 24,
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green to-green-dark rounded-lg shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-cream/90">Manage your personal information and view your statistics</p>
          </div>
          <button className="px-6 py-3 bg-yellow text-green rounded-lg font-bold hover:bg-yellow/90 transition-smooth shadow-lg">
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-6 mb-8 pb-6 border-b-2 border-gray-200">
          <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {agentData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-green mb-1">{agentData.name}</h2>
            <p className="text-text-light">Sales Agent</p>
            <p className="text-sm text-yellow font-semibold mt-1">Agent ID: {agentData.agentId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg">
            <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">EMAIL ADDRESS</p>
              <p className="text-sm font-medium text-text-dark break-all">{agentData.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg">
            <div className="w-12 h-12 bg-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">PHONE NUMBER</p>
              <p className="text-sm font-medium text-text-dark">{agentData.phone}</p>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold mb-1">JOINED DATE</p>
              <p className="text-sm font-medium text-text-dark">{agentData.joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div>
        <h2 className="text-2xl font-bold text-green mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center text-3xl shadow-md">
                📅
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-green">{agentData.totalBookings}</p>
            <p className="text-xs text-green/60 mt-2">All-time bookings</p>
          </div>

          {/* Total Commission Earned */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-green rounded-lg flex items-center justify-center text-3xl shadow-md">
                💰
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">Total Commission Earned</p>
            <p className="text-3xl font-bold text-green">PKR {agentData.totalCommission.toLocaleString()}</p>
            <p className="text-xs text-green/60 mt-2">Lifetime earnings</p>
          </div>

          {/* Pending Commission */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-yellow rounded-lg flex items-center justify-center text-3xl shadow-md">
                ⏳
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">Pending Commission</p>
            <p className="text-3xl font-bold text-yellow">PKR {agentData.pendingCommission.toLocaleString()}</p>
            <p className="text-xs text-yellow/60 mt-2">Awaiting payment</p>
          </div>

          {/* Active Customers */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center text-3xl shadow-md">
                👥
              </div>
            </div>
            <p className="text-text-light text-sm mb-1 font-medium">Active Customers</p>
            <p className="text-3xl font-bold text-green">{agentData.activeCustomers}</p>
            <p className="text-xs text-green/60 mt-2">Total customers brought</p>
          </div>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-green mb-6 pb-4 border-b-2 border-gray-200">
          Account Settings
        </h2>
        <div className="space-y-4">
          <button className="w-full md:w-auto px-6 py-3 bg-green/10 text-green rounded-lg font-semibold hover:bg-green hover:text-white transition-smooth text-left">
            🔒 Change Password
          </button>
          <button className="w-full md:w-auto px-6 py-3 bg-yellow/20 text-yellow rounded-lg font-semibold hover:bg-yellow hover:text-green transition-smooth text-left ml-0 md:ml-4">
            📧 Update Email
          </button>
          <button className="w-full md:w-auto px-6 py-3 bg-blue-500/10 text-blue-500 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-smooth text-left ml-0 md:ml-4">
            📱 Update Phone
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-yellow/10 border border-yellow rounded-lg p-6">
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-green mb-2">Profile Information</h3>
            <p className="text-sm text-text-dark">
              Keep your profile information up to date to ensure smooth communication with customers and timely commission payments. 
              For any issues or to update your banking details, please contact your supervisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
