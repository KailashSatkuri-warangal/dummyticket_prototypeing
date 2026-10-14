'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Printer,
  QrCode,
  ShieldAlert,
  Smartphone,
  Ticket,
  CheckCircle2,
  Plane,
  ScanLine,
} from 'lucide-react';
import type { BookingRecord, PaymentReceipt, TicketDocument } from '@/types';
import { DummyTicketLogo } from '@/components/brand/DummyTicketLogo';
import { AirlineLogo } from '@/components/flights/AirlineLogo';
import { PrototypePdfButton } from '@/components/tickets/PrototypePdfButton';
import { formatDuration, formatInr } from '@/lib/config/brand';

interface SignatureBoardingPassProps {
  booking: BookingRecord;
  ticket?: TicketDocument;
  receipt?: PaymentReceipt;
  showModeToggle?: boolean;
  showViewSwitcher?: boolean;
  defaultView?: 'mobile' | 'gate_stub' | 'horizontal' | 'pdf_preview';
  animateReveal?: boolean;
}

export function SignatureBoardingPass({
  booking,
  receipt,
  showModeToggle = true,
  showViewSwitcher,
  defaultView = 'mobile',
  animateReveal = true,
}: SignatureBoardingPassProps) {
  const displayToggle = showViewSwitcher ?? showModeToggle;
  const [viewMode, setViewMode] = useState<
    'mobile' | 'gate_stub' | 'horizontal' | 'pdf_preview'
  >(defaultView);

  const primaryPassenger = booking.passengers[0] ?? {
    firstName: 'Traveler',
    lastName: 'Primary',
    passengerType: 'adult',
  };

  const depTime = new Date(
    booking.flightOffer.departureTime
  ).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });

  const arrTime = new Date(booking.flightOffer.arrivalTime).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }
  );

  const displayRef = booking.bookingReference.startsWith('DT-')
    ? booking.bookingReference
    : `DT-${booking.bookingReference.replace(/^AV-/, '')}`;

  return (
    <div className="space-y-6">
      {/* Interactive View Switcher & Action Controls */}
      {displayToggle && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white p-3.5 shadow-sm">
          <div
            role="tablist"
            aria-label="Boarding Pass Display Format"
            className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'mobile'}
              onClick={() => setViewMode('mobile')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'mobile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile Pass (Front)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'gate_stub'}
              onClick={() => setViewMode('gate_stub')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'gate_stub'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <ScanLine className="h-3.5 w-3.5" />
              Gate Pass (QR Stub)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'horizontal'}
              onClick={() => setViewMode('horizontal')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'horizontal'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <Ticket className="h-3.5 w-3.5" />
              Desktop Airline Pass
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'pdf_preview'}
              onClick={() => setViewMode('pdf_preview')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'pdf_preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              PDF & Receipt
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PrototypePdfButton booking={booking} label="Ticket PDF" />
            <PrototypePdfButton booking={booking} label="Receipt PDF" receipt />
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
          </div>
        </div>
      )}

      {/* Animated 3D Reveal Container */}
      <motion.div
        initial={
          animateReveal
            ? { opacity: 0, rotateX: 8, y: 18, scale: 0.98 }
            : false
        }
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformPerspective: 1200 }}
      >
        {/* ========================================================================= */}
        {/* VIEW 1: MOBILE BOARDING PASS (Modeled on User Reference Image 1 - Card 1)  */}
        {/* ========================================================================= */}
        {viewMode === 'mobile' && (
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[32px] border border-blue-200/80 bg-white shadow-ticket transition-all">
            {/* VIVID ROYAL/ELECTRIC BLUE TOP HEADER */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#0062E0] via-[#0265E6] to-[#0D6EFD] px-6 pt-6 pb-8 text-white rounded-t-[32px]">
              {/* Centered White Pill Badge */}
              <div className="flex justify-center mb-6">
                <span className="rounded-full bg-white px-4 py-1 text-[11px] font-black uppercase tracking-widest text-[#0062E0] shadow-sm">
                  BOARDING PASS
                </span>
              </div>

              {/* Central Curved Flight Path Arc with Flying Airplane */}
              <div className="relative my-2">
                <svg
                  viewBox="0 0 260 70"
                  fill="none"
                  className="mx-auto w-full max-w-[240px]"
                  aria-hidden="true"
                >
                  {/* Dashed trajectory arc */}
                  <path
                    d="M 20 54 Q 130 6 240 54"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  {/* Origin & Destination Nodes */}
                  <circle cx="20" cy="54" r="4.5" fill="#FFFFFF" />
                  <circle cx="240" cy="54" r="4.5" fill="#FFFFFF" />
                  {/* Airplane Silhouette Flying Along Arc */}
                  <g transform="translate(122, 12) rotate(4)">
                    <path
                      d="M0 12 L22 3 L27 10 L22 12 L13 11 L8 19 L4 19 L7 11 L1 11 Z"
                      fill="#FFFFFF"
                    />
                  </g>
                </svg>

                {/* Airport Codes, Cities & Times */}
                <div className="flex items-start justify-between px-1 -mt-2">
                  <div>
                    <p className="font-mono text-3xl font-black tracking-tight text-white">
                      {booking.originIata}
                    </p>
                    <p className="text-xs font-bold text-blue-100 uppercase mt-0.5">
                      {booking.flightOffer.origin.city}
                    </p>
                    <p className="font-mono text-xs font-semibold text-blue-200 mt-0.5">
                      {depTime}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-3xl font-black tracking-tight text-white">
                      {booking.destinationIata}
                    </p>
                    <p className="text-xs font-bold text-blue-100 uppercase mt-0.5">
                      {booking.flightOffer.destination.city}
                    </p>
                    <p className="font-mono text-xs font-semibold text-blue-200 mt-0.5">
                      {arrTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CRISP WHITE BODY SECTION */}
            <div className="bg-white px-6 pt-5 pb-6">
              {/* 6-Grid Parameter Details */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    FLIGHT
                  </p>
                  <p className="font-mono text-sm font-extrabold text-[#0062E0]">
                    {booking.flightOffer.flightNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    DATE
                  </p>
                  <p className="font-mono text-sm font-extrabold text-navy-900">
                    {booking.departureDate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    GATE
                  </p>
                  <p className="font-mono text-sm font-extrabold text-navy-900">
                    C5
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    BOARDING
                  </p>
                  <p className="font-mono text-sm font-extrabold text-navy-900">
                    {depTime}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    CLASS
                  </p>
                  <p className="text-xs font-extrabold uppercase text-navy-900">
                    {booking.cabin.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    FLIGHT TIME
                  </p>
                  <p className="font-mono text-xs font-extrabold text-navy-900">
                    {formatDuration(booking.flightOffer.durationMinutes)}
                  </p>
                </div>
              </div>

              {/* Perforated Dashed Tear Line with Notch Cutouts on Left and Right */}
              <div className="relative -mx-6 my-2 border-b-2 border-dashed border-slate-200">
                <div
                  aria-hidden="true"
                  className="absolute -left-3.5 -top-3 h-6 w-6 rounded-full bg-slate-100 border border-slate-200"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-3.5 -top-3 h-6 w-6 rounded-full bg-slate-100 border border-slate-200"
                />
              </div>

              {/* Passenger & Scannable QR Bottom Section */}
              <div className="pt-5 flex items-center justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      PASSENGER
                    </p>
                    <p className="font-mono text-sm font-black uppercase text-navy-900">
                      {primaryPassenger.lastName}, {primaryPassenger.firstName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      SEAT
                    </p>
                    <p className="font-mono text-base font-black text-[#0062E0]">
                      ASSIGNED AT CHECK-IN
                    </p>
                  </div>
                </div>

                {/* Scannable High-Contrast QR Code */}
                <div className="rounded-2xl border-2 border-slate-100 bg-white p-2.5 shadow-sm shrink-0">
                  <QrCode className="h-16 w-16 text-navy-900" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: GATE PASS / DIGITAL STUB (Modeled on User Image 1 - Card 2)       */}
        {/* ========================================================================= */}
        {viewMode === 'gate_stub' && (
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[32px] border border-blue-200/80 bg-white shadow-ticket transition-all">
            {/* Top Crisp White Gate Schedule Zone */}
            <div className="p-6 pb-5 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    DEPARTURE
                  </p>
                  <p className="font-mono text-sm font-black text-navy-900">
                    {depTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    ARRIVAL
                  </p>
                  <p className="font-mono text-sm font-black text-navy-900">
                    {arrTime}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  YOUR PLANE
                </p>
                <p className="font-mono text-sm font-extrabold text-navy-900">
                  {booking.flightOffer.airline.name}
                </p>
              </div>
            </div>

            {/* Perforated Divider with Center Blue Airplane Circle & Edge Notches */}
            <div className="relative border-b-2 border-dashed border-slate-200 my-1">
              <div
                aria-hidden="true"
                className="absolute -left-3.5 -top-3 h-6 w-6 rounded-full bg-slate-100 border border-slate-200"
              />
              <div
                aria-hidden="true"
                className="absolute -right-3.5 -top-3 h-6 w-6 rounded-full bg-slate-100 border border-slate-200"
              />
              <div className="absolute left-1/2 -top-4 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0062E0] text-white shadow-sm ring-4 ring-white">
                <Plane className="h-4 w-4" />
              </div>
            </div>

            {/* Gate Scanning Zone with Giant Central QR Code */}
            <div className="px-6 pt-6 pb-6 bg-white text-center space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 max-w-[220px] mx-auto leading-tight">
                SHOW YOUR PASSPORT &amp; QR CODE AT THE BOARDING GATE
              </p>

              {/* Large Centered QR Code Card */}
              <div className="mx-auto inline-block rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm">
                <QrCode className="h-36 w-36 text-navy-900 mx-auto" />
              </div>

              <p className="font-mono text-[11px] font-bold text-slate-400">
                REF: {displayRef}
              </p>
            </div>

            {/* Bottom Electric Blue Band with Passenger and Seat */}
            <div className="bg-[#0062E0] px-6 py-4 text-white flex items-center justify-between rounded-b-[32px]">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200">
                  PASSENGER
                </p>
                <p className="font-mono text-xs font-black uppercase tracking-tight">
                  {primaryPassenger.lastName}, {primaryPassenger.firstName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200">
                  SEAT
                </p>
                <p className="font-mono text-sm font-black text-white">
                  AT CHECK-IN
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: DESKTOP AIRLINE TICKET (Modeled on Image 2 - Horizontal Layout)   */}
        {/* ========================================================================= */}
        {viewMode === 'horizontal' && (
          <div
            aria-label="Desktop DummyTicket Boarding Pass"
            className="relative overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-ticket"
          >
            {/* ROYAL BLUE TOP HEADER WITH AIRLINE TICKET MARK */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#004EC2] via-[#0062E0] to-[#0256D4] px-6 py-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white">
                  <Plane className="h-4 w-4" />
                </div>
                <span className="font-mono text-sm font-black uppercase tracking-widest text-white">
                  AIRLINE TICKET · {booking.flightOffer.airline.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-100">
                  {booking.cabin.toUpperCase()}
                </span>
                <span className="hidden sm:inline-block h-4 w-px bg-white/30" />
                <span className="hidden sm:inline-block rounded-full bg-white/20 px-3 py-0.5 font-mono text-[11px] font-bold">
                  BOARDING PASS
                </span>
              </div>
            </div>

            {/* HORIZONTAL BODY: MAIN PASS (LEFT) + DETACHABLE STUB (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 relative">
              {/* Subtle Globe & Supersonic Arc Watermark */}
              <svg
                aria-hidden="true"
                viewBox="0 0 800 280"
                fill="none"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
              >
                <circle cx="680" cy="140" r="110" stroke="#004EC2" strokeWidth="2.5" />
                <path d="M50 200 Q 380 40 750 160" stroke="#0062E0" strokeWidth="4" strokeDasharray="8 6" />
              </svg>

              {/* MAIN PASS SECTION (Left 8 Cols) */}
              <div className="p-6 sm:p-8 lg:col-span-8 flex flex-col justify-between space-y-6 relative z-10 border-b lg:border-b-0 lg:border-r-2 border-dashed border-slate-200">
                {/* Vertical Barcode + Passenger Header */}
                <div className="flex items-start gap-5">
                  {/* Left Aviation Barcode */}
                  <div className="hidden sm:flex flex-col items-center">
                    <svg viewBox="0 0 38 120" className="w-9 h-28" aria-label="Ticket Barcode">
                      {[3, 7, 12, 16, 20, 26, 30, 36, 42, 47, 52, 58, 63, 68, 74, 80, 85, 90, 96, 102, 108, 114].map(
                        (y, i) => (
                          <rect key={y} x="2" y={y} width="34" height={i % 3 === 0 ? '3' : '1.5'} fill="#0B1120" />
                        )
                      )}
                    </svg>
                    <span className="font-mono text-[9px] text-slate-400 rotate-90 mt-2">
                      0123456789
                    </span>
                  </div>

                  {/* Passenger & Ticket Heading */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        PASSENGER TICKET AND BAGGAGE CHECK
                      </p>
                      <p className="text-xs font-bold uppercase text-slate-500">
                        SURNAME / NAME
                      </p>
                      <p className="font-mono text-xl sm:text-2xl font-black uppercase tracking-tight text-navy-900">
                        {primaryPassenger.lastName} / {primaryPassenger.firstName}
                      </p>
                    </div>

                    {/* Flight, Date & Zone */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-xs">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">FLIGHT</p>
                        <p className="font-mono font-black text-blue-600">{booking.flightOffer.flightNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">DATE</p>
                        <p className="font-mono font-black text-navy-900">{booking.departureDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">ZONE</p>
                        <p className="font-mono font-black text-navy-900">1</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route: FROM -> TO */}
                <div className="grid grid-cols-3 items-center gap-4 rounded-2xl bg-blue-50/60 p-4 border border-blue-100">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500">FROM</p>
                    <p className="font-mono text-2xl sm:text-3xl font-black text-navy-900">{booking.originIata}</p>
                    <p className="text-xs font-semibold text-slate-600">{booking.flightOffer.origin.city}</p>
                    <p className="font-mono text-xs font-bold text-blue-600">{depTime}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Plane className="h-5 w-5 text-blue-600" />
                    <span className="font-mono text-[10px] font-bold text-slate-500 mt-1">
                      {formatDuration(booking.flightOffer.durationMinutes)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-500">TO</p>
                    <p className="font-mono text-2xl sm:text-3xl font-black text-navy-900">{booking.destinationIata}</p>
                    <p className="text-xs font-semibold text-slate-600">{booking.flightOffer.destination.city}</p>
                    <p className="font-mono text-xs font-bold text-blue-600">{arrTime}</p>
                  </div>
                </div>

                {/* Gate, Seat, Boarding Time */}
                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">GATE</p>
                    <p className="font-mono font-black text-navy-900 text-sm">C5</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">SEAT</p>
                    <p className="font-mono font-black text-blue-600 text-sm">AT CHECK-IN</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-400">BOARDING TIME</p>
                    <p className="font-mono font-black text-navy-900 text-sm">{depTime}</p>
                  </div>
                </div>
              </div>

              {/* DETACHABLE RIGHT STUB (Right 4 Cols) */}
              <div className="p-6 sm:p-8 lg:col-span-4 flex flex-col justify-between space-y-4 bg-slate-50/50 relative z-10">
                {/* Notch Cutouts for Horizontal View on Desktop */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute -left-3.5 -top-3.5 h-7 w-7 rounded-full bg-slate-100 border border-slate-200"
                />
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute -left-3.5 -bottom-3.5 h-7 w-7 rounded-full bg-slate-100 border border-slate-200"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">
                      BOARDING PASS
                    </span>
                    <span className="rounded bg-verified-50 px-2 py-0.5 text-[10px] font-bold text-verified-700">
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">NAME OF PASSENGER</p>
                    <p className="font-mono text-sm font-black uppercase text-navy-900">
                      {primaryPassenger.lastName} / {primaryPassenger.firstName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">FROM</p>
                      <p className="font-mono font-bold text-navy-900">{booking.originIata}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">TO</p>
                      <p className="font-mono font-bold text-navy-900">{booking.destinationIata}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">FLIGHT</p>
                      <p className="font-mono font-bold text-blue-600">{booking.flightOffer.flightNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">DATE</p>
                      <p className="font-mono font-bold text-navy-900">{booking.departureDate}</p>
                    </div>
                  </div>
                </div>

                {/* Stub Barcode + QR */}
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 overflow-hidden">
                      <svg viewBox="0 0 140 34" className="h-9 w-full" aria-label="Stub Barcode">
                        {[4, 8, 12, 18, 22, 28, 34, 40, 46, 52, 58, 64, 70, 78, 84, 90, 96, 102, 108, 114, 120, 126, 132].map(
                          (x, i) => (
                            <rect key={x} x={x} y="2" width={i % 2 === 0 ? '3' : '1.5'} height="30" fill="#0B1120" />
                          )
                        )}
                      </svg>
                      <p className="text-center font-mono text-[9px] text-slate-400">0123456789</p>
                    </div>
                    <div className="p-1 rounded-xl border border-slate-200 bg-white">
                      <QrCode className="h-10 w-10 text-navy-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: DUAL PDF & RECEIPT PREVIEW                                       */}
        {/* ========================================================================= */}
        {viewMode === 'pdf_preview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Document 1: Itinerary PDF Sheet */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Document 1 · Printable A4 Itinerary
                  </span>
                  <h3 className="text-base font-extrabold text-navy-900">
                    Boarding-Pass Itinerary ({displayRef})
                  </h3>
                </div>
                <PrototypePdfButton booking={booking} label="Download" />
              </div>

              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-center text-xs font-black text-emerald-800">
                {booking.airlinePnr
                  ? `CONFIRMED ITINERARY — PNR ${booking.airlinePnr}`
                  : 'CONFIRMED ITINERARY'}
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <p>
                  <strong>Route:</strong> {booking.originIata} (
                  {booking.flightOffer.origin.city}) → {booking.destinationIata}{' '}
                  ({booking.flightOffer.destination.city})
                </p>
                <p>
                  <strong>Carrier:</strong> {booking.flightOffer.airline.name} (
                  {booking.flightOffer.flightNumber})
                </p>
                <p>
                  <strong>Passenger(s):</strong>{' '}
                  {booking.passengers
                    .map((p) => `${p.firstName} ${p.lastName}`)
                    .join(', ')}
                </p>
                <p>
                  <strong>Theme:</strong> Blue and White Modern Travel Specification.
                </p>
              </div>
            </div>

            {/* Document 2: Separate Payment Receipt PDF Sheet */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Document 2 · Official Financial Receipt
                  </span>
                  <h3 className="text-base font-extrabold text-navy-900">
                    DummyTicket Payment Receipt (
                    {receipt?.receiptNumber ?? `DT-RCPT-${booking.bookingReference}`})
                  </h3>
                </div>
                <PrototypePdfButton booking={booking} label="Receipt PDF" receipt />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Fare Component</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {formatInr(booking.fareSnapshot.baseFareTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes &amp; Statutory Fees</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {formatInr(booking.fareSnapshot.taxesTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Disclosed Platform Service Fee</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {formatInr(booking.fareSnapshot.serviceFeeTotal)}
                  </span>
                </div>
                {booking.fareSnapshot.discountTotal > 0 && (
                  <div className="flex justify-between text-verified-700 font-semibold">
                    <span>Discount Applied</span>
                    <span className="font-mono tabular-nums">
                      -{formatInr(booking.fareSnapshot.discountTotal)}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-navy-900">
                  <span>Total Amount Verified</span>
                  <span className="font-mono tabular-nums">
                    {formatInr(booking.totalAmount)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Note: This payment receipt confirms Razorpay payment capture and is separate from an airline ticket.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
