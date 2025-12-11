'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'General Settings', icon: '⚙️' },
    { id: 'booking', name: 'Booking Settings', icon: '📅' },
    { id: 'payment', name: 'Payment Settings', icon: '💳' },
    { id: 'commission', name: 'Commission Settings', icon: '💰' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-green">System Settings</h1>
        <p className="text-text-light mt-1">Configure system-wide settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-smooth ${
                  activeTab === tab.id
                    ? 'text-green border-b-2 border-yellow bg-cream'
                    : 'text-text-light hover:text-green hover:bg-cream/50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Site Name</label>
                <input
                  type="text"
                  defaultValue="Soulter Glamps"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Site Email</label>
                <input
                  type="email"
                  defaultValue="info@soulterglamps.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Contact Phone</label>
                <input
                  type="tel"
                  defaultValue="+92-300-1234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Site Address</label>
                <textarea
                  rows={3}
                  defaultValue="Soulter Glamps, Northern Areas, Pakistan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                ></textarea>
              </div>
              <button className="px-6 py-3 bg-yellow text-green font-semibold rounded-lg hover:bg-yellow-light transition-smooth">
                Save General Settings
              </button>
            </div>
          )}

          {/* Booking Settings */}
          {activeTab === 'booking' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Minimum Booking Days</label>
                <input
                  type="number"
                  defaultValue="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Maximum Booking Days</label>
                <input
                  type="number"
                  defaultValue="14"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Cancellation Period (hours)</label>
                <input
                  type="number"
                  defaultValue="24"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoConfirm"
                  defaultChecked
                  className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                />
                <label htmlFor="autoConfirm" className="text-sm font-medium text-text-dark">
                  Auto-confirm bookings after payment
                </label>
              </div>
              <button className="px-6 py-3 bg-yellow text-green font-semibold rounded-lg hover:bg-yellow-light transition-smooth">
                Save Booking Settings
              </button>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Default Currency</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent">
                  <option value="PKR">PKR - Pakistani Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Advance Payment Percentage</label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-text-dark">Enabled Payment Methods</p>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="easypaisa"
                    defaultChecked
                    className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                  />
                  <label htmlFor="easypaisa" className="text-sm text-text-dark">EasyPaisa</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="bankTransfer"
                    defaultChecked
                    className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                  />
                  <label htmlFor="bankTransfer" className="text-sm text-text-dark">Bank Transfer</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="cash"
                    defaultChecked
                    className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                  />
                  <label htmlFor="cash" className="text-sm text-text-dark">Cash on Arrival</label>
                </div>
              </div>
              <button className="px-6 py-3 bg-yellow text-green font-semibold rounded-lg hover:bg-yellow-light transition-smooth">
                Save Payment Settings
              </button>
            </div>
          )}

          {/* Commission Settings */}
          {activeTab === 'commission' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Default Agent Commission Rate (%)</label>
                <input
                  type="number"
                  defaultValue="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Commission Payment Cycle</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent">
                  <option value="weekly">Weekly</option>
                  <option value="monthly" selected>Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Minimum Commission Amount for Payment</label>
                <input
                  type="number"
                  defaultValue="5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoProcess"
                  defaultChecked
                  className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                />
                <label htmlFor="autoProcess" className="text-sm font-medium text-text-dark">
                  Auto-process commissions at end of cycle
                </label>
              </div>
              <button className="px-6 py-3 bg-yellow text-green font-semibold rounded-lg hover:bg-yellow-light transition-smooth">
                Save Commission Settings
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-text-dark">Email Notifications</p>
                <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
                  <label className="text-sm text-text-dark">New booking received</label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
                  <label className="text-sm text-text-dark">Booking cancelled</label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
                  <label className="text-sm text-text-dark">Payment received</label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
                  <label className="text-sm text-text-dark">Commission processed</label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                  />
                </div>
              </div>
              <button className="px-6 py-3 bg-yellow text-green font-semibold rounded-lg hover:bg-yellow-light transition-smooth">
                Save Notification Settings
              </button>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  defaultValue="60"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Maximum Login Attempts</label>
                <input
                  type="number"
                  defaultValue="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="2fa"
                  className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                />
                <label htmlFor="2fa" className="text-sm font-medium text-text-dark">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ipWhitelist"
                  className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                />
                <label htmlFor="ipWhitelist" className="text-sm font-medium text-text-dark">
                  Enable IP Whitelisting
                </label>
              </div>
              <button className="px-6 py-3 bg-yellow text-green font-semibold rounded-lg hover:bg-yellow-light transition-smooth">
                Save Security Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
