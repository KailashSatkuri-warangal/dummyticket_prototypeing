'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { logPublicEvent } from '@/lib/mock/store';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prototype: simulate sending the reset email locally.
    logPublicEvent('PASSWORD_RESET_REQUEST', 'account', { email: email.trim() });
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="card space-y-5 p-6 shadow-elevated sm:p-8">
        <h1 className="text-2xl font-extrabold text-navy-900">
          Reset Your Password
        </h1>
        <p className="text-xs text-slate-600">
          Prototype demo — enter any email address and the reset step is simulated
          locally. No email is actually sent.
        </p>

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        {sent ? (
          <div className="rounded-xl bg-verified-50 border border-verified-100 p-4 text-xs text-verified-700 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Email sent (demo) — reset link simulated for {email}
            </p>
            <p>
              In this prototype no email leaves the browser.{' '}
              <Link href="/reset-password" className="font-bold underline">
                Continue to the demo reset form →
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Sending...' : 'Send Reset Link (Demo)'}
            </button>
          </form>
        )}

        <div className="text-center text-xs">
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            ← Back to Sign In
          </Link>
        </div>

        <p className="text-center text-[11px] text-slate-400">
          Prototype — no authentication.
        </p>
      </div>
    </div>
  );
}
