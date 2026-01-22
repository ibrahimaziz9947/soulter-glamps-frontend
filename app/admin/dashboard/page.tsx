"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDashboardSummary, type DashboardSummary } from "@/src/services/dashboard.api";
import { formatRawCurrency } from "@/src/utils/currency";
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
  /* -------------------- SUMMARY STATE (KPIs) -------------------- */
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  /* -------------------- BOOKINGS STATE -------------------- */
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  /* -------------------- FETCH SUMMARY (LAST 30 DAYS) -------------------- */
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        setSummaryError(null);

        // Calculate last 30 days range
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const from = thirtyDaysAgo.toISOString().split('T')[0];
        const to = today.toISOString().split('T')[0];

        console.log('[Dashboard] Fetching summary:', { from, to });

        const data = await fetchDashboardSummary({ from, to });
        setSummary(data);
        console.log('[Dashboard] Summary loaded:', data);
      } catch (err: any) {
        console.error('[Dashboard] Failed to load summary:', err);
        setSummaryError(err.message || 'Failed to load dashboard summary');
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, []);

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
      {summaryError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">Failed to load KPIs</p>
          <p className="text-red-600 text-sm mt-1">{summaryError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingSummary ? (
          /* Loading Skeletons */
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg p-6 animate-pulse"
            >
              <div className="h-8 bg-gray-200 rounded mb-2 w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))
        ) : summary ? (
          /* KPI Cards */
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-green mb-2">
                {summary.totalBookings}
              </h3>
              <p className="text-sm text-text-light">Total Bookings</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-green mb-2">
                {formatRawCurrency(summary.revenueCents)}
              </h3>
              <p className="text-sm text-text-light">Booking Revenue</p>
              <p className="text-xs text-text-light mt-1">From bookings</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-green mb-2">
                {summary.occupancyRatePercent}%
              </h3>
              <p className="text-sm text-text-light">Occupancy Rate</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-green mb-2">
                {summary.activeStaff}
              </h3>
              <p className="text-sm text-text-light">Active Staff</p>
            </div>
          </>
        ) : null}
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
