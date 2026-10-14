'use client';

import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, RotateCcw, Plane } from 'lucide-react';
import type { FlightOffer } from '@/types';
import { FlightCard } from '@/components/flights/FlightCard';
import { formatInr } from '@/lib/config/brand';

interface FlightResultsClientProps {
  initialOffers: FlightOffer[];
  departDate: string;
  adults: number;
  childrenCount: number;
  infantsCount: number;
}

export function FlightResultsClient({
  initialOffers,
  departDate,
  adults,
  childrenCount,
  infantsCount,
}: FlightResultsClientProps) {
  const maxAvailablePrice = useMemo(
    () => Math.max(...initialOffers.map((o) => o.totalFareInr), 100000),
    [initialOffers]
  );

  const [maxPrice, setMaxPrice] = useState<number>(maxAvailablePrice);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [stopsFilter, setStopsFilter] = useState<'all' | '0' | '1'>('all');
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [minCheckedBaggage, setMinCheckedBaggage] = useState<number>(0);
  const [departureWindow, setDepartureWindow] = useState<
    'all' | 'morning' | 'afternoon' | 'evening'
  >('all');
  const [sortBy, setSortBy] = useState<
    'recommended' | 'price_asc' | 'departure_asc' | 'duration_asc' | 'arrival_asc'
  >('recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const uniqueAirlines = useMemo(() => {
    const map = new Map<string, string>();
    initialOffers.forEach((o) => map.set(o.airline.iataCode, o.airline.name));
    return Array.from(map.entries());
  }, [initialOffers]);

  function toggleAirline(code: string) {
    setSelectedAirlines((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  function resetAllFilters() {
    setMaxPrice(maxAvailablePrice);
    setSelectedAirlines([]);
    setStopsFilter('all');
    setRefundableOnly(false);
    setMinCheckedBaggage(0);
    setDepartureWindow('all');
    setSortBy('recommended');
  }

  const filteredAndSorted = useMemo(() => {
    const list = initialOffers.filter((offer) => {
      if (offer.totalFareInr > maxPrice) return false;
      if (
        selectedAirlines.length > 0 &&
        !selectedAirlines.includes(offer.airline.iataCode)
      ) {
        return false;
      }
      if (stopsFilter === '0' && offer.stopsCount !== 0) return false;
      if (stopsFilter === '1' && offer.stopsCount !== 1) return false;
      if (refundableOnly && !offer.fareRule.isRefundable) return false;
      if (offer.fareRule.checkedBaggageKg < minCheckedBaggage) return false;

      if (departureWindow !== 'all') {
        const hour = new Date(offer.departureTime).getUTCHours();
        if (departureWindow === 'morning' && (hour < 5 || hour >= 12))
          return false;
        if (departureWindow === 'afternoon' && (hour < 12 || hour >= 17))
          return false;
        if (departureWindow === 'evening' && hour < 17 && hour >= 5)
          return false;
      }

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.totalFareInr - b.totalFareInr;
      if (sortBy === 'duration_asc') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'departure_asc') {
        return (
          new Date(a.departureTime).getTime() -
          new Date(b.departureTime).getTime()
        );
      }
      if (sortBy === 'arrival_asc') {
        return (
          new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime()
        );
      }
      // Recommended combines direct preference + price
      return (
        a.stopsCount * 1500 +
        a.totalFareInr -
        (b.stopsCount * 1500 + b.totalFareInr)
      );
    });
  }, [
    initialOffers,
    maxPrice,
    selectedAirlines,
    stopsFilter,
    refundableOnly,
    minCheckedBaggage,
    departureWindow,
    sortBy,
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Mobile Filter & Sort Trigger */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-navy-900 shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          <span>{mobileFiltersOpen ? 'Hide Filters' : 'Filters'}</span>
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          aria-label="Sort flight results"
          className="select-field py-2.5"
        >
          <option value="recommended">Sort: Recommended</option>
          <option value="price_asc">Sort: Lowest Price</option>
          <option value="departure_asc">Sort: Earliest Departure</option>
          <option value="duration_asc">Sort: Shortest Duration</option>
          <option value="arrival_asc">Sort: Earliest Arrival</option>
        </select>
      </div>

      {/* Left Sidebar Filters */}
      <aside
        aria-label="Flight Filters"
        className={`self-start space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-3 lg:block ${
          mobileFiltersOpen
            ? 'block motion-safe:animate-slide-down'
            : 'hidden'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-600" />
            Filter Results
          </h2>
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Max Price (per adult)</span>
            <span className="text-brand-700">{formatInr(maxPrice)}</span>
          </div>
          <input
            type="range"
            min={2500}
            max={maxAvailablePrice}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            aria-label="Maximum price filter"
            className="w-full accent-brand-600"
          />
        </div>

        {/* Stops Filter */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-2">Stops</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { id: 'all', label: 'Any' },
                { id: '0', label: 'Non-stop' },
                { id: '1', label: '1 Stop' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStopsFilter(opt.id)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                  stopsFilter === opt.id
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Airlines */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-2">Airlines</h3>
          <div className="space-y-2">
            {uniqueAirlines.map(([code, name]) => (
              <label
                key={code}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAirlines.includes(code)}
                  onChange={() => toggleAirline(code)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                />
                <span>
                  {name} ({code})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Departure Time Window */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-2">
            Departure Time
          </h3>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {(
              [
                { id: 'all', label: 'Any Time' },
                { id: 'morning', label: 'Morning (05-12)' },
                { id: 'afternoon', label: 'Afternoon (12-17)' },
                { id: 'evening', label: 'Evening (17-05)' },
              ] as const
            ).map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setDepartureWindow(w.id)}
                className={`rounded-lg border px-2 py-1.5 font-medium ${
                  departureWindow === w.id
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Refundability & Baggage */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={refundableOnly}
              onChange={(e) => setRefundableOnly(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-600"
            />
            <span>Refundable fares only</span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Minimum Checked Baggage
            </label>
            <select
              value={minCheckedBaggage}
              onChange={(e) => setMinCheckedBaggage(Number(e.target.value))}
              className="select-field w-full"
            >
              <option value={0}>Any baggage allowance (15kg+)</option>
              <option value={25}>25 kg or more</option>
              <option value={30}>30 kg or more</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Results Column */}
      <div className="lg:col-span-9 space-y-4">
        {/* Desktop Sorting Bar */}
        <div className="hidden lg:flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <p className="text-xs font-semibold text-slate-600">
            Showing <strong className="text-navy-900">{filteredAndSorted.length}</strong>{' '}
            available flight options
          </p>
          <div className="flex items-center gap-2">
            {(
              [
                { id: 'recommended', label: 'Recommended' },
                { id: 'price_asc', label: 'Lowest Price' },
                { id: 'departure_asc', label: 'Earliest Departure' },
                { id: 'duration_asc', label: 'Shortest Duration' },
                { id: 'arrival_asc', label: 'Earliest Arrival' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSortBy(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  sortBy === tab.id
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Flight Cards or Empty State */}
        {filteredAndSorted.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-card">
            <Plane className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-base font-bold text-navy-900">
              No flights match your active filters
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
              Try relaxing your maximum price, stop count, or departure time window to view all available flights on this route.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSorted.map((offer) => (
              <FlightCard
                key={offer.id}
                offer={offer}
                departDate={departDate}
                adults={adults}
                childrenCount={childrenCount}
                infantsCount={infantsCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
