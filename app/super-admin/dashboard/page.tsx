"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSuperAdminDashboardSummary, type SuperAdminDashboardSummary } from '@/src/services/super-admin-dashboard.api';
import { formatRawCurrency } from '@/src/utils/currency';

export default function SuperAdminDashboard() {
  // ...existing code...

  return <DashboardContent />;
}

function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<SuperAdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Date range state - default to last 30 days
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Helper to calculate last 30 days
  const getLast30Days = (): { from: string; to: string } => {
    const now = new Date();
    const to = now.toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const from = thirtyDaysAgo.toISOString().split('T')[0];
    return { from, to };
  };
  
  // Fetch dashboard data
  const loadDashboard = async (from?: string, to?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getSuperAdminDashboardSummary({ from, to });
      
      console.log('[Super Admin Dashboard] API Response:', data);
      console.log('[Super Admin Dashboard] Finance Snapshot:', data?.financeSnapshot);
      
      setDashboardData(data);
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err: any) {
      let errorMessage = 'Failed to load dashboard data';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.data?.error) {
        errorMessage = err.data.error;
      }
      
      if (err.status) {
        errorMessage = `[${err.status}] ${errorMessage}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch with last 30 days
  useEffect(() => {
    const { from, to } = getLast30Days();
    setDateFrom(from);
    setDateTo(to);
    loadDashboard(from, to);
  }, []);
  
  // Handle date range apply
  const handleApplyDateRange = () => {
    loadDashboard(dateFrom, dateTo);
  };
  
  // Handle retry
  const handleRetry = () => {
    loadDashboard(dateFrom, dateTo);
  };
  
  // Generate stats from API data with safe fallbacks
  const stats = dashboardData ? [
    { 
      label: 'Total Bookings', 
      value: (dashboardData.totalBookings || 0).toString(), 
      change: `${dateFrom} to ${dateTo}`, 
      icon: '📅', 
      color: 'bg-green' 
    },
    { 
      label: 'Revenue', 
      value: formatRawCurrency(dashboardData.revenueCents ?? 0), 
      change: `${dateFrom} to ${dateTo}`, 
      icon: '💰', 
      color: 'bg-yellow' 
    },
    { 
      label: 'Pending Commissions', 
      value: formatRawCurrency(dashboardData.pendingCommissions?.amountCents ?? 0), 
      change: `${dashboardData.pendingCommissions?.count ?? 0} pending`, 
      icon: '💳', 
      color: 'bg-orange-500' 
    },
    { 
      label: 'Finance Revenue', 
      value: formatRawCurrency(dashboardData.financeSnapshot?.revenueCents ?? 0), 
      change: 'From finance snapshot', 
      icon: '📈', 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Finance Expenses', 
      value: formatRawCurrency(dashboardData.financeSnapshot?.expenseCents ?? 0), 
      change: 'From finance snapshot', 
      icon: '💸', 
      color: 'bg-red-500' 
    },
    { 
      label: 'Finance Profit', 
      value: formatRawCurrency(dashboardData.financeSnapshot?.profitCents ?? 0), 
      change: 'From finance snapshot', 
      icon: '💵', 
      color: 'bg-green' 
    },
    { 
      label: 'System Health', 
      value: dashboardData.systemHealth?.ok && dashboardData.systemHealth?.db === 'ok' ? '✅ Healthy' : '⚠️ Warning', 
      change: dashboardData.systemHealth?.ok && dashboardData.systemHealth?.db === 'ok' ? 'All systems operational' : 'System needs attention', 
      icon: '✅', 
      color: dashboardData.systemHealth?.ok && dashboardData.systemHealth?.db === 'ok' ? 'bg-green' : 'bg-red-500' 
    },
  ] : [];
  
  // Check if data is empty (all zeros)
  const isEmptyData = dashboardData && 
    (dashboardData.totalBookings || 0) === 0 && 
    (dashboardData.revenueCents ?? 0) === 0 && 
    (dashboardData.pendingCommissions?.count ?? 0) === 0 && 
    (dashboardData.financeSnapshot?.revenueCents ?? 0) === 0 && 
    (dashboardData.financeSnapshot?.expenseCents ?? 0) === 0;

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
    { title: 'Process Commissions', icon: '💵', href: '/super-admin/commissions', color: 'bg-orange-500' },
    { title: 'System Settings', icon: '⚙️', href: '/super-admin/settings', color: 'bg-gray-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">Super Admin Dashboard</h1>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-text-light">Welcome back! Here&apos;s your system overview</p>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-serif text-xl font-bold text-green mb-4">Date Range</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="date-from" className="block text-sm font-medium text-text-dark mb-1">
              From
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="date-to" className="block text-sm font-medium text-text-dark mb-1">
              To
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
            />
          </div>
          <button
            onClick={handleApplyDateRange}
            disabled={loading}
            className="px-6 py-2 bg-green text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Error Loading Dashboard</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-4 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && !dashboardData ? (
          // Skeleton loading state
          [1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-28 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : dashboardData && !loading ? (
          stats.map((stat, index) => (
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
          ))
        ) : null}
      </div>
      
      {/* Empty State */}
      {dashboardData && !loading && isEmptyData && (
        <div className="bg-cream border border-yellow/30 rounded-lg p-8 text-center">
          <div className="text-5xl mb-3">📊</div>
          <h3 className="font-serif text-xl font-semibold text-text-dark mb-2">No Activity in Selected Range</h3>
          <p className="text-text-light text-sm">Try selecting a different date range to see data</p>
        </div>
      )}

      {/* Quick Actions */}
      {dashboardData && !loading && (
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
      )}

      {/* Recent Activity */}
      {dashboardData && !loading && (
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
      )}
    </div>
  )
} 





