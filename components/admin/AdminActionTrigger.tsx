'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import {
  catalogDelete,
  catalogUpsert,
  logPublicEvent,
  processRefund,
} from '@/lib/mock/store';
import type { CatalogRow } from '@/lib/mock/types';

const PROTOTYPE_REFRESH_EVENT = 'prototype:refresh';

/** Notifies every admin page loader to re-read the localStorage mock store. */
function emitPrototypeRefresh(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROTOTYPE_REFRESH_EVENT));
  }
}

function asString(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}

/**
 * Maps an admin action payload onto the localStorage mock store and returns the
 * message shown in the success banner. Replaces the removed admin actions route
 * — there are no network calls in the prototype.
 */
function runAction(payload: Record<string, unknown>): string {
  const action = asString(payload.action) || 'ADMIN_ACTION';
  const rest: Record<string, unknown> = { ...payload };
  delete rest.action;

  switch (action) {
    case 'PROCESS_REFUND': {
      const refundId = asString(payload.refundId);
      if (!refundId) throw new Error('Missing refund id.');
      processRefund(refundId);
      return 'Refund approved and marked as processed.';
    }
    case 'CATALOG_UPSERT': {
      catalogUpsert(
        asString(payload.entity),
        (payload.record ?? {}) as CatalogRow
      );
      return 'Record saved.';
    }
    case 'CATALOG_DELETE': {
      catalogDelete(asString(payload.entity), asString(payload.id));
      return 'Record deleted.';
    }
    case 'RESEND_BOOKING_EMAIL': {
      const bookingReference = asString(payload.bookingReference);
      logPublicEvent(action, 'booking', {
        ...rest,
        bookingReference,
        status: 'sent',
      });
      return `Confirmation email re-queued for ${bookingReference}.`;
    }
    case 'MARK_BOOKING_TICKETED': {
      const bookingReference = asString(payload.bookingReference);
      logPublicEvent(action, 'booking', {
        ...rest,
        bookingReference,
        status: 'ticketed',
      });
      return `Ticket issuance recorded for ${bookingReference}.`;
    }
    case 'SET_FARE_ADJUSTMENT': {
      logPublicEvent(action, 'flight_offer', {
        flightOfferId: asString(payload.flightOfferId),
        deltaInr: payload.deltaInr ?? 0,
      });
      return `Fare adjustment of ₹${asString(payload.deltaInr)} applied to the offer.`;
    }
    default:
      logPublicEvent(action, 'admin', rest);
      return 'Action completed and recorded in audit logs.';
  }
}

export function AdminActionTrigger({
  label,
  payload,
  variant = 'primary',
}: {
  label: string;
  payload: Record<string, unknown>;
  variant?: 'primary' | 'secondary' | 'warning';
}) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  function handleRun() {
    setLoading(true);
    setFeedback(null);
    try {
      const message = runAction(payload);
      emitPrototypeRefresh();
      setFeedback({ ok: true, text: message });
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Operation rejected by policy.',
      });
    } finally {
      setLoading(false);
    }
  }

  const btnStyle =
    variant === 'warning'
      ? 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
      : variant === 'secondary'
      ? 'border border-slate-200 bg-white text-navy-900 hover:bg-slate-50'
      : 'bg-brand-600 text-white hover:bg-brand-700';

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={handleRun}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${btnStyle}`}
      >
        {loading ? 'Processing...' : label}
      </button>
      {feedback && (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
            feedback.ok ? 'text-verified-700' : 'text-red-600'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="h-3 w-3 shrink-0" />
          ) : (
            <AlertCircle className="h-3 w-3 shrink-0" />
          )}
          {feedback.text}
        </span>
      )}
    </div>
  );
}
