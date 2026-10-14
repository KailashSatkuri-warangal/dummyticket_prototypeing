import React from 'react';
import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/config/brand';
import { ShieldCheck, Scale, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About the Platform — Transparent Flight Search & Confirmed Itineraries',
  description:
    'Learn how our flight comparison and booking platform enforces transparent pricing, server-verified payments, and honest document labeling.',
};

export default function AboutPage() {
  const brand = getBrandConfig();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card space-y-5">
        <span className="eyebrow">
          About {brand.name}
        </span>
        <h1 className="text-3xl font-extrabold text-navy-900">
          Built for Transparent Flight Comparison & Honest Travel Documentation
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {brand.name} ({brand.legalEntityName}) is a full-stack aviation search, booking management, and confirmed-itinerary delivery platform designed around strict pricing transparency and compliance.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4 text-xs">
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <Scale className="h-5 w-5 text-brand-600" />
            <h2 className="font-bold text-sm text-navy-900">
              Auditable Fare Snapshots
            </h2>
            <p className="text-slate-600">
              Every quote separates base fare, statutory airport taxes, and disclosed platform fees. Any fare change requires explicit customer confirmation.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <FileText className="h-5 w-5 text-brand-600" />
            <h2 className="font-bold text-sm text-navy-900">
              Confirmed Reservations
            </h2>
            <p className="text-slate-600">
              Every completed booking is issued with an airline confirmation (PNR), downloadable itinerary, and separate payment receipt.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            <h2 className="font-bold text-sm text-navy-900">
              Server-Verified Security
            </h2>
            <p className="text-slate-600">
              Powered by Supabase Row Level Security (RLS), HMAC-SHA256 Razorpay verification, and masked travel document storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
