import React from 'react';

export function EmptyBookingsIllustration({
  className = '',
}: {
  className?: string;
} = {}) {
  return (
    <svg
      width="160"
      height="110"
      viewBox="0 0 160 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`mx-auto ${className}`}
    >
      <rect
        x="16"
        y="18"
        width="128"
        height="74"
        rx="12"
        fill="#FAF7F0"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      <rect x="16" y="18" width="128" height="18" rx="12" fill="#E11D48" />
      <line
        x1="108"
        y1="18"
        x2="108"
        y2="92"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <path
        d="M34 62C52 48 72 48 90 62"
        stroke="#0057FF"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
      <circle cx="34" cy="62" r="3.5" fill="#0B1120" />
      <circle cx="90" cy="62" r="3.5" fill="#E11D48" />
      <rect x="116" y="44" width="18" height="32" rx="3" fill="#E2E8F0" />
    </svg>
  );
}
