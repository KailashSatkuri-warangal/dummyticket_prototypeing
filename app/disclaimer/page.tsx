import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Booking & Aviation Compliance Disclaimer',
  description:
    'Important legal disclosure regarding itinerary documents, airline reservations, and payment receipts.',
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border-2 border-brand-200 bg-white p-8 shadow-card space-y-4 text-xs text-slate-700 leading-relaxed">
        <div className="flex items-center gap-2 text-brand-700 font-extrabold text-sm uppercase">
          <ShieldCheck className="h-5 w-5" />
          <span>Booking & Aviation Compliance Disclaimer</span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900">
          Document Classification & Intended Use
        </h1>
        <p>
          <strong>1. Itinerary Documents:</strong> Itineraries issued through this platform are confirmed reservation documents carrying the airline confirmation (PNR) associated with your booking. They are intended for travel documentation and planning purposes. A boarding pass is issued separately by the airline during check-in; an itinerary PDF from this platform is not a boarding pass.
        </p>
        <p>
          <strong>2. Payment Receipts:</strong> Payment receipts (<code>DT-RCPT-...</code>) are financial documents confirming payment capture only. They are not airline tickets and do not confer any right to travel.
        </p>
        <p>
          <strong>3. Verification:</strong> Every itinerary includes a QR code linking to a server-verified status page so the reservation and its confirmation details can be independently checked.
        </p>
      </div>
    </div>
  );
}
