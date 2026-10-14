'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Ticket, AlertTriangle } from 'lucide-react';
import { getBookingByIdOrReference } from '@/lib/mock/store';

export default function TrackBookingPage() {
  const router = useRouter();
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanRef = reference.trim().toUpperCase();
    if (!cleanRef) return;
    setSearching(true);
    setError(null);
    const booking = await getBookingByIdOrReference(cleanRef);
    if (!booking) {
      setError(
        `No demo booking record found for reference "${cleanRef}". Try one of the sample references below.`
      );
      setSearching(false);
      return;
    }
    router.push(`/booking/${booking.bookingReference}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-elevated">
        <div className="flex items-center gap-2 eyebrow">
          <Ticket className="h-4 w-4" />
          <span>Booking Reference Lookup</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-900">
          Track Your Demo Booking & Download Documents
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Enter your DummyTicket booking reference to view its prototype status and download the mock PDF documents.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Reference *
              </label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="DT-HYD842MSY"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono uppercase font-bold text-navy-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-navy-900"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={searching}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {searching ? 'Searching demo data…' : 'Find Booking Record'}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-dashed border-brand-200 bg-brand-50/60 p-4 text-xs text-slate-700">
          <p className="font-bold text-navy-900">Prototype sample references:</p>
          <ul className="mt-2 space-y-1 font-mono">
            <li>
              <button
                type="button"
                onClick={() => setReference('DT-HYD842MSY')}
                className="font-bold text-brand-700 underline hover:text-brand-800"
              >
                DT-HYD842MSY
              </button>{' '}
              — ticketed booking with mock PNR & receipt
            </li>
            <li>
              <button
                type="button"
                onClick={() => setReference('DT-HYD319DEL')}
                className="font-bold text-brand-700 underline hover:text-brand-800"
              >
                DT-HYD319DEL
              </button>{' '}
              — confirmed domestic booking
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
