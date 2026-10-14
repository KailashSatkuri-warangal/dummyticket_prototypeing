import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy — Statutory Taxes & Razorpay Settlement Timelines',
  description:
    'Understand refund eligibility, statutory tax refunds, and server-side Razorpay refund processing.',
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card space-y-4 text-xs text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-navy-900">Refund Policy</h1>
        <p>
          Refund eligibility is governed by the Fare Rule attached to your booking snapshot (`ECO_SAVER`, `ECO_FLEX`, `PREM_ECO_FLEX`, `BIZ_ELITE`, or `FIRST_ROYAL`).
        </p>
        <p>
          Even on non-refundable base fares, unused statutory airport taxes are refundable when cancelled prior to the departure cut-off window. Approved refunds are processed back to the original payment method via Razorpay within 5–7 business days.
        </p>
      </div>
    </div>
  );
}
