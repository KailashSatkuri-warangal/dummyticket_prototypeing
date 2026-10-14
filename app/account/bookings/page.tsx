'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BookingRecord } from '@/types';
import { formatInr } from '@/lib/config/brand';
import { Download } from 'lucide-react';
import { EmptyBookingsIllustration } from '@/components/brand/EmptyBookingsIllustration';

export default function AccountBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filter, setFilter] = useState<
    'all' | 'upcoming' | 'completed' | 'cancelled' | 'pending'
  >('all');

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((d: { bookings?: BookingRecord[] }) => {
        if (d.bookings) setBookings(d.bookings);
      })
      .catch(() => {});
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming')
      return b.status === 'confirmed' || b.status === 'ticketed';
    if (filter === 'completed') return b.paymentStatus === 'captured';
    if (filter === 'cancelled')
      return b.status === 'cancelled' || b.status === 'cancel_requested';
    if (filter === 'pending')
      return b.status === 'awaiting_payment' || b.status === 'pending';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-navy-900">
              My Bookings
            </h1>
            <p className="text-xs text-slate-600">
              Filter by booking state, view fare breakdowns, or download boarding-pass itineraries and receipts.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'completed', label: 'Paid' },
                { id: 'pending', label: 'Pending' },
                { id: 'cancelled', label: 'Cancelled' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  filter === tab.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
            <EmptyBookingsIllustration className="h-32 w-44" />
            <p className="mt-3 text-sm font-bold text-navy-900">
              No bookings in this filter state
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Search available routes or switch tabs above to view your active DummyTicket itineraries.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Route & Date</th>
                  <th className="px-4 py-3">Passengers</th>
                  <th className="px-4 py-3">Booking Status</th>
                  <th className="px-4 py-3">Payment Status</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-mono font-bold text-brand-700">
                      {b.bookingReference}
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy-900">
                      {b.originIata} → {b.destinationIata} ({b.departureDate})
                    </td>
                    <td className="px-4 py-3 tabular-nums">{b.passengers.length}</td>
                    <td className="px-4 py-3 uppercase font-semibold">
                      {b.status}
                    </td>
                    <td className="px-4 py-3 uppercase">{b.paymentStatus}</td>
                    <td className="px-4 py-3 font-bold tabular-nums text-navy-900">
                      {formatInr(b.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/account/bookings/${b.bookingReference}`}
                        className="text-brand-600 font-bold hover:underline"
                      >
                        Inspect
                      </Link>
                      <a
                        href={`/api/tickets/${b.bookingReference}/pdf`}
                        className="inline-flex items-center gap-1 text-coral-600 font-semibold hover:underline"
                      >
                        <Download className="h-3 w-3" />
                        Ticket
                      </a>
                      <a
                        href={`/api/tickets/${b.bookingReference}/pdf?type=receipt`}
                        className="inline-flex items-center gap-1 text-navy-900 font-semibold hover:underline"
                      >
                        <Download className="h-3 w-3" />
                        Receipt
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
