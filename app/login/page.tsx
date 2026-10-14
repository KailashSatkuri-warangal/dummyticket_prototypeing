'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, MailCheck } from 'lucide-react';
import { useDemoSession } from '@/lib/mock/use-demo-session';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');
  const { signInAs } = useDemoSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setNeedsConfirmation(false);
    setLoading(true);

    // Prototype: any email/password is accepted — creates a local demo session.
    signInAs();

    if (nextPath && nextPath.startsWith('/')) {
      router.push(nextPath);
    } else {
      router.push('/account');
    }
  }

  return (
    <div className="card space-y-6 p-6 shadow-elevated sm:p-8">
      <div>
        <span className="eyebrow">Welcome Back</span>
        <h1 className="section-heading mt-1">Demo Sign In (Prototype)</h1>
        <p className="mt-1 text-xs text-slate-600">
          Manage bookings, download itineraries, and view demo notifications.
        </p>
      </div>

      {needsConfirmation && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          <p className="flex items-start gap-2 font-semibold">
            <MailCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Your email isn&apos;t confirmed yet.
          </p>
          <p className="mt-1">
            Open the confirmation link we emailed you, then sign in again.{' '}
            <Link href="/verify-email" className="font-bold underline">
              Resend confirmation
            </Link>
          </p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="form-label">Email Address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="any email works — prototype demo"
              className="input-field pl-9"
            />
          </div>
        </div>

        <div>
          <div className="form-label flex items-center justify-between">
            <span>Password</span>
            <Link href="/forgot-password" className="text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="any password works — prototype demo"
              className="input-field pl-9"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-4 space-y-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-700">
          Prototype demo shortcuts
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              signInAs('user-demo-1');
              router.push('/account');
            }}
            className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-bold text-white hover:bg-brand-700"
          >
            Continue as Demo Customer
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50"
          >
            Enter Admin Dashboard
          </Link>
        </div>
        <p className="text-[10px] text-slate-500">
          Prototype — no authentication. All data lives in your browser&apos;s local storage.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold text-brand-600 hover:underline">
          Create an Account
        </Link>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-verified-600" />
        Prototype — no authentication. Demo data lives only in your browser.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <React.Suspense fallback={<div className="skeleton h-96 w-full rounded-2xl" />}>
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
