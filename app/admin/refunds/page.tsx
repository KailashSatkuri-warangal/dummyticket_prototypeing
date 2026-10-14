'use client';

import React, { useEffect, useState } from 'react';
import { listAllRefunds } from '@/lib/mock/store';
import { formatInr } from '@/lib/config/brand';
import { AdminActionTrigger } from '@/components/admin/AdminActionTrigger';
import type { RefundRecord } from '@/lib/mock/types';

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<RefundRecord[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listAllRefunds().then((rows) => {
        if (active) setRefunds(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (refunds === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Refund Requests & Settlement Queue
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Authorize server-side refund settlements and update booking & payment states.
        </p>
      </div>

      {refunds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No refund requests pending</p>
          <p className="mt-1 text-slate-500">
            Customer cancellation and refund requests will appear here for review.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2.5">Refund ID</th>
                <th className="px-4 py-2.5">Booking Ref</th>
                <th className="px-4 py-2.5">Amount</th>
                <th className="px-4 py-2.5">Reason</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {refunds.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    {r.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-brand-700">
                    {r.bookingReference}
                  </td>
                  <td className="px-4 py-3 font-bold text-navy-900">
                    {formatInr(r.amountInr)}
                  </td>
                  <td className="px-4 py-3">{r.reason}</td>
                  <td className="px-4 py-3 uppercase font-bold">{r.status}</td>
                  <td className="px-4 py-3">
                    {r.status !== 'processed' && (
                      <AdminActionTrigger
                        label="Approve & Process Refund"
                        payload={{
                          action: 'PROCESS_REFUND',
                          refundId: r.id,
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
