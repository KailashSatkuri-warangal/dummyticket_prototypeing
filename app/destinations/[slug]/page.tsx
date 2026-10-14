import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  DESTINATIONS,
  getDeterministicFlightOffers,
} from '@/lib/flights/dataset';
import { formatInr } from '@/lib/config/brand';
import { FlightCard } from '@/components/flights/FlightCard';
import { CheckCircle2, Calendar, ShieldCheck } from 'lucide-react';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const dest =
    DESTINATIONS.find((d) => d.slug === slug) ?? DESTINATIONS[0];
  return {
    title: dest.metaTitle,
    description: dest.metaDescription,
    alternates: {
      canonical: `/destinations/${dest.slug}`,
    },
  };
}

export default async function DestinationGuidePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const dest =
    DESTINATIONS.find((d) => d.slug === slug) ?? DESTINATIONS[0];

  const featuredFlights = getDeterministicFlightOffers({
    from: 'HYD',
    to: dest.airportIata,
    departDate: '2026-12-15',
    cabin: 'economy',
  }).slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-lg bg-brand-50 px-3 py-1 font-mono text-xs font-bold text-brand-700">
            Airport Code: {dest.airportIata} · {dest.country}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Fares starting from {formatInr(dest.startingFareInr)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-900">
          {dest.city}: {dest.headline}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {dest.overview}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-3">
          <div className="rounded-xl bg-slate-50 p-4 text-xs space-y-1">
            <p className="font-bold text-navy-900 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-600" />
              Best Time to Fly
            </p>
            <p className="text-slate-600">{dest.bestTimeToVisit}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-xs space-y-1">
            <p className="font-bold text-navy-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              Entry & Visa Documentation Rules
            </p>
            <p className="text-slate-600">{dest.visaRequirementsSummary}</p>
          </div>
        </div>

        <div className="pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Key Airport & Route Highlights
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {dest.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-verified-600 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-900">
            Flight Schedules to {dest.city} ({dest.airportIata})
          </h2>
          <Link
            href={`/flights?from=HYD&to=${dest.airportIata}&depart=2026-12-15&adults=1&cabin=economy`}
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            View all flights to {dest.airportIata} →
          </Link>
        </div>

        <div className="space-y-4">
          {featuredFlights.map((offer) => (
            <FlightCard
              key={offer.id}
              offer={offer}
              departDate="2026-12-15"
              adults={1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
