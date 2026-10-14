import React from 'react';
import Link from 'next/link';
import { DummyTicketLogo } from '@/components/brand/DummyTicketLogo';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-6">
      {/* Custom Branded 404 Radar & Flight Path Illustration */}
      <div className="mx-auto flex justify-center">
        <svg
          width="220"
          height="140"
          viewBox="0 0 220 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="404 Off-Radar Flight Illustration"
        >
          <rect
            x="10"
            y="10"
            width="200"
            height="120"
            rx="24"
            fill="#0B1120"
          />
          <circle
            cx="110"
            cy="70"
            r="42"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle
            cx="110"
            cy="70"
            r="24"
            stroke="#0057FF"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <path
            d="M35 95C75 45 145 45 185 85"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
          <path
            d="M188 86L172 75L176 83L169 89L188 86Z"
            fill="#E11D48"
          />
          <text
            x="110"
            y="76"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="22"
            fontWeight="900"
            fontFamily="monospace"
          >
            404
          </text>
        </svg>
      </div>

      <div className="flex justify-center">
        <DummyTicketLogo variant="compact" />
      </div>

      <h1 className="text-3xl font-extrabold text-navy-900">
        Route Waypoint Not Found
      </h1>
      <p className="text-sm text-slate-600 max-w-md mx-auto">
        The flight corridor, ticket, or page you requested is outside our active navigation airspace.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to DummyTicket Home
        </Link>
        <Link
          href="/flights?from=HYD&to=MSY&depart=2026-12-15&adults=1&cabin=economy"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-navy-900 hover:bg-slate-50"
        >
          <Search className="h-4 w-4 text-brand-600" />
          Search Available Flights
        </Link>
      </div>
    </div>
  );
}
