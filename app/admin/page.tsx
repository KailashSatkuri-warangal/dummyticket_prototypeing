'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  listAllBookings,
  listAllEmailLogs,
  listAllProfiles,
  listAuditLogs,
} from '@/lib/mock/store';
import { formatInr } from '@/lib/config/brand';
import type { ProfileRecord } from '@/lib/mock/types';
import type { AuditLogRecord, BookingRecord, EmailLogRecord } from '@/types';

interface OverviewData {
  bookings: BookingRecord[];
  users: ProfileRecord[];
  emailLogs: EmailLogRecord[];
  auditLogs: AuditLogRecord[];
}

function loadOverviewData(): Promise<OverviewData> {
  return Promise.all([
    listAllBookings(),
    listAllProfiles(),
    listAllEmailLogs(),
    listAuditLogs(10),
  ]).then(([bookings, users, emailLogs, auditLogs]) => ({
    bookings,
    users,
    emailLogs,
    auditLogs,
  }));
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      loadOverviewData().then((next) => {
        if (active) setData(next);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (data === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  const { bookings, users, emailLogs, auditLogs } = data;

  const totalCollectedInr = bookings
    .filter((b) => b.paymentStatus === 'captured')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const liveBookingsCount = bookings.filter(
    (b) => b.fulfillmentMode === 'live_provider'
  ).length;
  const pendingBookingsCount = bookings.filter(
    (b) => b.status === 'awaiting_payment' || b.status === 'pending'
  ).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <span className="eyebrow">
          Executive Operations Console
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-navy-900">
          Admin Dashboard Overview
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Real-time metrics across users, live bookings, Razorpay collections, email delivery logs, and audit events.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-500">
            Total Registered Users
          </p>
          <p className="mt-2 text-2xl font-extrabold text-navy-900">
            {users.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-500">
            Total Bookings
          </p>
          <p className="mt-2 text-2xl font-extrabold text-brand-700">
            {bookings.length} · {liveBookingsCount} Provider-Confirmed
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-500">
            Verified Payments Collected
          </p>
          <p className="mt-2 text-2xl font-extrabold text-verified-600">
            {formatInr(totalCollectedInr)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-500">
            Pending / Email Logs
          </p>
          <p className="mt-2 text-2xl font-extrabold text-amber-600">
            {pendingBookingsCount} Pending · {emailLogs.length} Emails
          </p>
        </div>
      </div>

      {/* Recent Bookings & System Audit Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">
              Latest Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Manage all →
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {bookings.length === 0 ? (
              <p className="py-3 text-slate-500">
                No bookings recorded yet. New traveler bookings appear here instantly.
              </p>
            ) : (
              bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-mono font-bold text-brand-700">
                      {b.bookingReference}
                    </p>
                    <p className="text-slate-600">
                      {b.originIata} → {b.destinationIata} ({b.status})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-navy-900">
                      {formatInr(b.totalAmount)}
                    </p>
                    <span className="text-[10px] uppercase text-slate-500">
                      {b.airlinePnr ? `PNR ${b.airlinePnr}` : b.fulfillmentMode}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">
              Recent Audit Log Events
            </h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Full Audit Trail →
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.length === 0 ? (
              <p className="py-3 text-slate-500">
                No audit events recorded yet.
              </p>
            ) : (
              auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3">
                  <div className="flex justify-between font-semibold text-navy-900">
                    <span>{log.action}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {log.correlationId}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Actor: {log.actorEmail} · Resource: {log.resourceType}/
                    {log.resourceId}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
