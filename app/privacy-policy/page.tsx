import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Passenger Data Protection & Retention',
  description:
    'Learn how we collect, mask, and protect passenger information, payment references, and marketing consent.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card space-y-4 text-xs text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-navy-900">Privacy Policy</h1>
        <p className="text-slate-500">Effective Date: October 13, 2026</p>
        <h2 className="text-sm font-bold text-navy-900">
          1. Data Minimization & Travel Documents
        </h2>
        <p>
          We collect only the passenger information necessary to generate your requested itinerary or fulfill an authorized flight reservation (name, contact email, phone number, and passport details only when required for international travel). Passport numbers are masked (`****1234`) in persistent records.
        </p>
        <h2 className="text-sm font-bold text-navy-900">
          2. Payment Security
        </h2>
        <p>
          We never store raw card numbers, CVV codes, or UPI PINs. All payments are processed by Razorpay using server-side order creation and cryptographic signature verification.
        </p>
        <h2 className="text-sm font-bold text-navy-900">
          3. Consent & Account Deletion
        </h2>
        <p>
          Marketing emails and saved traveler details require explicit opt-in consent. Users may request account deletion at any time via <code>/account/security</code>.
        </p>
      </div>
    </div>
  );
}
