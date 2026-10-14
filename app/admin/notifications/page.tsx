'use client';

import React, { useEffect, useState } from 'react';
import { listAllNotifications } from '@/lib/mock/store';
import type { NotificationItem } from '@/types';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[] | null>(
    null
  );

  useEffect(() => {
    let active = true;
    function reload() {
      listAllNotifications().then((rows) => {
        if (active) setNotifications(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (notifications === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          System & Customer Notifications Log
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Inspect real-time notifications dispatched to customer accounts.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No notifications dispatched yet</p>
          <p className="mt-1 text-slate-500">
            Booking, payment, and itinerary alerts appear here as customers transact.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 text-xs">
          {notifications.map((n) => (
            <div key={n.id} className="py-3 flex justify-between gap-4">
              <div>
                <p className="font-bold text-navy-900">{n.title}</p>
                <p className="text-slate-600">
                  {n.message}
                  {n.bookingReference ? (
                    <span className="ml-1 font-mono text-slate-400">
                      · {n.bookingReference}
                    </span>
                  ) : null}
                </p>
              </div>
              <span className="font-mono text-slate-400 shrink-0">
                {n.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
