'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listAllBookings } from '@/lib/mock/store';
import { formatInr } from '@/lib/config/brand';
import { AdminActionTrigger } from '@/components/admin/AdminActionTrigger';
import type { BookingRecord } from '@/types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listAllBookings().then((rows) => {
        if (active) setBookings(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (bookings === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Booking Operations & Fulfillment Controls
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Search bookings, resend transactional emails, and verify provider ticket issuance policies. Bookings cannot be manually marked as airline-ticketed without provider confirmation details.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No bookings recorded yet</p>
          <p className="mt-1 text-slate-500">
            Bookings created by travelers will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2.5">Reference</th>
                <th className="px-3 py-2.5">Route</th>
                <th className="px-3 py-2.5">Booking / Payment</th>
                <th className="px-3 py-2.5">PNR</th>
                <th className="px-3 py-2.5">Amount</th>
                <th className="px-3 py-2.5">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="px-3 py-3 font-mono font-bold text-brand-700">
                    <Link
                      href={`/booking/${b.bookingReference}`}
                      className="hover:underline"
                    >
                      {b.bookingReference}
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-semibold text-navy-900">
                    {b.originIata} → {b.destinationIata} ({b.departureDate})
                  </td>
                  <td className="px-3 py-3 uppercase">
                    <strong>{b.status}</strong> / {b.paymentStatus}
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px]">
                    {b.airlinePnr ?? '—'}
                  </td>
                  <td className="px-3 py-3 font-bold text-navy-900">
                    {formatInr(b.totalAmount)}
                  </td>
                  <td className="px-3 py-3 space-x-2 whitespace-nowrap">
                    <AdminActionTrigger
                      label="Resend Email"
                      variant="secondary"
                      payload={{
                        action: 'RESEND_BOOKING_EMAIL',
                        bookingReference: b.bookingReference,
                      }}
                    />
                    <AdminActionTrigger
                      label="Confirm Ticket Issuance"
                      variant="warning"
                      payload={{
                        action: 'MARK_BOOKING_TICKETED',
                        bookingReference: b.bookingReference,
                        providerBookingRef: b.providerBookingRef,
                        airlinePnr: b.airlinePnr,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
