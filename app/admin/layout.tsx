'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Plane,
  Building2,
  Ticket,
  Users,
  CreditCard,
  RotateCcw,
  Sliders,
  Bell,
  Mail,
  MessageSquare,
  BookOpen,
  Globe,
  Tag,
  BarChart3,
  Settings,
  FileSpreadsheet,
} from 'lucide-react';
import { useDemoSession } from '@/lib/mock/use-demo-session';

const NAV_LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/flights', label: 'Flights Inventory', icon: Plane },
  { href: '/admin/airports', label: 'Airports', icon: Building2 },
  { href: '/admin/airlines', label: 'Airlines', icon: Plane },
  { href: '/admin/bookings', label: 'Bookings', icon: Ticket },
  { href: '/admin/users', label: 'Users & Roles', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/refunds', label: 'Refunds', icon: RotateCcw },
  { href: '/admin/pricing', label: 'Pricing Engine', icon: Sliders },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/email-templates', label: 'Email & Logs', icon: Mail },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/blog', label: 'Blog CMS', icon: BookOpen },
  { href: '/admin/seo', label: 'SEO & Routes', icon: Globe },
  { href: '/admin/reports', label: 'Revenue Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileSpreadsheet },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready, signInAs } = useDemoSession();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sticky top-24">
            <div className="border-b border-slate-100 pb-3 mb-3 px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                Admin Console (Prototype)
              </span>
              {ready && user ? (
                <>
                  <h2 className="text-sm font-extrabold text-navy-900">
                    {user.fullName}
                  </h2>
                  <p className="text-[11px] text-slate-500">Role: {user.role}</p>
                </>
              ) : (
                <>
                  <h2 className="text-sm font-extrabold text-navy-900">
                    Demo Administrator
                  </h2>
                  <button
                    type="button"
                    onClick={() => signInAs()}
                    className="mt-2 w-full rounded-lg bg-brand-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-brand-700"
                  >
                    Enter as Demo Admin
                  </button>
                </>
              )}
            </div>
            <nav
              aria-label="Admin Console Navigation"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1"
            >
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Icon className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <span className="truncate">{item.label}</span>
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
