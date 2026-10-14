'use client';

import React from 'react';
import { getDeterministicFlightOffers } from '@/lib/flights/dataset';
import { formatDuration, formatInr } from '@/lib/config/brand';
import { AdminActionTrigger } from '@/components/admin/AdminActionTrigger';

export default function AdminFlightsPage() {
  const inventoryOffers = [
    ...getDeterministicFlightOffers({
      from: 'HYD',
      to: 'MSY',
      departDate: '2026-12-15',
    }),
    ...getDeterministicFlightOffers({
      from: 'HYD',
      to: 'DEL',
      departDate: '2026-11-20',
    }).slice(0, 2),
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Flight Inventory & Fare Tier Management
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Manage the authorized provider inventory, baggage rules, and base fares.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2.5">Flight</th>
              <th className="px-3 py-2.5">Route</th>
              <th className="px-3 py-2.5">Duration</th>
              <th className="px-3 py-2.5">Baggage</th>
              <th className="px-3 py-2.5">Total Fare</th>
              <th className="px-3 py-2.5">Mode</th>
              <th className="px-3 py-2.5">Pricing Rule Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventoryOffers.map((offer) => (
              <tr key={offer.id}>
                <td className="px-3 py-3 font-bold text-navy-900">
                  {offer.airline.name} ({offer.flightNumber})
                </td>
                <td className="px-3 py-3 font-mono font-semibold">
                  {offer.origin.iataCode} → {offer.destination.iataCode}
                </td>
                <td className="px-3 py-3">
                  {formatDuration(offer.durationMinutes)} ({offer.stopsCount}{' '}
                  stop)
                </td>
                <td className="px-3 py-3">
                  {offer.fareRule.cabinBaggageKg}kg /{' '}
                  {offer.fareRule.checkedBaggageKg}kg
                </td>
                <td className="px-3 py-3 font-bold text-brand-700">
                  {formatInr(offer.totalFareInr)}
                </td>
                <td className="px-3 py-3 uppercase text-[10px] font-bold text-verified-700">
                  {offer.inventoryMode}
                </td>
                <td className="px-3 py-3">
                  <AdminActionTrigger
                    label="+₹800 Tier Adj"
                    variant="secondary"
                    payload={{
                      action: 'SET_FARE_ADJUSTMENT',
                      flightOfferId: offer.id,
                      deltaInr: 800,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
