'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, ExternalLink, X } from 'lucide-react';
import type { NotificationItem } from '@/types';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const applyResponse = useCallback(async (res: Response) => {
    if (res.ok) {
      const data = (await res.json()) as {
        notifications: NotificationItem[];
        unreadCount: number;
      };
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/notifications', { signal: controller.signal })
      .then((res) => applyResponse(res))
      .catch(() => {
        // Ignore transient network errors
      });
    return () => controller.abort();
  }, [applyResponse]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function handleMarkAllRead() {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      await applyResponse(res);
    } catch {
      // Ignore
    }
  }

  async function handleMarkOneRead(id: string) {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      await applyResponse(res);
    } catch {
      // Ignore
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Notifications (${unreadCount} unread)`}
        className="relative inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-600"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications panel"
          className="fixed inset-x-3 top-16 z-50 rounded-xl border border-slate-200 bg-white p-4 shadow-elevated motion-safe:animate-slide-down sm:absolute sm:inset-x-auto sm:right-0 sm:top-11 sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-navy-900">
                Real-Time Notifications
              </h3>
              <p className="text-xs text-slate-500">
                Booking, fare, and document updates
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications panel"
                className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 sm:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="scroll-slim mt-2 max-h-80 divide-y divide-slate-100 overflow-y-auto overscroll-contain">
            {items.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                No notifications yet.
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`py-3 transition-colors ${
                    item.isRead ? 'opacity-75' : 'bg-brand-50/40 px-2 rounded-lg'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-navy-900">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{item.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    {item.actionUrl ? (
                      <Link
                        href={item.actionUrl}
                        onClick={() => {
                          handleMarkOneRead(item.id);
                          setOpen(false);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                      >
                        View record <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span />
                    )}
                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkOneRead(item.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 border-t border-slate-100 pt-2 text-right">
            <Link
              href="/account/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View full notification history →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
