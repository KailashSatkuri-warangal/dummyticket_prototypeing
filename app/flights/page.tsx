import React from 'react';
import type { Metadata } from 'next';
import {
  findAirportByIata,
  getDeterministicFlightOffers,
} from '@/lib/flights/dataset';
import type { CabinClass, TripType } from '@/types';
import { FlightSearchPanel } from '@/components/search/FlightSearchPanel';
import { FlightResultsClient } from '@/components/flights/FlightResultsClient';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { ShieldCheck, PlaneTakeoff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Flight Search Results — Compare Schedules & Transparent Fares',
  description:
    'Filter flights by price, airline, stops, departure window, baggage allowance, and refundability.',
};

export default async function FlightsSearchPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const from = (typeof sp.from === 'string' ? sp.from : 'HYD').toUpperCase();
  const to = (typeof sp.to === 'string' ? sp.to : 'MSY').toUpperCase();
  const depart =
    typeof sp.depart === 'string' && sp.depart ? sp.depart : '2026-12-15';
  const returnDate =
    typeof sp.returnDate === 'string' ? sp.returnDate : '';
  const adults = Math.max(1, Number(sp.adults ?? 1));
  const childrenCount = Math.max(0, Number(sp.children ?? 0));
  const infantsCount = Math.max(0, Number(sp.infants ?? 0));
  const cabin = (
    typeof sp.cabin === 'string' ? sp.cabin : 'economy'
  ) as CabinClass;
  const tripType = (
    typeof sp.tripType === 'string' ? sp.tripType : 'one_way'
  ) as TripType;

  const originAirport = findAirportByIata(from);
  const destinationAirport = findAirportByIata(to);

  const offers = getDeterministicFlightOffers({
    from,
    to,
    departDate: depart,
    cabin,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper currentStep="select" />

      {/* Top Summary Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 eyebrow">
              <PlaneTakeoff className="h-4 w-4" />
              <span>
                {originAirport?.city ?? from} ({from}) →{' '}
                {destinationAirport?.city ?? to} ({to})
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-navy-900">
              {offers.length} Flights Available for {depart}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {adults} Adult(s)
              {childrenCount > 0 ? `, ${childrenCount} Child(ren)` : ''}
              {infantsCount > 0 ? `, ${infantsCount} Infant(s)` : ''} · Cabin:{' '}
              <span className="font-semibold uppercase">
                {cabin.replace('_', ' ')}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-verified-200 bg-verified-50 px-3.5 py-2 text-xs text-verified-800">
            <ShieldCheck className="h-4 w-4 text-verified-700 shrink-0" />
            <span>
              <strong>Demo Inventory:</strong> Fares are generated from a deterministic prototype dataset and every itinerary is issued with a mock confirmation reference.
            </span>
          </div>
        </div>

        {/* Collapsible / Inline Edit Search */}
        <details className="mt-4 group">
          <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-200">
            <span>Modify Search Parameters</span>
          </summary>
          <div className="mt-4">
            <FlightSearchPanel
              initialFrom={from}
              initialTo={to}
              initialDepart={depart}
              initialReturn={returnDate}
              initialAdults={adults}
              initialChildren={childrenCount}
              initialInfants={infantsCount}
              initialCabin={cabin}
              initialTripType={tripType}
              compact
            />
          </div>
        </details>
      </div>

      {/* Filters & Results */}
      <FlightResultsClient
        initialOffers={offers}
        departDate={depart}
        adults={adults}
        childrenCount={childrenCount}
        infantsCount={infantsCount}
      />
    </div>
  );
}
