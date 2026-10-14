import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Clock,
  ShieldCheck,
  Info,
  ArrowRight,
  PlaneTakeoff,
} from 'lucide-react';
import type { FlightOffer } from '@/types';
import { formatDuration, formatInr } from '@/lib/config/brand';
import { AirlineLogo } from '@/components/flights/AirlineLogo';

interface FlightCardProps {
  offer: FlightOffer;
  departDate: string;
  adults: number;
  childrenCount?: number;
  infantsCount?: number;
}

export function FlightCard({
  offer,
  departDate,
  adults,
  childrenCount = 0,
  infantsCount = 0,
}: FlightCardProps) {
  const depTimeFormatted = new Date(offer.departureTime).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }
  );

  const arrTimeFormatted = new Date(offer.arrivalTime).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }
  );

  const passengerMultiplier =
    adults + childrenCount * 0.75 + infantsCount * 0.15;
  const totalForParty = Math.round(offer.totalFareInr * passengerMultiplier);

  const queryParams = new URLSearchParams({
    depart: departDate,
    adults: String(adults),
    children: String(childrenCount),
    infants: String(infantsCount),
    cabin: offer.cabin,
  });

  return (
    <article
      aria-label={`${offer.airline.name} flight ${offer.flightNumber} from ${offer.origin.iataCode} to ${offer.destination.iataCode}`}
      className="card card-interactive group p-4 sm:p-5"
    >
      {/* Top Badges Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="badge badge-brand">
            Authorized Live Inventory
          </span>
          <span
            className={`badge ${
              offer.fareRule.isRefundable ? 'badge-green' : 'badge-slate'
            }`}
          >
            <ShieldCheck className="h-3 w-3" />
            {offer.fareRule.isRefundable
              ? 'Refundable Fare'
              : 'Non-Refundable (Taxes Refundable)'}
          </span>
        </div>

        <span className="text-xs font-medium text-slate-500">
          {offer.cabin.replace('_', ' ').toUpperCase()} · {offer.fareRule.name}
        </span>
      </div>

      {/* Main Flight Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
        {/* Airline Logo & Name */}
        <div className="flex items-center gap-3.5 lg:col-span-3">
          <AirlineLogo airline={offer.airline} size="md" />
          <div>
            <h3 className="text-base font-bold text-navy-900">
              {offer.airline.name}
            </h3>
            <p className="text-xs font-mono tabular-nums text-slate-500">
              {offer.flightNumber} · {offer.segments[0]?.aircraftType ?? 'Jet'}
            </p>
          </div>
        </div>

        {/* Schedule & Duration */}
        <div className="grid grid-cols-3 items-center gap-2 text-center lg:col-span-5">
          <div className="text-left">
            <p className="text-base font-extrabold tabular-nums text-navy-900 sm:text-lg">
              {depTimeFormatted}
            </p>
            <p className="text-xs font-bold font-mono text-brand-700">
              {offer.origin.iataCode}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {offer.origin.city}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-xs font-semibold tabular-nums text-slate-600 flex items-center gap-1">
              <Clock className="h-3 w-3 text-brand-600" />
              {formatDuration(offer.durationMinutes)}
            </span>
            <div className="my-1.5 flex w-full items-center">
              <div className="h-0.5 flex-1 bg-slate-300" />
              <PlaneTakeoff className="mx-1.5 h-3.5 w-3.5 text-brand-600 transition-transform group-hover:translate-x-1" />
              <div className="h-0.5 flex-1 bg-slate-300" />
            </div>
            <span
              className={`text-[11px] font-semibold ${
                offer.stopsCount === 0 ? 'text-verified-700' : 'text-amber-700'
              }`}
            >
              {offer.stopsCount === 0
                ? 'Direct · Non-stop'
                : `${offer.stopsCount} stop`}
            </span>
            {offer.layoverSummary && (
              <span className="mt-0.5 text-[10px] text-slate-500 line-clamp-1">
                {offer.layoverSummary}
              </span>
            )}
          </div>

          <div className="text-right">
            <p className="text-base font-extrabold tabular-nums text-navy-900 sm:text-lg">
              {arrTimeFormatted}
            </p>
            <p className="text-xs font-bold font-mono text-brand-700">
              {offer.destination.iataCode}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {offer.destination.city}
            </p>
          </div>
        </div>

        {/* Total Fare & Select Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 lg:col-span-4 gap-3">
          <div className="lg:text-right">
            <div className="flex items-baseline lg:justify-end gap-2">
              <span className="text-2xl font-extrabold tabular-nums text-navy-900">
                {formatInr(totalForParty)}
              </span>
              {offer.historicalAvgInr && (
                <span className="text-xs tabular-nums text-slate-400 line-through">
                  {formatInr(Math.round(offer.historicalAvgInr * passengerMultiplier))}
                </span>
              )}
            </div>
            <p className="text-[11px] tabular-nums text-slate-500">
              Includes {formatInr(offer.taxesInr)} taxes + {formatInr(offer.serviceFeeInr)} fee / adult
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/flights/${offer.id}?${queryParams.toString()}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Details
            </Link>
            <Link
              href={`/checkout/${offer.id}?${queryParams.toString()}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              <span>Select Flight</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Baggage & Fare Conditions Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-brand-600" />
            Cabin: {offer.fareRule.cabinBaggageKg} kg · Checked:{' '}
            {offer.fareRule.checkedBaggageKg} kg
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Info className="h-3.5 w-3.5 text-slate-400" />
            Cancellation fee: {formatInr(offer.fareRule.cancellationFeeInr)} · Date change:{' '}
            {formatInr(offer.fareRule.changeFeeInr)}
          </span>
        </div>
        <span className="text-[11px] font-medium tabular-nums text-slate-500">
          {offer.seatsAvailable} seats left at this fare
        </span>
      </div>
    </article>
  );
}
