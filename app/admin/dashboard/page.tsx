/*
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function DashboardPage() {
  // ...existing code...

  return <DashboardContent />;
}

function DashboardContent() {
  const stats = [
    {
      name: 'Total Bookings',
      value: '127',
      change: '+12%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Revenue',
      value: '$45,231',
      change: '+18%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Occupancy Rate',
      value: '78%',
      change: '+5%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Active Staff',
      value: '24',
      change: '+2',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ]

  const recentBookings = [
    { id: 'BK-001', guest: 'Sarah Johnson', glamp: 'Luxury Safari Tent', checkIn: '2025-12-15', status: 'confirmed' },
    { id: 'BK-002', guest: 'Michael Chen', glamp: 'Geodesic Dome', checkIn: '2025-12-18', status: 'pending' },
    { id: 'BK-003', guest: 'Emily Davis', glamp: 'Treehouse Suite', checkIn: '2025-12-20', status: 'confirmed' },
    { id: 'BK-004', guest: 'Robert Wilson', glamp: 'Woodland Cabin', checkIn: '2025-12-22', status: 'confirmed' },
    { id: 'BK-005', guest: 'Lisa Anderson', glamp: 'Riverside Yurt', checkIn: '2025-12-25', status: 'pending' },
  ]

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Dashboard</h1>
          <p className="text-text-light mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-light">Today's Date</p>
          <p className="font-semibold text-green">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-lg p-6 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center text-green">
                {stat.icon}
              </div>
              <span className="text-sm font-semibold text-green bg-green/10 px-3 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-green mb-1">{stat.value}</h3>
            <p className="text-sm text-text-light">{stat.name}</p>
          </div>
        ))}
      </div>

  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-green">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-yellow hover:text-yellow-light font-semibold">
              View All →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Accommodation</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-dark">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-3 px-4">
                      <Link href={`/admin/bookings/view/${booking.id}`} className="text-yellow hover:text-yellow-light font-medium">
                        {booking.id}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-text-dark">{booking.guest}</td>
                    <td className="py-3 px-4 text-text-light text-sm">{booking.glamp}</td>
                    <td className="py-3 px-4 text-text-light text-sm">{booking.checkIn}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' 
                          ? 'bg-green/10 text-green' 
                          : 'bg-yellow/10 text-yellow'
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

    
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-serif text-2xl font-bold text-green mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/admin/bookings/add"
                className="flex items-center gap-3 p-3 bg-cream hover:bg-yellow/10 rounded-lg transition-smooth group"
              >
                <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-green">New Booking</span>
              </Link>

              <Link 
                href="/admin/glamps/add"
                className="flex items-center gap-3 p-3 bg-cream hover:bg-yellow/10 rounded-lg transition-smooth group"
              >
                <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-green">Add Glamp</span>
              </Link>

              <Link 
                href="/admin/staff/add"
                className="flex items-center gap-3 p-3 bg-cream hover:bg-yellow/10 rounded-lg transition-smooth group"
              >
                <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-green">Add Staff Member</span>
              </Link>

              <Link 
                href="/admin/inventory/add"
                className="flex items-center gap-3 p-3 bg-cream hover:bg-yellow/10 rounded-lg transition-smooth group"
              >
                <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-green">Add Inventory</span>
              </Link>
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-serif text-xl font-bold text-green mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-cream rounded-lg">
                <div className="w-2 h-2 bg-green rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green">Check-ins: 3 guests</p>
                  <p className="text-xs text-text-light">Expected between 3-6 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-cream rounded-lg">
                <div className="w-2 h-2 bg-yellow rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green">Check-outs: 2 guests</p>
                  <p className="text-xs text-text-light">Before 11 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-cream rounded-lg">
                <div className="w-2 h-2 bg-green rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green">Maintenance</p>
                  <p className="text-xs text-text-light">Dome cleaning at 1 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-green">Glamp Availability</h2>
          <Link href="/admin/glamps" className="text-sm text-yellow hover:text-yellow-light font-semibold">
            Manage →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Luxury Safari Tent', 'Geodesic Dome', 'Treehouse Suite', 'Woodland Cabin', 'Riverside Yurt', 'Mountain View Pod'].map((glamp, index) => (
            <div key={glamp} className="p-4 border border-gray-200 rounded-lg hover:border-yellow transition-smooth">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green">{glamp}</h4>
                <span className={`w-3 h-3 rounded-full ${index % 3 === 0 ? 'bg-green' : index % 3 === 1 ? 'bg-yellow' : 'bg-red-500'}`}></span>
              </div>
              <p className="text-sm text-text-light">
                {index % 3 === 0 ? 'Available' : index % 3 === 1 ? 'Occupied' : 'Maintenance'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} */






"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
//import { getAuthToken } from "@lib/auth";
import { getAuthToken } from "@lib/auth";

const token = getAuthToken();

if (!token) {
  throw new Error("No auth token found");
} 

type Booking = {
  id: string;
  customerName: string;
  glampName: string;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  return <DashboardContent />;
}

function DashboardContent() {
  /* -------------------- STATS (STILL STATIC FOR NOW) -------------------- */
  const stats = [
    { name: "Total Bookings", value: "127", change: "+12%" },
    { name: "Revenue", value: "$45,231", change: "+18%" },
    { name: "Occupancy Rate", value: "78%", change: "+5%" },
    { name: "Active Staff", value: "24", change: "+2" },
  ];

  /* -------------------- RECENT BOOKINGS (API POWERED) -------------------- */
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        setLoadingBookings(true);

        const token = localStorage.getItem("admintoken");
        if (!token) {
          throw new Error("No auth token found");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const json = await res.json();

        setRecentBookings(json.data.slice(0, 5)); // show only 5
      } catch (err: any) {
        setBookingError(err.message);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchRecentBookings();
  }, []);

  /* -------------------- UI -------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">
            Dashboard
          </h1>
          <p className="text-text-light mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-light">Today's Date</p>
          <p className="font-semibold text-green">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between mb-2">
              <h3 className="text-2xl font-bold text-green">{stat.value}</h3>
              <span className="text-sm text-green bg-green/10 px-3 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-text-light">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-green">
              Recent Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-yellow hover:text-yellow-light font-semibold"
            >
              View All →
            </Link>
          </div>

          {loadingBookings && (
            <p className="text-sm text-text-light">Loading bookings...</p>
          )}

          {bookingError && (
            <p className="text-sm text-red-500">{bookingError}</p>
          )}

          {!loadingBookings && !bookingError && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Booking ID</th>
                    <th className="text-left py-3 px-4">Guest</th>
                    <th className="text-left py-3 px-4">Accommodation</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b hover:bg-cream/50 transition"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/bookings/view/${booking.id}`}
                          className="text-yellow font-medium"
                        >
                          {booking.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        {booking.customerName}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-light">
                        {booking.glampName}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-light">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "CONFIRMED"
                              ? "bg-green/10 text-green"
                              : "bg-yellow/10 text-yellow"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (UNCHANGED) */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-serif text-2xl font-bold text-green mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/admin/bookings/add" className="block bg-cream p-3 rounded-lg">
                + New Booking
              </Link>
              <Link href="/admin/glamps/add" className="block bg-cream p-3 rounded-lg">
                + Add Glamp
              </Link>
              <Link href="/admin/staff/add" className="block bg-cream p-3 rounded-lg">
                + Add Staff Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
