import React from 'react';

interface DummyTicketLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  theme?: 'light' | 'dark' | 'ticket';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

/**
 * Original SVG Logo for DummyTicket:
 * A geometric airplane & supersonic flight-path integrated directly with the letter "D",
 * paired with a futuristic geometric wordmark reading "DummyTicket".
 */
export function DummyTicketLogo({
  variant = 'full',
  theme = 'light',
  className = '',
}: DummyTicketLogoProps) {
  const wordmarkPrimary =
    theme === 'dark' || theme === 'ticket' ? '#FFFFFF' : '#0B1120';
  const wordmarkAccent =
    theme === 'ticket' ? '#FBBF24' : theme === 'dark' ? '#599EFF' : '#0057FF';
  const subtextColor =
    theme === 'dark' || theme === 'ticket'
      ? 'rgba(255,255,255,0.75)'
      : '#64748B';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric D + Flight-Path Airplane Mark */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="dtLogoGrad"
            x1="0"
            y1="0"
            x2="44"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor={theme === 'ticket' ? '#0062E0' : '#0057FF'}
            />
            <stop
              offset="100%"
              stopColor={theme === 'ticket' ? '#003E99' : '#060913'}
            />
          </linearGradient>
        </defs>
        {/* Rounded Futuristic Squircle Base */}
        <rect width="44" height="44" rx="12" fill="url(#dtLogoGrad)" />
        {/* Amber Accent Diagonal Ribbon Corner */}
        <path
          d="M30 0H38L44 6V14L30 0Z"
          fill="#FBBF24"
          fillOpacity="0.9"
        />
        {/* Outer Geometric Letter 'D' Arc */}
        <path
          d="M11 10H22C29.732 10 35 15.149 35 22C35 28.851 29.732 34 22 34H11V10Z"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Supersonic Airplane Integrated Across the 'D' Counter */}
        <path
          d="M9 25.5C15.5 24.5 21.5 21.5 28.5 16.5"
          stroke="#FBBF24"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="2 2.5"
        />
        <path
          d="M32.5 14L20.5 17.2L24.2 20.2L22.5 24.5L26.2 21.8L29.5 24.5L32.5 14Z"
          fill="#FBBF24"
        />
      </svg>

      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className="flex items-baseline tracking-tight leading-none">
            <span
              style={{ color: wordmarkPrimary }}
              className="text-lg font-black tracking-tight"
            >
              Dummy
            </span>
            <span
              style={{ color: wordmarkAccent }}
              className="text-lg font-extrabold tracking-tight"
            >
              Ticket
            </span>
          </div>
          {variant === 'full' && (
            <span
              style={{ color: subtextColor }}
              className="text-[10px] font-semibold uppercase tracking-widest mt-0.5"
            >
              Flight & Itinerary Studio
            </span>
          )}
        </div>
      )}
    </div>
  );
}
