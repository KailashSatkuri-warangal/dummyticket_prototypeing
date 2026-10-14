import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions — Booking & Itinerary Rules',
  description:
    'Review the governing terms for flight searches, fare snapshots, itinerary documents, and confirmed airline reservations.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card space-y-4 text-xs text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-navy-900">
          Terms and Conditions
        </h1>
        <h2 className="text-sm font-bold text-navy-900">
          1. Nature of Documents Issued
        </h2>
        <p>
          Upon verified payment, the platform issues a confirmed itinerary document together with a separate payment receipt. Itinerary documents carry the airline confirmation (PNR) associated with the reservation and must not be presented as boarding passes at the airport; boarding passes are issued by the airline during check-in.
        </p>
        <h2 className="text-sm font-bold text-navy-900">
          2. Server-Side Fare Calculation & Revalidation
        </h2>
        <p>
          All fares are calculated on the server and stored as time-limited Fare Snapshots. If a fare changes prior to payment order creation, the updated total is presented for explicit user acceptance.
        </p>
      </div>
    </div>
  );
}
