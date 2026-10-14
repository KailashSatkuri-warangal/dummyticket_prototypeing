import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation Policy — Cut-Off Windows & Fare Penalties',
  description:
    'Review online cancellation workflows, cancellation fees, and date-change penalties.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card space-y-4 text-xs text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-navy-900">
          Cancellation Policy
        </h1>
        <p>
          Customers can initiate cancellations directly from <code>/booking/[bookingId]</code> or <code>/account/bookings</code>. Unpaid pending bookings are cancelled immediately without penalty. Paid bookings transition to <code>cancel_requested</code> and initiate an automated refund calculation based on the locked Fare Rule.
        </p>
      </div>
    </div>
  );
}
