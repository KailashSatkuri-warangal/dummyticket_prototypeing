'use client';

import dynamic from 'next/dynamic';
import type { BookingRecord, PaymentReceipt, TicketDocument } from '@/types';

interface SignatureBoardingPassProps {
  booking: BookingRecord;
  ticket?: TicketDocument;
  receipt?: PaymentReceipt;
  showModeToggle?: boolean;
  showViewSwitcher?: boolean;
  defaultView?: 'mobile' | 'gate_stub' | 'horizontal' | 'pdf_preview';
  animateReveal?: boolean;
}

const SignatureBoardingPass = dynamic<SignatureBoardingPassProps>(
  () =>
    import('./SignatureBoardingPass').then((m) => m.SignatureBoardingPass),
  {
    ssr: false,
    loading: () => (
      <div
        className="card p-6"
        aria-busy="true"
        aria-label="Loading boarding pass"
      >
        <div className="flex items-center justify-between">
          <div className="skeleton h-10 w-36" />
          <div className="skeleton h-8 w-40 rounded-lg" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-3 sm:col-span-2">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-8 w-40" />
            <div className="skeleton h-2 w-full" />
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-8 w-36" />
          </div>
          <div className="flex items-center justify-center">
            <div className="skeleton h-36 w-36 rounded-xl" />
          </div>
        </div>
        <div className="skeleton mt-6 h-10 w-full rounded-xl" />
      </div>
    ),
  }
);

export { SignatureBoardingPass as LazySignatureBoardingPass };
export type { SignatureBoardingPassProps };
