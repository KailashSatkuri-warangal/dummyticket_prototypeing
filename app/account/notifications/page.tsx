'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NotificationItem } from '@/types';
import { CheckCheck } from 'lucide-react';

export default function AccountNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((d: { notifications?: NotificationItem[] }) => {
        if (d.notifications) setItems(d.notifications);
      })
      .catch(() => {});
  }, []);

  async function markAllAsRead() {
    const res = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data.notifications);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900">
            Notification History
          </h1>
          <p className="text-xs text-slate-600">
            Database-backed booking, payment, and itinerary event alerts.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllAsRead}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-brand-600 hover:bg-slate-50"
        >
          <CheckCheck className="h-4 w-4" />
          Mark All as Read
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="py-4 flex items-start justify-between gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-navy-900">{item.title}</span>
                {!item.isRead && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Unread
                  </span>
                )}
              </div>
              <p className="mt-1 text-slate-600">{item.message}</p>
            </div>
            {item.actionUrl && (
              <Link
                href={item.actionUrl}
                className="shrink-0 font-bold text-brand-600 hover:underline"
              >
                View →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
