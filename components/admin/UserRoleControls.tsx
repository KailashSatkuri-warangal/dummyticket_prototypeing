'use client';

import React, { useState } from 'react';
import { ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { assignRole, removeRole, setSuspended } from '@/lib/mock/store';
import type { AppRole } from '@/types';

const PROTOTYPE_REFRESH_EVENT = 'prototype:refresh';

/** Notifies every admin page loader to re-read the localStorage mock store. */
function emitPrototypeRefresh(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROTOTYPE_REFRESH_EVENT));
  }
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'support_agent', label: 'Support Agent' },
  { value: 'finance_manager', label: 'Finance Manager' },
  { value: 'content_editor', label: 'Content Editor' },
  { value: 'customer', label: 'Customer' },
];

export function UserRoleControls({
  userId,
  roles,
  isSuspended,
}: {
  userId: string;
  roles: string[];
  isSuspended: boolean;
}) {
  const [role, setRole] = useState<string>(
    roles.find((r) => r !== 'customer') ?? roles[0] ?? 'customer'
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function run(mutate: () => void) {
    setBusy(true);
    setError('');
    try {
      mutate();
      emitPrototypeRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusy(false);
    }
  }

  const assigned = roles.includes(role);
  // The customer role is the baseline and can never be stripped.
  const removable = assigned && role !== 'customer';

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-1.5">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={busy}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-navy-900"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={busy || (assigned && !removable)}
          onClick={() =>
            run(() =>
              removable
                ? removeRole(userId, role as AppRole)
                : assignRole(userId, role as AppRole)
            )
          }
          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold disabled:opacity-40 ${
            removable
              ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
              : 'bg-brand-600 text-white hover:bg-brand-700'
          }`}
        >
          <ShieldCheck className="h-3 w-3" />
          {removable ? 'Remove' : assigned ? 'Current' : 'Assign'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            run(() => setSuspended(userId, !isSuspended))
          }
          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
            isSuspended
              ? 'border-verified-200 bg-verified-50 text-verified-700 hover:bg-verified-100'
              : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          {isSuspended ? (
            <>
              <UserCheck className="h-3 w-3" /> Reactivate
            </>
          ) : (
            <>
              <UserX className="h-3 w-3" /> Suspend
            </>
          )}
        </button>
      </div>
      {error && <span className="text-[11px] font-semibold text-red-600">{error}</span>}
    </div>
  );
}
