'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RotateCcw, LifeBuoy } from 'lucide-react';
import { getBookingByIdOrReference } from '@/lib/mock/store';
import type { BookingRecord } from '@/types';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get('booking') ?? '';
  const reason =
    searchParams.get('reason') ??
    'The prototype payment was cancelled, timed out, or simulated as failed.';

  const [booking, setBooking] = useState<BookingRecord | null>(null);
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

  const retryHref = booking ? `/checkout/${booking.flightOfferId}` : '/flights';

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center space-y-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <XCircle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-navy-900">
        Prototype Payment Incomplete or Declined
      </h1>
      <p className="text-sm text-slate-600 leading-relaxed">{reason}</p>
      {bookingRef && (
        <p className="text-xs font-mono text-slate-500">
          Booking Reference: <strong>{bookingRef}</strong> (No amount has been captured)
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
        <Link
          href={retryHref}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Prototype Checkout
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-slate-50"
        >
          <LifeBuoy className="h-4 w-4 text-brand-600" />
          Contact Billing Support
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500">
          Loading demo data…
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
