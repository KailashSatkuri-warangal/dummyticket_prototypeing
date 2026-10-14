'use client';

import React from 'react';
import { Check } from 'lucide-react';

export type BookingStepId =
  | 'search'
  | 'select'
  | 'passengers'
  | 'payment'
  | 'confirmation';

const STEPS: Array<{ id: BookingStepId; label: string }> = [
  { id: 'search', label: 'Search' },
  { id: 'select', label: 'Select' },
  { id: 'passengers', label: 'Passenger details' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Confirmation' },
];

export function BookingStepper({
  activeStep,
  currentStep,
}: {
  activeStep?: BookingStepId;
  currentStep?: BookingStepId;
}) {
  const stepToUse = activeStep ?? currentStep ?? 'search';
  const activeIdx = STEPS.findIndex((s) => s.id === stepToUse);

  return (
    <nav
      aria-label="Booking Progress"
      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
    >
      <ol className="flex flex-wrap items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIdx;
          const isCurrent = index === activeIdx;

          return (
            <li
              key={step.id}
              className="flex flex-1 items-center gap-2 min-w-[110px]"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-all ${
                  isCompleted
                    ? 'bg-verified-600 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={`text-xs font-bold truncate ${
                  isCurrent
                    ? 'text-brand-700'
                    : isCompleted
                    ? 'text-navy-900'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block h-0.5 flex-1 rounded ${
                    isCompleted ? 'bg-verified-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
