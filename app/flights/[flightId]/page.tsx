'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Plane,
  ShieldCheck,
} from 'lucide-react';
import { getFlightOfferById } from '@/lib/flights/dataset';
import { calculateCompleteFare } from '@/lib/pricing/engine';
import { saveFareSnapshot } from '@/lib/mock/store';
import { formatDuration, formatInr } from '@/lib/config/brand';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { AirlineLogo } from '@/components/flights/AirlineLogo';
import type { CabinClass, FareSnapshot } from '@/types';

function FlightDetailsContent() {
  const params = useParams<{ flightId: string }>();
  const searchParams = useSearchParams();
  const flightId = params.flightId ?? '';
  const depart = searchParams.get('depart') || '2026-12-15';
  const adults = Math.max(1, Number(searchParams.get('adults') ?? 1));
  const children = Math.max(0, Number(searchParams.get('children') ?? 0));
  const infants = Math.max(0, Number(searchParams.get('infants') ?? 0));
  const cabin = (searchParams.get('cabin') || 'economy') as CabinClass;

  const offer = useMemo(
    () => getFlightOfferById(flightId, depart, cabin),
    [flightId, depart, cabin]
  );

  const snapshot: FareSnapshot | null = useMemo(
    () =>
      offer
        ? calculateCompleteFare({
            offer,
            adults,
            children,
            infants,
            cabin,
          })
        : null,
    [offer, adults, children, infants, cabin]
  );

  // Persist the locked fare snapshot into the prototype localStorage store.
  useEffect(() => {
    if (snapshot) saveFareSnapshot(snapshot);
  }, [snapshot]);

  if (!offer || !snapshot) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="section-heading">
          Flight Offer Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The requested flight offer could not be located. Please run a new search.
        </p>
        <Link
          href="/flights"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white"
        >
          Back to Flight Search
        </Link>
      </div>
    );
  }

  const checkoutQuery = new URLSearchParams({
    depart,
    adults: String(adults),
    children: String(children),
    infants: String(infants),
    cabin,
    snapshotId: snapshot.id,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper currentStep="select" />

      <div className="flex items-center justify-between">
        <Link
          href={`/flights?from=${offer.origin.iataCode}&to=${offer.destination.iataCode}&depart=${depart}&adults=${adults}&cabin=${cabin}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {offer.origin.iataCode} → {offer.destination.iataCode} results
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-verified-50 border border-verified-200 px-3 py-1 text-xs font-bold text-verified-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Prototype Fare Snapshot
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 8 Columns: Segments, Baggage & Fare Conditions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="eyebrow">
                  Selected Flight Itinerary
                </span>
                <h1 className="mt-1 text-2xl font-extrabold text-navy-900">
                  {offer.origin.city} ({offer.origin.iataCode}) →{' '}
                  {offer.destination.city} ({offer.destination.iataCode})
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Departure Date: {depart} · Total Duration:{' '}
                  {formatDuration(offer.durationMinutes)} ·{' '}
                  {offer.stopsCount === 0
                    ? 'Direct Flight'
                    : `${offer.stopsCount} Connecting Stop`}
                </p>
              </div>
              <AirlineLogo airline={offer.airline} size="md" />
            </div>

            {/* Flight Segments List */}
            <div className="mt-5 space-y-4">
              {offer.segments.map((seg) => (
                <div
                  key={seg.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  {seg.layoverMinutesBefore > 0 && (
                    <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900">
                      Transit Layover at {seg.originCity} ({seg.originIata}):{' '}
                      {formatDuration(seg.layoverMinutesBefore)}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600 mb-2">
                    <span className="flex items-center gap-1.5 text-navy-900">
                      <Plane className="h-3.5 w-3.5 text-brand-600" />
                      {seg.airlineName} · {seg.flightNumber} ({seg.aircraftType})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Segment Duration: {formatDuration(seg.durationMinutes)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/70">
                    <div>
                      <p className="text-[11px] uppercase text-slate-400 font-semibold">
                        Departure
                      </p>
                      <p className="text-sm font-bold text-navy-900">
                        {seg.originCity} ({seg.originIata})
                      </p>
                      <p className="text-xs text-slate-600">
                        {new Date(seg.departureTime).toUTCString()}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[11px] uppercase text-slate-400 font-semibold">
                        Arrival
                      </p>
                      <p className="text-sm font-bold text-navy-900">
                        {seg.destinationCity} ({seg.destinationIata})
                      </p>
                      <p className="text-xs text-slate-600">
                        {new Date(seg.arrivalTime).toUTCString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Baggage & Fare Rules Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-brand-600" />
              Baggage Allowance & Fare Rules ({offer.fareRule.name})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 p-3.5">
                <p className="text-slate-500">Cabin Baggage</p>
                <p className="mt-1 text-base font-bold text-navy-900">
                  {offer.fareRule.cabinBaggageKg} kg / passenger
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3.5">
                <p className="text-slate-500">Checked Baggage</p>
                <p className="mt-1 text-base font-bold text-navy-900">
                  {offer.fareRule.checkedBaggageKg} kg / passenger
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3.5">
                <p className="text-slate-500">Cancellation Penalty</p>
                <p className="mt-1 text-base font-bold text-navy-900">
                  {formatInr(offer.fareRule.cancellationFeeInr)}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-navy-900 mb-1">
                Fare Condition Summary:
              </p>
              <p>{offer.fareRule.termsSummary}</p>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Fare Snapshot & Continue to Checkout */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-elevated sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-navy-900">
                Prototype Fare Breakdown
              </h2>
              <span className="font-mono text-[11px] text-slate-500">
                {snapshot.id.slice(0, 14)}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              {snapshot.pricingRulesApplied.map((rule) => (
                <div
                  key={rule.ruleCode}
                  className="flex items-center justify-between text-slate-700"
                >
                  <span>{rule.description}</span>
                  <span className="font-semibold text-navy-900">
                    {formatInr(rule.amountInr)}
                  </span>
                </div>
              ))}

              <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-navy-900">
                  Total Payable
                </span>
                <span className="text-2xl font-extrabold text-brand-700">
                  {formatInr(snapshot.grandTotal)}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-verified-50 border border-verified-200 p-3 text-[11px] text-verified-800 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-verified-700 shrink-0 mt-0.5" />
              <span>
                <strong>Fare Hold:</strong> This fare snapshot is locked in your
                browser for this prototype session. Complete checkout to receive a
                demo itinerary with a mock airline PNR.
              </span>
            </div>

            <Link
              href={`/checkout/${offer.id}?${checkoutQuery.toString()}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700"
            >
              <span>Continue to Passenger Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-verified-600" />
              Fare snapshot locked until{' '}
              {new Date(snapshot.expiresAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlightDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-slate-500">
          Loading demo data…
        </div>
      }
    >
      <FlightDetailsContent />
    </Suspense>
  );
}
