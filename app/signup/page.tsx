'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, AlertCircle, MailCheck } from 'lucide-react';
import { useDemoSession } from '@/lib/mock/use-demo-session';

export default function SignupPage() {
  const router = useRouter();
  const { signInAs } = useDemoSession();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prototype: any name/email/password creates a local demo session instantly.
    signInAs();
    router.push('/account');
  }

  if (confirmationSent) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <div className="card space-y-4 p-6 text-center shadow-elevated sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-verified-50 text-verified-600">
            <MailCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-extrabold text-navy-900">
            Confirm your email address
          </h1>
          <p className="text-sm text-slate-600">
            (Demo) We would have sent a confirmation link to{' '}
            <strong>{email}</strong>. In this prototype no email is dispatched —
            your demo session is already active.
          </p>
          <Link href="/account" className="btn btn-primary w-full py-3">
            Continue to Demo Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="card space-y-5 p-6 shadow-elevated sm:p-8">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Create Your Travel Account
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Access booking history, downloadable itineraries, and fare alerts.
            Prototype demo — any details work, no account is really created.
          </p>
        </div>

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Arjun Reddy"
              className="input-field"
            />
          </div>
          <div>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="any email works — prototype demo"
              className="input-field"
            />
          </div>
          <div>
            <label className="form-label">Password (minimum 8 characters) *</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-brand-600"
            />
            <span>
              Optional: Send me seasonal route guides and promotional coupon codes.
            </span>
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
            <UserPlus className="h-4 w-4" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </p>

        <p className="text-center text-[11px] text-slate-400">
          Prototype — no authentication. Demo data lives only in your browser.
        </p>
      </div>
    </div>
  );
}
