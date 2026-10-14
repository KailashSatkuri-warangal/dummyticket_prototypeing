'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ExternalLink,
  Mail,
  Plane,
  AlertTriangle,
} from 'lucide-react';
import {
  getBookingByIdOrReference,
  listEmailLogsForBooking,
} from '@/lib/mock/store';
import { formatDuration, formatInr } from '@/lib/config/brand';
import { LazySignatureBoardingPass as SignatureBoardingPass } from '@/components/tickets/LazyBoardingPass';
import { PrototypePdfButton } from '@/components/tickets/PrototypePdfButton';
import { BookingStepper } from '@/components/booking/BookingStepper';
import type { BookingRecord, EmailLogRecord } from '@/types';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get('booking') ?? '';

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [bookingEmails, setBookingEmails] = useState<EmailLogRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    if (!bookingRef) {
      setLoaded(true);
      return;
    }
    getBookingByIdOrReference(bookingRef).then((result) => {
      if (!active) return;
      setBooking(result);
      if (result) setBookingEmails(listEmailLogsForBooking(result.id));
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [bookingRef]);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500">
        Loading demo data…
      </div>
    );
  }

  // Prototype equivalent of the old rule: never show a booking as paid unless
  // the mock store actually recorded a captured payment.
  if (!booking || booking.paymentStatus !== 'captured') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 text-center space-y-4">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-600" />
        <h1 className="section-heading">
          Payment Confirmation Pending or Incomplete
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          We never mark a booking as confirmed solely from a browser redirect. The
          prototype store has not recorded a captured mock payment for reference{' '}
          <span className="font-mono font-bold">{bookingRef}</span>.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href={`/booking/${bookingRef}`}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white"
          >
            Check Booking Status
          </Link>
          <Link
            href="/track-booking"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-navy-900"
          >
            Track Another Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper currentStep="confirmation" />

      {/* Verified Banner */}
      <div className="rounded-2xl border border-verified-500/40 bg-verified-50 p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <CheckCircle2 className="h-8 w-8 text-verified-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-verified-700">
                Prototype Payment Captured (Demo)
              </span>
              <h1 className="text-2xl font-extrabold text-navy-900">
                Booking {booking.bookingReference} Confirmed
              </h1>
              <p className="mt-1 text-xs text-slate-700">
                Payment Status:{' '}
                <strong className="uppercase">{booking.paymentStatus}</strong> ·
                Booking Status:{' '}
                <strong className="uppercase">{booking.status}</strong> ·
                Document Status:{' '}
                <strong className="uppercase">
                  {booking.ticketStatus.replace('_', ' ')}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <PrototypePdfButton booking={booking} label="Download Itinerary PDF" />
            <PrototypePdfButton
              booking={booking}
              label="Download Payment Receipt PDF"
              receipt
            />
            <Link
              href={`/ticket/${booking.bookingReference}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-navy-900 hover:bg-slate-50"
            >
              Full Ticket Page
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Airline PNR Confirmation */}
      {booking.airlinePnr && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 flex items-center gap-3">
          <Plane className="h-5 w-5 text-emerald-700 shrink-0" />
          <div>
            <strong>Demo Reservation Confirmed — Mock Airline PNR {booking.airlinePnr}:</strong>{' '}
            Your itinerary has been issued within the prototype. Simulated e-tickets were
            logged for delivery to {booking.contactEmail}.
          </div>
        </div>
      )}

      {/* Signature 3D Boarding Pass Reveal */}
      {booking.ticket && (
        <SignatureBoardingPass
          booking={booking}
          ticket={booking.ticket}
          animateReveal={true}
          showViewSwitcher={true}
        />
      )}

      {/* Itinerary, Passengers & Fare Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-navy-900">
            Itinerary & Passenger Summary
          </h2>
          <div className="rounded-xl bg-slate-50 p-4 text-xs space-y-1.5">
            <p className="text-sm font-extrabold text-navy-900">
              {booking.originIata} ({booking.flightOffer.origin.city}) →{' '}
              {booking.destinationIata} ({booking.flightOffer.destination.city})
            </p>
            <p className="text-slate-600">
              {booking.flightOffer.airline.name} ·{' '}
              {booking.flightOffer.flightNumber} · Departure:{' '}
              {booking.departureDate}
            </p>
            <p className="text-slate-600">
              Duration: {formatDuration(booking.flightOffer.durationMinutes)} ·
              Cabin: {booking.cabin.toUpperCase()}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Passengers ({booking.passengers.length})
            </h3>
            <ul className="divide-y divide-slate-100 text-xs">
              {booking.passengers.map((p) => (
                <li key={p.id} className="py-2 flex justify-between">
                  <span className="font-semibold text-navy-900">
                    {p.firstName} {p.lastName} ({p.passengerType})
                  </span>
                  <span className="text-slate-500 font-mono">
                    {p.passportNumberMasked
                      ? `Passport: ${p.passportNumberMasked}`
                      : 'Domestic / Standard ID'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-navy-900">
            Separate Payment Receipt & Mock Email Dispatch
          </h2>
          <div className="space-y-2 text-xs">
            {booking.receipt && (
              <div className="flex justify-between text-slate-500 border-b border-slate-100 pb-1.5">
                <span>Receipt Number</span>
                <span className="font-mono font-bold text-brand-700">
                  {booking.receipt.receiptNumber}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Base Fare</span>
              <span className="tabular-nums">{formatInr(booking.fareSnapshot.baseFareTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & Statutory Fees</span>
              <span className="tabular-nums">{formatInr(booking.fareSnapshot.taxesTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Service Fee</span>
              <span className="tabular-nums">{formatInr(booking.fareSnapshot.serviceFeeTotal)}</span>
            </div>
            {booking.fareSnapshot.discountTotal > 0 && (
              <div className="flex justify-between text-verified-700 font-semibold">
                <span>Discount</span>
                <span className="tabular-nums">-{formatInr(booking.fareSnapshot.discountTotal)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-navy-900">
              <span>Total Paid</span>
              <span className="tabular-nums">{formatInr(booking.totalAmount)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-navy-900">
              <Mail className="h-3.5 w-3.5 text-brand-600" />
              <span>Transactional Email Log Entries ({bookingEmails.length} Logged)</span>
            </div>
            <p className="text-slate-600">
              Recipient: <strong>{booking.contactEmail}</strong>
            </p>
            <ul className="space-y-1 pt-1">
              {bookingEmails.map((em) => (
                <li key={em.id} className="flex items-center justify-between text-[11px]">
                  <span className="truncate pr-2 text-slate-700">{em.subject}</span>
                  <span className="rounded bg-verified-50 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-verified-700 border border-verified-200">
                    {em.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href={`/booking/${booking.bookingReference}`}
              className="w-full rounded-xl border border-slate-200 py-2 text-center text-xs font-bold text-navy-900 hover:bg-slate-50"
            >
              Manage Booking & Cancellation Options
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500">
          Loading demo data…
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
