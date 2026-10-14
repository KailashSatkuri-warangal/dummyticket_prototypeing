'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { logPublicEvent } from '@/lib/mock/store';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      logPublicEvent('NEWSLETTER_SIGNUP', 'public_form', {
        type: 'newsletter',
        email,
        consent,
      });
      setStatus('success');
      setMessage('Subscribed in the prototype — signup recorded in the local audit log.');
      setEmail('');
      setConsent(false);
    } catch {
      setStatus('error');
      setMessage('Could not record the signup in local demo storage.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            aria-label="Email address for route alerts"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-navy-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>

      <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
        />
        <span>
          I explicitly consent to receive route guides and fare rule updates from AeroVista Travel. You can unsubscribe at any time.
        </span>
      </label>

      {status === 'success' && (
        <p role="status" className="flex items-center gap-1.5 text-xs font-medium text-verified-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-4 w-4" />
          {message}
        </p>
      )}
    </form>
  );
}
