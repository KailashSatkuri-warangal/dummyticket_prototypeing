'use client';

import React, { useEffect, useState } from 'react';
import { listAllPayments } from '@/lib/mock/store';
import { formatInr } from '@/lib/config/brand';
import type { PaymentRecord } from '@/types';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listAllPayments().then((rows) => {
        if (active) setPayments(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (payments === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Razorpay Orders, Signatures & Payment Events
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Inspect server-created Razorpay orders, integer subunit amounts, and HMAC signature verification states.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No payment transactions yet</p>
          <p className="mt-1 text-slate-500">
            Razorpay orders and verified payment records will be recorded here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2.5">Booking Ref</th>
                <th className="px-3 py-2.5">Razorpay Order ID</th>
                <th className="px-3 py-2.5">Payment ID</th>
                <th className="px-3 py-2.5">Amount (INR / Paise)</th>
                <th className="px-3 py-2.5">Signature Verified</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-3 font-mono font-bold text-brand-700">
                    {p.bookingReference}
                  </td>
                  <td className="px-3 py-3 font-mono">{p.razorpayOrderId}</td>
                  <td className="px-3 py-3 font-mono">
                    {p.razorpayPaymentId ?? 'Pending'}
                  </td>
                  <td className="px-3 py-3 font-semibold text-navy-900">
                    {formatInr(p.amountInr)} ({p.amountSubunits} paise)
                  </td>
                  <td className="px-3 py-3">
                    {p.razorpaySignatureVerified ? 'Verified HMAC' : 'Pending'}
                  </td>
                  <td className="px-3 py-3 uppercase font-bold">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
