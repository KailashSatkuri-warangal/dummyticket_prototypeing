import React from 'react';
import Link from 'next/link';
import {
  getBookingByIdOrReference,
  getSessionUser,
} from '@/lib/mock/store';
import { formatInr } from '@/lib/config/brand';
import { CancelBookingButton } from '@/components/booking/CancelBookingButton';
import { Download, ExternalLink } from 'lucide-react';
type Passenger = {
  id: string;
  firstName: string;
  lastName: string;
  passengerType: string;
  ticketNumber?: string | null;
};
export default async function AccountSingleBookingPage(props: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await props.params;
  const [user, booking] = await Promise.all([
    getSessionUser(),
    getBookingByIdOrReference(bookingId),
  ]);

  if (!booking) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-3 text-center">
        <h1 className="text-xl font-extrabold text-navy-900">
          Booking Not Found
        </h1>
        <p className="text-xs text-slate-600">
          No itinerary matching <span className="font-mono">{bookingId}</span> is
          linked to your account.
        </p>
        <Link
          href="/account/bookings"
          className="inline-flex rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
        >
          Back to My Bookings
        </Link>
      </div>
    );
  }

  if (booking.userId && booking.userId !== user?.id && user?.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-3 text-center">
        <h1 className="text-xl font-extrabold text-navy-900">
          Access Restricted
        </h1>
        <p className="text-xs text-slate-600">
          This booking record belongs to a different account.
        </p>
        <Link
          href="/account/bookings"
          className="inline-flex rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
        >
          Back to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-brand-600">
              Account Booking Record
            </span>
            <h1 className="text-2xl font-extrabold text-navy-900">
              {booking.bookingReference} · {booking.originIata} →{' '}
              {booking.destinationIata}
            </h1>
            <p className="text-xs text-slate-500">
              Departure: {booking.departureDate} · Status:{' '}
              <strong className="uppercase">{booking.status}</strong> · Payment:{' '}
              <strong className="uppercase">{booking.paymentStatus}</strong>
              {booking.airlinePnr ? (
                <>
                  {' '}
                  · PNR:{' '}
                  <strong className="font-mono">{booking.airlinePnr}</strong>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/booking/${booking.bookingReference}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50"
            >
              Manage Booking <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <a
              href={`/api/tickets/${booking.bookingReference}/pdf`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-xl bg-slate-50 p-4 space-y-1.5">
            <p className="font-bold text-navy-900">Passengers</p>
            {booking.passengers.map((p: Passenger) => (
              <p key={p.id}>
                • {p.firstName} {p.lastName} ({p.passengerType})
                {p.ticketNumber ? (
                  <span className="ml-1 font-mono text-[10px] text-slate-500">
                    eTk#{p.ticketNumber}
                  </span>
                ) : null}
              </p>
            ))}
          </div>
          <div className="rounded-xl bg-slate-50 p-4 space-y-1.5">
            <p className="font-bold text-navy-900">Audited Fare Total</p>
            <p>Base: {formatInr(booking.fareSnapshot.baseFareTotal)}</p>
            <p>Taxes: {formatInr(booking.fareSnapshot.taxesTotal)}</p>
            <p className="font-extrabold text-sm text-brand-700">
              Total: {formatInr(booking.totalAmount)}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <CancelBookingButton
            bookingReference={booking.bookingReference}
            disabled={
              booking.status === 'cancelled' ||
              booking.status === 'cancel_requested'
            }
          />
        </div>
      </div>
    </div>
  );
}
