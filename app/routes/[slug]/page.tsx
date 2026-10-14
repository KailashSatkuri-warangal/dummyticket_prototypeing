import React from 'react';
import type { Metadata } from 'next';
import {
  ROUTE_PAGES,
  findAirportByIata,
  getDeterministicFlightOffers,
} from '@/lib/flights/dataset';
import { formatDuration, formatInr } from '@/lib/config/brand';
import { FlightSearchPanel } from '@/components/search/FlightSearchPanel';
import { FlightCard } from '@/components/flights/FlightCard';

function resolveRouteSlug(slug: string) {
  const existing = ROUTE_PAGES.find(
    (r) => r.slug.toLowerCase() === slug.toLowerCase()
  );
  if (existing) return existing;

  const parts = slug.toLowerCase().split('-to-');
  const fromCode = (parts[0] || 'hyd').toUpperCase().slice(0, 3);
  const toCode = (parts[1] || 'del').toUpperCase().slice(0, 3);
  const orig = findAirportByIata(fromCode);
  const dest = findAirportByIata(toCode);

  return {
    id: `route-${fromCode}-${toCode}`,
    slug,
    originIata: orig?.iataCode ?? 'HYD',
    destinationIata: dest?.iataCode ?? 'DEL',
    originCity: orig?.city ?? 'Hyderabad',
    destinationCity: dest?.city ?? 'New Delhi',
    averageDurationMinutes: 135,
    airlinesOperating: ['IndiGo', 'Air India', 'Vistara'],
    startingFareInr: 4499,
    dailyFlightsCount: 16,
    routeGuideMarkdown: `Compare flight schedules, baggage rules, and transparent fares between ${
      orig?.city ?? fromCode
    } (${fromCode}) and ${dest?.city ?? toCode} (${toCode}).`,
    metaTitle: `${orig?.city ?? fromCode} to ${
      dest?.city ?? toCode
    } Flights (${fromCode} to ${toCode}) — Timings & Fares`,
    metaDescription: `Search and compare ${fromCode} to ${toCode} flight schedules, nonstop duration, and fare rules.`,
  };
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const route = resolveRouteSlug(slug);
  return {
    title: route.metaTitle,
    description: route.metaDescription,
    alternates: {
      canonical: `/routes/${route.slug}`,
    },
  };
}

export default async function RouteLandingPageView(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const route = resolveRouteSlug(slug);
  const offers = getDeterministicFlightOffers({
    from: route.originIata,
    to: route.destinationIata,
    departDate: '2026-12-15',
    cabin: 'economy',
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-4">
        <span className="eyebrow">
          Verified Route Guide · {route.originIata} → {route.destinationIata}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-900">
          {route.originCity} ({route.originIata}) to {route.destinationCity} (
          {route.destinationIata}) Flights
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {route.routeGuideMarkdown}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="rounded-xl bg-slate-50 p-3.5">
            <span className="text-slate-500">Average Non-stop Duration</span>
            <p className="mt-1 text-base font-bold text-navy-900">
              {formatDuration(route.averageDurationMinutes)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5">
            <span className="text-slate-500">Operating Airlines</span>
            <p className="mt-1 text-base font-bold text-navy-900">
              {route.airlinesOperating.join(', ')}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5">
            <span className="text-slate-500">Starting Fare</span>
            <p className="mt-1 text-base font-bold text-brand-700">
              {formatInr(route.startingFareInr)}
            </p>
          </div>
        </div>
      </div>

      <FlightSearchPanel
        initialFrom={route.originIata}
        initialTo={route.destinationIata}
        initialDepart="2026-12-15"
        initialAdults={1}
        initialCabin="economy"
        compact
      />

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-navy-900">
          Available Flights: {route.originIata} → {route.destinationIata}
        </h2>
        {offers.map((offer) => (
          <FlightCard
            key={offer.id}
            offer={offer}
            departDate="2026-12-15"
            adults={1}
          />
        ))}
      </div>
    </div>
  );
}
