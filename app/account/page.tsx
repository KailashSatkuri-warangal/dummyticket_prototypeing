import React from 'react';
import Link from 'next/link';
import {
  listUserBookings,
  listUserNotifications,
  getSessionUser,
} from '@/lib/mock/store';
import { formatInr } from '@/lib/config/brand';
import { ArrowRight, Download, Plane, Bell } from 'lucide-react';

export default async function AccountOverviewPage() {
  const user = await getSessionUser();
  const bookings = user ? await listUserBookings(user.id) : [];
  const notifications = user ? await listUserNotifications(user.id) : [];

  const confirmedCount = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'ticketed'
  ).length;
  const pendingCount = bookings.filter(
    (b) => b.status === 'awaiting_payment' || b.status === 'pending'
  ).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Customer Dashboard Overview
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Review upcoming journeys, payment statuses, and downloadable itinerary documents.
          </p>
        </div>
        <Link
          href="/flights?from=HYD&to=DEL&depart=2026-12-15&adults=1&cabin=economy"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          <Plane className="h-4 w-4" />
          Quick Flight Search
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-500">Total Bookings</p>
          <p className="mt-2 text-3xl font-extrabold text-navy-900">
            {bookings.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-500">
            Confirmed / Ticketed
          </p>
          <p className="mt-2 text-3xl font-extrabold text-verified-600">
            {confirmedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-500">
            Pending Payment
          </p>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-900">
            Recent Bookings & Itineraries
          </h2>
          <Link
            href="/account/bookings"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            View all bookings <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm font-bold text-navy-900">
              No bookings created yet
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Search available routes to generate your verified itinerary.
            </p>
            <Link
              href="/flights"
              className="inline-flex rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
            >
              Search Flights
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-brand-700">
                    {b.bookingReference}
                  </p>
                  <p className="font-semibold text-navy-900 mt-0.5">
                    {b.originIata} → {b.destinationIata} · Departure: {b.departureDate}
                  </p>
                  <p className="text-slate-500">
                    {b.passengers.length} Passenger(s) · Status:{' '}
                    <strong className="uppercase">{b.status}</strong> · Payment:{' '}
                    <strong className="uppercase">{b.paymentStatus}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-navy-900 mr-2">
                    {formatInr(b.totalAmount)}
                  </span>
                  <Link
                    href={`/account/bookings/${b.bookingReference}`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-navy-900 hover:bg-slate-50"
                  >
                    Details
                  </Link>
                  <a
                    href={`/api/tickets/${b.bookingReference}/pdf`}
                    className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 font-bold text-white hover:bg-brand-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest Notifications */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-3">
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand-600" />
          Latest Account Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">
            No notifications yet. Alerts about booking milestones and payments will appear here.
          </p>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-navy-900">{n.title}</p>
                  <p className="text-slate-600">{n.message}</p>
                </div>
                {n.actionUrl && (
                  <Link
                    href={n.actionUrl}
                    className="font-semibold text-brand-600 hover:underline shrink-0 ml-4"
                  >
                    Open →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
