'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft,
  Calendar,
  MapPin,
  Search,
  Users,
  AlertCircle,
  Plane,
} from 'lucide-react';
import { AIRPORTS } from '@/lib/flights/dataset';
import type { Airport, CabinClass, TripType } from '@/types';
import { flightSearchSchema } from '@/lib/validation/schemas';
import { FlightGlobeAnimation } from '@/components/ui/FlightGlobeAnimation';

interface FlightSearchPanelProps {
  initialFrom?: string;
  initialTo?: string;
  initialDepart?: string;
  initialReturn?: string;
  initialAdults?: number;
  initialChildren?: number;
  initialInfants?: number;
  initialCabin?: CabinClass;
  initialTripType?: TripType;
  compact?: boolean;
}

export function FlightSearchPanel({
  initialFrom = 'HYD',
  initialTo = 'MSY',
  initialDepart = '2026-12-15',
  initialReturn = '',
  initialAdults = 1,
  initialChildren = 0,
  initialInfants = 0,
  initialCabin = 'economy',
  initialTripType = 'one_way',
  compact = false,
}: FlightSearchPanelProps) {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>(initialTripType);
  const [fromCode, setFromCode] = useState(initialFrom.toUpperCase());
  const [toCode, setToCode] = useState(initialTo.toUpperCase());
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromHighlightIdx, setFromHighlightIdx] = useState(0);
  const [toHighlightIdx, setToHighlightIdx] = useState(0);
  const [swapRotation, setSwapRotation] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [departDate, setDepartDate] = useState(initialDepart);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [infants, setInfants] = useState(initialInfants);
  const [cabin, setCabin] = useState<CabinClass>(initialCabin);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const [todayIso, setTodayIso] = useState('');
  useEffect(() => {
    setTodayIso(new Date().toLocaleDateString('en-CA'));
  }, []);

  const selectedOrigin = AIRPORTS.find((a) => a.iataCode === fromCode);
  const selectedDestination = AIRPORTS.find((a) => a.iataCode === toCode);

  useEffect(() => {
    if (selectedOrigin) {
      setFromQuery(`${selectedOrigin.city} (${selectedOrigin.iataCode})`);
    }
  }, [selectedOrigin]);

  useEffect(() => {
    if (selectedDestination) {
      setToQuery(`${selectedDestination.city} (${selectedDestination.iataCode})`);
    }
  }, [selectedDestination]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function filterAirportList(q: string): Airport[] {
    const clean = q.trim().toLowerCase();
    if (!clean || clean.includes('(')) return AIRPORTS;
    return AIRPORTS.filter(
      (a) =>
        a.iataCode.toLowerCase().includes(clean) ||
        a.city.toLowerCase().includes(clean) ||
        a.name.toLowerCase().includes(clean) ||
        a.country.toLowerCase().includes(clean)
    );
  }

  const fromSuggestions = filterAirportList(fromQuery);
  const toSuggestions = filterAirportList(toQuery);

  function handleSwapAirports() {
    const prevFrom = fromCode;
    setFromCode(toCode);
    setToCode(prevFrom);
    setSwapRotation((r) => r + 180);
    setFieldErrors({});
  }

  function handleSelectFrom(airport: Airport) {
    setFromCode(airport.iataCode);
    setFromQuery(`${airport.city} (${airport.iataCode})`);
    setShowFromSuggestions(false);
    setFieldErrors((prev) => ({ ...prev, from: '', to: '' }));
  }

  function handleSelectTo(airport: Airport) {
    setToCode(airport.iataCode);
    setToQuery(`${airport.city} (${airport.iataCode})`);
    setShowToSuggestions(false);
    setFieldErrors((prev) => ({ ...prev, from: '', to: '' }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const parsed = flightSearchSchema.safeParse({
      from: fromCode,
      to: toCode,
      depart: departDate,
      returnDate: tripType === 'round_trip' ? returnDate : '',
      adults,
      children,
      infants,
      cabin,
      tripType,
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const nextErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(flat)) {
        if (msgs && msgs.length > 0) {
          nextErrors[key] = msgs[0];
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    // Save to recent searches in localStorage
    try {
      const existingRaw = localStorage.getItem('aerovista_recent_searches');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const entry = {
        from: fromCode,
        to: toCode,
        fromCity: selectedOrigin?.city ?? fromCode,
        toCity: selectedDestination?.city ?? toCode,
        depart: departDate,
        cabin,
        adults,
      };
      const updated = [
        entry,
        ...existing.filter(
          (item: { from: string; to: string }) =>
            !(item.from === fromCode && item.to === toCode)
        ),
      ].slice(0, 4);
      localStorage.setItem('aerovista_recent_searches', JSON.stringify(updated));
    } catch {
      // Storage disabled or restricted
    }

    const params = new URLSearchParams({
      from: fromCode,
      to: toCode,
      depart: departDate,
      adults: String(adults),
      children: String(children),
      infants: String(infants),
      cabin,
      tripType,
    });
    if (tripType === 'round_trip' && returnDate) {
      params.set('returnDate', returnDate);
    }

    router.push(`/flights?${params.toString()}`);
  }

  return (
    <div className="relative">
      {/* Flight Moving Around Globe Overlay during Search */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all">
          <FlightGlobeAnimation
            title={`Finding Flights from ${fromCode} to ${toCode}...`}
            subtitle="Checking direct & connecting availability, airline schedules, and instant booking fares"
            origin={fromCode}
            destination={toCode}
            size="md"
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        aria-label="Flight Search Form"
        className={`rounded-2xl border border-slate-200 bg-white shadow-elevated ${
          compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
        }`}
      >
        {/* Top Row: Trip Type & Cabin Class */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div
          role="radiogroup"
          aria-label="Trip Type"
          className="inline-flex rounded-lg bg-slate-100 p-1"
        >
          {(
            [
              { id: 'one_way', label: 'One-Way' },
              { id: 'round_trip', label: 'Round-Trip' },
              { id: 'multi_city', label: 'Multi-City' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={tripType === item.id}
              onClick={() => setTripType(item.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                tripType === item.id
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span>Cabin Class:</span>
            <select
              value={cabin}
              onChange={(e) => setCabin(e.target.value as CabinClass)}
              aria-label="Cabin Class"
              className="select-field"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </label>
        </div>
      </div>

      {/* Main Search Grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12 items-start">
        {/* Origin Autocomplete */}
        <div ref={fromRef} className="relative md:col-span-3">
          <label htmlFor="origin-input" className="form-label">
            From Airport or City
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="origin-input"
              type="text"
              value={fromQuery}
              onFocus={() => {
                setShowFromSuggestions(true);
                setFromHighlightIdx(0);
              }}
              onChange={(e) => {
                setFromQuery(e.target.value);
                setShowFromSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (!showFromSuggestions) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setFromHighlightIdx((prev) =>
                    Math.min(fromSuggestions.length - 1, prev + 1)
                  );
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setFromHighlightIdx((prev) => Math.max(0, prev - 1));
                } else if (e.key === 'Enter' && fromSuggestions[fromHighlightIdx]) {
                  e.preventDefault();
                  handleSelectFrom(fromSuggestions[fromHighlightIdx]);
                } else if (e.key === 'Escape') {
                  setShowFromSuggestions(false);
                }
              }}
              placeholder="City or airport code (e.g., HYD)"
              aria-autocomplete="list"
              aria-expanded={showFromSuggestions}
              className="input-field pl-9 pr-3"
            />
          </div>
          <p className="mt-1 truncate text-[11px] text-slate-500">
            {selectedOrigin?.name ?? 'Select departure airport'}
          </p>
          {fieldErrors.from && (
            <p role="alert" className="form-error flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {fieldErrors.from}
            </p>
          )}

          {showFromSuggestions && fromSuggestions.length > 0 && (
            <ul
              role="listbox"
              aria-label="Origin airport suggestions"
              className="scroll-slim absolute left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white py-1 shadow-elevated"
            >
              {fromSuggestions.map((apt, idx) => (
                <li
                  key={apt.id}
                  role="option"
                  aria-selected={idx === fromHighlightIdx}
                  onClick={() => handleSelectFrom(apt)}
                  className={`cursor-pointer px-3 py-2 text-xs transition-colors ${
                    idx === fromHighlightIdx ? 'bg-brand-50 text-brand-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>
                      {apt.city}, {apt.country}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-brand-700">
                      {apt.iataCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{apt.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Swap Origin and Destination Button */}
        <div className="flex md:col-span-1 items-center justify-center md:pt-6">
          <button
            type="button"
            onClick={handleSwapAirports}
            aria-label="Swap origin and destination airports"
            className="inline-flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-brand-500 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600 transition-colors"
          >
            <motion.span
              animate={{ rotate: swapRotation }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="inline-flex items-center justify-center"
            >
              <ArrowRightLeft className="h-4 w-4 rotate-90 md:rotate-0" />
            </motion.span>
          </button>
        </div>

        {/* Destination Autocomplete */}
        <div ref={toRef} className="relative md:col-span-3">
          <label htmlFor="destination-input" className="form-label">
            To Airport or City
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-brand-600" />
            <input
              id="destination-input"
              type="text"
              value={toQuery}
              onFocus={() => {
                setShowToSuggestions(true);
                setToHighlightIdx(0);
              }}
              onChange={(e) => {
                setToQuery(e.target.value);
                setShowToSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (!showToSuggestions) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setToHighlightIdx((prev) =>
                    Math.min(toSuggestions.length - 1, prev + 1)
                  );
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setToHighlightIdx((prev) => Math.max(0, prev - 1));
                } else if (e.key === 'Enter' && toSuggestions[toHighlightIdx]) {
                  e.preventDefault();
                  handleSelectTo(toSuggestions[toHighlightIdx]);
                } else if (e.key === 'Escape') {
                  setShowToSuggestions(false);
                }
              }}
              placeholder="City or airport code (e.g., MSY)"
              aria-autocomplete="list"
              aria-expanded={showToSuggestions}
              className="input-field pl-9 pr-3"
            />
          </div>
          <p className="mt-1 truncate text-[11px] text-slate-500">
            {selectedDestination?.name ?? 'Select arrival airport'}
          </p>
          {fieldErrors.to && (
            <p role="alert" className="form-error flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {fieldErrors.to}
            </p>
          )}

          {showToSuggestions && toSuggestions.length > 0 && (
            <ul
              role="listbox"
              aria-label="Destination airport suggestions"
              className="scroll-slim absolute left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white py-1 shadow-elevated"
            >
              {toSuggestions.map((apt, idx) => (
                <li
                  key={apt.id}
                  role="option"
                  aria-selected={idx === toHighlightIdx}
                  onClick={() => handleSelectTo(apt)}
                  className={`cursor-pointer px-3 py-2 text-xs transition-colors ${
                    idx === toHighlightIdx ? 'bg-brand-50 text-brand-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>
                      {apt.city}, {apt.country}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-brand-700">
                      {apt.iataCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{apt.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Departure & Return Dates */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:col-span-3">
          <div>
            <label htmlFor="depart-date-input" className="form-label">
              Departure Date
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="depart-date-input"
                type="date"
                min={todayIso || undefined}
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="input-field pl-8 pr-2 text-xs font-semibold tabular-nums"
              />
            </div>
            {fieldErrors.depart && (
              <p role="alert" className="form-error">
                {fieldErrors.depart}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="return-date-input" className="form-label">
              Return Date {tripType !== 'round_trip' && '(Optional)'}
            </label>
            <input
              id="return-date-input"
              type="date"
              min={departDate || todayIso || undefined}
              value={returnDate}
              disabled={tripType === 'one_way'}
              onChange={(e) => {
                setReturnDate(e.target.value);
                if (e.target.value) setTripType('round_trip');
              }}
              className="input-field px-2.5 text-xs font-semibold tabular-nums"
            />
            {fieldErrors.returnDate && (
              <p role="alert" className="form-error">
                {fieldErrors.returnDate}
              </p>
            )}
          </div>
        </div>

        {/* Passengers Counter */}
        <div className="md:col-span-2">
          <span className="block text-xs font-semibold text-slate-700 mb-1">
            Passengers
          </span>
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50/60 p-1.5">
            <label className="flex flex-col items-center text-[10px] text-slate-600">
              <span>Adults</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={9}
                aria-label="Adults count"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="mt-0.5 w-full rounded border border-slate-200 bg-white py-0.5 text-center text-xs font-bold tabular-nums text-navy-900"
              />
            </label>
            <label className="flex flex-col items-center text-[10px] text-slate-600">
              <span>Children</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={8}
                aria-label="Children count"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="mt-0.5 w-full rounded border border-slate-200 bg-white py-0.5 text-center text-xs font-bold tabular-nums text-navy-900"
              />
            </label>
            <label className="flex flex-col items-center text-[10px] text-slate-600">
              <span>Infants</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={4}
                aria-label="Infants count"
                value={infants}
                onChange={(e) => setInfants(Number(e.target.value))}
                className="mt-0.5 w-full rounded border border-slate-200 bg-white py-0.5 text-center text-xs font-bold tabular-nums text-navy-900"
              />
            </label>
          </div>
          {(fieldErrors.adults || fieldErrors.infants) && (
            <p role="alert" className="form-error">
              {fieldErrors.adults || fieldErrors.infants}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Users className="h-4 w-4 text-brand-600" />
          <span className="tabular-nums">
            {adults + children + infants} Passenger(s) · {cabin.replace('_', ' ').toUpperCase()}
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="text-slate-500">
            Transparent server-calculated fares with zero hidden checkout fees
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary px-6 py-3 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
                className="inline-flex items-center"
              >
                <Plane className="h-4 w-4" />
              </motion.span>
              <span>Searching {fromCode} → {toCode}...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Search Flights</span>
            </>
          )}
        </button>
      </div>
    </form>
    </div>
  );
}
