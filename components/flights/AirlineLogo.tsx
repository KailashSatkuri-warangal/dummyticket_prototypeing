'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import type { Airline } from '@/types';

interface AirlineLogoProps {
  airline: Airline;
  size?: 'sm' | 'md' | 'lg';
  showVerifiedBadge?: boolean;
}

const SIZE_PX = { sm: 36, md: 48, lg: 56 } as const;
const SIZE_CLASS = { sm: 'h-9 w-9 rounded-lg', md: 'h-12 w-12 rounded-xl', lg: 'h-14 w-14 rounded-2xl' } as const;

function FallbackBadge({ airline, size }: { airline: Airline; size: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      style={{
        backgroundColor: airline.brandColor,
        borderColor: airline.accentColor ?? 'rgba(255,255,255,0.2)',
      }}
      className={`relative flex ${SIZE_CLASS[size]} shrink-0 items-center justify-center border font-black tracking-tight text-white shadow-sm overflow-hidden`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
      >
        <path d="M28 0L40 0L40 40L12 40L28 0Z" fill={airline.accentColor ?? '#FFFFFF'} />
      </svg>
      <span className="relative z-10 font-mono">{airline.logoText}</span>
    </div>
  );
}

export function AirlineLogo({
  airline,
  size = 'md',
  showVerifiedBadge = false,
}: AirlineLogoProps) {
  const [failed, setFailed] = useState(false);
  const px = SIZE_PX[size];
  const logoUrl = `https://www.gstatic.com/flights/airline_logos/70px/${airline.iataCode}.png`;

  return (
    <div className="inline-flex items-center gap-2.5">
      {failed ? (
        <FallbackBadge airline={airline} size={size} />
      ) : (
        <div
          title={`${airline.name} (IATA: ${airline.iataCode} / ICAO: ${airline.icaoCode})`}
          className={`relative flex ${SIZE_CLASS[size]} shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white p-1 shadow-sm`}
        >
          <Image
            src={logoUrl}
            alt={`${airline.name} logo`}
            width={px}
            height={px}
            onError={() => setFailed(true)}
            className="h-full w-full object-contain"
          />
        </div>
      )}
      {showVerifiedBadge && airline.isVerified && (
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
          {airline.iataCode}/{airline.icaoCode}
        </span>
      )}
    </div>
  );
}
