'use client'

export default function SuperAdminDashboard() {
  const stats = [
    { label: 'Total Admins', value: '5', change: '+1 this month', icon: '👤', color: 'bg-blue-500' },
    { label: 'Total Agents', value: '24', change: '+3 this month', icon: '👥', color: 'bg-purple-500' },
    { label: 'Total Bookings', value: '1,247', change: '+127 this month', icon: '📅', color: 'bg-green' },
    { label: 'Total Revenue', value: 'PKR 18.5M', change: '+25% this month', icon: '💰', color: 'bg-yellow' },
    { label: 'Pending Commissions', value: 'PKR 185K', change: '12 agents', icon: '💳', color: 'bg-orange-500' },
    { label: 'System Health', value: '99.9%', change: 'All systems operational', icon: '✅', color: 'bg-green' },
  ]

  const recentActivity = [
    { type: 'Admin', action: 'New admin "Sarah Khan" added', time: '2 hours ago', user: 'Super Admin' },
    { type: 'Agent', action: 'Agent "Ali Raza" commission processed', time: '4 hours ago', user: 'System' },
    { type: 'Booking', action: '15 new bookings received', time: '6 hours ago', user: 'System' },
    { type: 'Finance', action: 'Monthly financial report generated', time: '1 day ago', user: 'Super Admin' },
    { type: 'Settings', action: 'System backup completed', time: '1 day ago', user: 'System' },
  ]

  const quickActions = [
    { title: 'Add New Admin', icon: '➕', href: '/super-admin/admins', color: 'bg-blue-500' },
    { title: 'Add New Agent', icon: '➕', href: '/super-admin/agents', color: 'bg-purple-500' },
    { title: 'View All Bookings', icon: '📋', href: '/super-admin/bookings', color: 'bg-green' },
    { title: 'Financial Overview', icon: '📊', href: '/super-admin/finance', color: 'bg-yellow' },
    { title: 'Process Commissions', icon: '💵', href: '/super-admin/commission', color: 'bg-orange-500' },
    { title: 'System Settings', icon: '⚙️', href: '/super-admin/settings', color: 'bg-gray-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">Super Admin Dashboard</h1>
        <p className="text-text-light mt-1">Welcome back! Here&apos;s your system overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
            style={{animationDelay: `${index * 0.05}s`}}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-text-light text-sm mb-1">{stat.label}</h3>
            <p className="font-serif text-3xl font-bold text-green mb-2">{stat.value}</p>
            <p className="text-sm text-text-light">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={action.title}
              href={action.href}
              className="group p-6 border-2 border-gray-200 rounded-lg hover:border-yellow hover:bg-cream transition-smooth animate-fade-in"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-smooth`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-green">{action.title}</h3>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-2xl font-bold text-green mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-cream rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center text-white font-bold">
                  {activity.type.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-text-dark">{activity.action}</p>
                  <p className="text-sm text-text-light">by {activity.user}</p>
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
