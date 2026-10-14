'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Trash2, CheckCircle2 } from 'lucide-react';

export default function AccountSecurityPage() {
  const router = useRouter();
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function requestDeletion() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletionRequested: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Unable to submit deletion request.');
        return;
      }
      setDeletionRequested(true);
      router.refresh();
    } catch {
      setError('Network error while submitting deletion request.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-600" />
          <h1 className="text-xl font-extrabold text-navy-900">
            Account Security & Data Retention
          </h1>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your account is protected by Supabase Row Level Security (RLS), HTTP security headers, and masked travel document storage.
        </p>

        <div className="border-t border-slate-100 pt-4">
          <h2 className="text-sm font-bold text-red-700">
            GDPR / DPDP Account Deletion Request
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            You can request permanent anonymization and deletion of your profile and saved traveler records. Statutory tax invoice records are retained only as required by law.
          </p>

          {deletionRequested ? (
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-verified-700">
              <CheckCircle2 className="h-4 w-4" />
              Account deletion request recorded and forwarded to the Data Protection Officer.
            </p>
          ) : (
            <button
              type="button"
              onClick={requestDeletion}
              disabled={submitting}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {submitting ? 'Submitting…' : 'Request Account Deletion'}
            </button>
          )}
          {error && (
            <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
