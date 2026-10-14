import React from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14 text-center">
      <div className="card space-y-4 p-8 shadow-elevated">
        <MailCheck className="mx-auto h-10 w-10 text-brand-600" />
        <h1 className="text-2xl font-extrabold text-navy-900">
          Email Verification Demo
        </h1>
        <p className="text-xs leading-relaxed text-slate-600">
          Email verification is simulated in this prototype. No email is sent,
          and your demo session can be used immediately.
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <Link href="/account" className="btn btn-primary w-full py-3">
            Continue to Dashboard
          </Link>
          <Link href="/flights" className="btn btn-secondary w-full py-3">
            Search Flights
          </Link>
        </div>
      </div>
    </div>
  );
}
