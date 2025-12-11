'use client'

export default function OccupancyReportPage() {
  // Mock occupancy data per glamp
  const glampOccupancy = [
    { 
      id: 1, 
      name: 'Luxury Safari Tent', 
      totalDays: 30, 
      bookedDays: 26, 
      occupancyRate: 87,
      revenue: 650000,
      avgNightlyRate: 25000,
    },
    { 
      id: 2, 
      name: 'Geodesic Dome', 
      totalDays: 30, 
      bookedDays: 24, 
      occupancyRate: 80,
      revenue: 600000,
      avgNightlyRate: 25000,
    },
    { 
      id: 3, 
      name: 'Treehouse Suite', 
      totalDays: 30, 
      bookedDays: 22, 
      occupancyRate: 73,
      revenue: 550000,
      avgNightlyRate: 25000,
    },
    { 
      id: 4, 
      name: 'Woodland Cabin', 
      totalDays: 30, 
      bookedDays: 21, 
      occupancyRate: 70,
      revenue: 525000,
      avgNightlyRate: 25000,
    },
  ]

  const weeklyOccupancy = [
    { week: 'Week 1', occupancy: 75, bookings: 12 },
    { week: 'Week 2', occupancy: 82, bookings: 14 },
    { week: 'Week 3', occupancy: 78, bookings: 13 },
    { week: 'Week 4', occupancy: 85, bookings: 15 },
  ]

  const averageOccupancy = Math.round(
    glampOccupancy.reduce((sum, glamp) => sum + glamp.occupancyRate, 0) / glampOccupancy.length
  )
  const totalRevenue = glampOccupancy.reduce((sum, glamp) => sum + glamp.revenue, 0)
  const totalBookedDays = glampOccupancy.reduce((sum, glamp) => sum + glamp.bookedDays, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Occupancy Report</h1>
          <p className="text-text-light mt-1">Glamp occupancy rates and utilization analysis</p>
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
          <p className="text-text-light text-sm mb-2">Average Occupancy</p>
          <p className="font-serif text-3xl font-bold text-green">{averageOccupancy}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Booked Days</p>
          <p className="font-serif text-3xl font-bold text-green">{totalBookedDays}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Available Glamps</p>
          <p className="font-serif text-3xl font-bold text-green">{glampOccupancy.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-text-light text-sm mb-2">Total Revenue</p>
          <p className="font-serif text-3xl font-bold text-green">PKR {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Glamp Occupancy Grid */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Occupancy by Glamp (This Month)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {glampOccupancy.map((glamp) => (
            <div key={glamp.id} className="p-6 bg-cream rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-bold text-green">{glamp.name}</h3>
                <span className={`text-2xl font-bold ${
                  glamp.occupancyRate >= 80 ? 'text-green' : 
                  glamp.occupancyRate >= 60 ? 'text-yellow' : 
                  'text-red-500'
                }`}>
                  {glamp.occupancyRate}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      glamp.occupancyRate >= 80 ? 'bg-green' : 
                      glamp.occupancyRate >= 60 ? 'bg-yellow' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${glamp.occupancyRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-light">Booked Days</p>
                  <p className="font-semibold text-green">{glamp.bookedDays}/{glamp.totalDays}</p>
                </div>
                <div>
                  <p className="text-text-light">Revenue</p>
                  <p className="font-semibold text-green">PKR {glamp.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-light">Avg Nightly Rate</p>
                  <p className="font-semibold text-green">PKR {glamp.avgNightlyRate.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-light">Available Days</p>
                  <p className="font-semibold text-green">{glamp.totalDays - glamp.bookedDays}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Weekly Occupancy Trend</h2>
        <div className="space-y-4">
          {weeklyOccupancy.map((week) => (
            <div key={week.week}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-dark font-medium">{week.week}</span>
                <span className="text-text-light text-sm">{week.bookings} bookings</span>
                <span className="text-green font-semibold">{week.occupancy}%</span>
              </div>
              <div className="w-full bg-cream rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-green h-full rounded-full transition-all duration-500"
                  style={{ width: `${week.occupancy}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Occupancy Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Glamp Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Occupancy Rate</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Booked/Total Days</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Avg Nightly</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {glampOccupancy.map((glamp) => (
                <tr key={glamp.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                  <td className="py-4 px-6 font-medium text-text-dark">{glamp.name}</td>
                  <td className="py-4 px-6">
                    <span className={`text-lg font-bold ${
                      glamp.occupancyRate >= 80 ? 'text-green' : 
                      glamp.occupancyRate >= 60 ? 'text-yellow' : 
                      'text-red-500'
                    }`}>
                      {glamp.occupancyRate}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-text-dark">{glamp.bookedDays}/{glamp.totalDays}</td>
                  <td className="py-4 px-6 font-semibold text-green">PKR {glamp.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-text-dark">PKR {glamp.avgNightlyRate.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      glamp.occupancyRate >= 80 ? 'bg-green/10 text-green' : 
                      glamp.occupancyRate >= 60 ? 'bg-yellow/10 text-yellow' : 
                      'bg-red-50 text-red-600'
                    }`}>
                      {glamp.occupancyRate >= 80 ? 'High' : glamp.occupancyRate >= 60 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
