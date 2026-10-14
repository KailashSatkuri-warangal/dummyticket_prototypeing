'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, ArrowRight, Trash2 } from 'lucide-react';

interface RecentSearchItem {
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  depart: string;
  cabin: string;
  adults: number;
}

export function RecentSearchesStrip() {
  const [recent, setRecent] = useState<RecentSearchItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('aerovista_recent_searches');
      if (raw) {
        setRecent(JSON.parse(raw));
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  function clearHistory() {
    try {
      localStorage.removeItem('aerovista_recent_searches');
      setRecent([]);
    } catch {
      // Ignore
    }
  }

  if (recent.length === 0) return null;

  return (
    <section
      aria-label="Recently Searched Routes"
      className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <History className="h-4 w-4 text-brand-600" />
          <span>Recently Searched Routes (Stored Locally on Your Device)</span>
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear history
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {recent.map((item, idx) => (
          <Link
            key={`${item.from}-${item.to}-${idx}`}
            href={`/flights?from=${item.from}&to=${item.to}&depart=${item.depart}&adults=${item.adults}&cabin=${item.cabin}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-brand-500 hover:shadow-card"
          >
            <div>
              <p className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                <span>{item.from}</span>
                <ArrowRight className="h-3.5 w-3.5 text-brand-600" />
                <span>{item.to}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {item.fromCity} to {item.toCity} · {item.depart}
              </p>
            </div>
            <span className="rounded-md bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700">
              Resume
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
