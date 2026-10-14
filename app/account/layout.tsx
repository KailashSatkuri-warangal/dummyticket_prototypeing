'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Ticket,
  FileText,
  Bell,
  User,
  Shield,
} from 'lucide-react';
import { useDemoSession } from '@/lib/mock/use-demo-session';

const NAV_ITEMS = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/bookings', label: 'My Bookings', icon: Ticket },
  { href: '/account/tickets', label: 'Tickets & PDFs', icon: FileText },
  { href: '/account/notifications', label: 'Notifications', icon: Bell },
  { href: '/account/profile', label: 'Profile & Preferences', icon: User },
  { href: '/account/security', label: 'Security & Privacy', icon: Shield },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready, signInAs } = useDemoSession();
  const demoUser = user ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="eyebrow">
              Customer Portal (Prototype)
            </p>
            {ready && demoUser ? (
              <>
                <h2 className="mt-1 text-base font-extrabold text-navy-900">
                  {demoUser.fullName}
                </h2>
                <p className="text-xs text-slate-500 truncate">{demoUser.email}</p>
              </>
            ) : (
              <button
                type="button"
                onClick={() => signInAs()}
                className="mt-2 w-full rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
              >
                Enter as Demo Customer
              </button>
            )}

            <nav
              aria-label="Customer Account Navigation"
              className="mt-5 space-y-1"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-brand-600" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
