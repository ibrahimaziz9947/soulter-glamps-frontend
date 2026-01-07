"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuthToken } from "../../../src/lib/auth";

type Booking = {
  id: string;
  customerName: string;
  glampName?: string; // Legacy field
  status: string;
  createdAt: string;
  glamp?: {
    name: string;
  };
};

export default function DashboardPage() {
  return <DashboardContent />;
}

function DashboardContent() {
  /* -------------------- STATIC STATS (UNCHANGED) -------------------- */
  const stats = [
    { name: "Total Bookings", value: "127", change: "+12%" },
    { name: "Revenue", value: "$45,231", change: "+18%" },
    { name: "Occupancy Rate", value: "78%", change: "+5%" },
    { name: "Active Staff", value: "24", change: "+2" },
  ];

  /* -------------------- BOOKINGS STATE -------------------- */
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  /* -------------------- FETCH BOOKINGS (CLIENT ONLY) -------------------- */
  useEffect(() => {
    const fetchBookings = async () => {
      const token = getAuthToken();

      if (!token) {
        setBookingError("No auth token found");
        setLoadingBookings(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/bookings`,
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
        setRecentBookings(json.data.slice(0, 5)); // latest 5
      } catch (err: any) {
        setBookingError(err.message);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
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
            <p className="text-sm text-text-light">
              Loading bookings...
            </p>
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
                        {booking.glamp?.name || booking.glampName || 'Unknown'}
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

        {/* Quick Actions (UNCHANGED) */}
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
