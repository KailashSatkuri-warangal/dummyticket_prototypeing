'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { getBookingByIdOrReference } from '@/lib/mock/store';
import { LazySignatureBoardingPass as SignatureBoardingPass } from '@/components/tickets/LazyBoardingPass';
import { PrototypePdfButton } from '@/components/tickets/PrototypePdfButton';
import { BookingStepper } from '@/components/booking/BookingStepper';
import type { BookingRecord } from '@/types';

function TicketContent() {
  const params = useParams<{ reference: string }>();
  const reference = params.reference ?? '';

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getBookingByIdOrReference(reference).then((result) => {
      if (!active) return;
      setBooking(result);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [reference]);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500">
        Loading demo data…
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h1 className="section-heading">
          Itinerary Not Found ({reference})
        </h1>
        <p className="text-sm text-slate-600">
          No booking record was found matching this reference. Please check your reference or search for a new flight.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/track-booking"
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
          >
            Lookup Booking Reference
          </Link>
          <Link
            href="/flights"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-slate-50"
          >
            Search Flights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper currentStep="confirmation" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/booking/${booking.bookingReference}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Booking Overview ({booking.bookingReference})
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <PrototypePdfButton booking={booking} label="Download Itinerary PDF" />
          <PrototypePdfButton
            booking={booking}
            label="Download Separate Payment Receipt PDF"
            receipt
          />
        </div>
      </div>

      {/* Confirmed Reservation Banner */}
      <div
        role="region"
        aria-label="Reservation Status"
        className="rounded-2xl border-2 border-verified-500 bg-verified-50 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-verified-700 shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-verified-800">
              {booking.paymentStatus === 'captured'
                ? 'Confirmed Prototype Reservation'
                : 'Itinerary Document'}
            </p>
            <p className="text-[11px] font-medium text-verified-900">
              {booking.airlinePnr
                ? `Mock Airline PNR ${booking.airlinePnr} · Demo token bound to booking ${booking.bookingReference}.`
                : 'This demo itinerary is bound to booking reference ' +
                  booking.bookingReference +
                  ' and is verifiable within the prototype.'}
            </p>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-white border border-verified-200 px-2.5 py-1 text-xs font-bold text-verified-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Demo QR Included
        </span>
      </div>

      {/* Signature Boarding Pass with 3D Flip Reveal & View Switcher */}
      {booking.ticket && (
        <SignatureBoardingPass
          booking={booking}
          ticket={booking.ticket}
          animateReveal={true}
          showViewSwitcher={true}
        />
      )}
    </div>
  );
}

export default function TicketPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500">
          Loading demo data…
        </div>
      }
    >
      <TicketContent />
    </Suspense>
  );
}
