import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center — Booking Lookup, Tickets & Refunds',
  description:
    'Find step-by-step help for flight searches, itinerary downloads, Razorpay payment verification, and cancellations.',
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card space-y-4">
        <h1 className="text-3xl font-extrabold text-navy-900">Help Center</h1>
        <p className="text-sm text-slate-600">
          Select a topic below or use our direct booking lookup tool.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-3 text-xs">
          <Link
            href="/track-booking"
            className="rounded-xl border border-slate-200 p-4 hover:border-brand-500"
          >
            <h2 className="font-bold text-sm text-navy-900">
              Track & Download Your Itinerary
            </h2>
            <p className="mt-1 text-slate-600">
              Retrieve your booking by reference code and download a printable A4 PDF.
            </p>
          </Link>
          <Link
            href="/faq"
            className="rounded-xl border border-slate-200 p-4 hover:border-brand-500"
          >
            <h2 className="font-bold text-sm text-navy-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-slate-600">
              Answers on itineraries, PNRs, fare snapshots, and baggage rules.
            </p>
          </Link>
          <Link
            href="/refund-policy"
            className="rounded-xl border border-slate-200 p-4 hover:border-brand-500"
          >
            <h2 className="font-bold text-sm text-navy-900">
              Refund & Cancellation Rules
            </h2>
            <p className="mt-1 text-slate-600">
              Understand statutory tax refunds, cancellation windows, and Razorpay settlement timelines.
            </p>
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-200 p-4 hover:border-brand-500"
          >
            <h2 className="font-bold text-sm text-navy-900">
              Open a Support Ticket
            </h2>
            <p className="mt-1 text-slate-600">
              Contact our support agents for billing or itinerary assistance.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
