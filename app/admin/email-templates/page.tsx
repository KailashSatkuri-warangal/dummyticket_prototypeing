'use client';

import React, { useEffect, useState } from 'react';
import { listAllEmailLogs } from '@/lib/mock/store';
import type { EmailLogRecord } from '@/types';

export default function AdminEmailTemplatesPage() {
  const [emailLogs, setEmailLogs] = useState<EmailLogRecord[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listAllEmailLogs().then((rows) => {
        if (active) setEmailLogs(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (emailLogs === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  const templateCatalog = [
    'welcome_verification',
    'password_reset',
    'booking_initiated',
    'booking_confirmation',
    'payment_receipt',
    'itinerary_document',
    'payment_pending',
    'payment_successful',
    'payment_failed',
    'ticket_issued',
    'booking_cancelled',
    'refund_initiated',
    'refund_completed',
    'fare_changed',
    'booking_update',
    'admin_booking_alert',
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h1 className="text-xl font-extrabold text-navy-900">
          Transactional Email Templates & Delivery Logs
        </h1>
        <p className="text-xs text-slate-600">
          Emails distinguish between <code>queued</code>, <code>sent</code>,{' '}
          <code>delivered</code>, <code>bounced</code>, and <code>failed</code> states.
        </p>
        <div className="flex flex-wrap gap-2">
          {templateCatalog.map((tpl) => (
            <span
              key={tpl}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-navy-900"
            >
              {tpl}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h2 className="text-base font-bold text-navy-900">
          Email Delivery Log ({emailLogs.length})
        </h2>
        {emailLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No transactional emails dispatched yet. Lifecycle emails are logged here in real time.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {emailLogs.map((em) => (
              <div key={em.id} className="py-3 flex justify-between gap-4">
                <div>
                  <p className="font-bold text-navy-900">{em.subject}</p>
                  <p className="text-slate-500 truncate">
                    To: {em.recipientEmail} · Template: {em.templateName} · MsgID:{' '}
                    {em.providerMessageId ?? '—'}
                  </p>
                </div>
                <span className="rounded bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-brand-700 self-start shrink-0">
                  {em.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
