'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, CheckCircle2 } from 'lucide-react';

export function CancelBookingButton({
  bookingReference,
  disabled,
}: {
  bookingReference: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  async function handleCancel() {
    setLoading(true);
    setResultMsg(null);
    try {
      const res = await fetch(`/api/bookings/${bookingReference}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reason || 'Customer requested online cancellation',
        }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        setResultMsg(data.message ?? 'Cancellation processed.');
        setOpen(false);
        router.refresh();
      } else {
        setResultMsg(data.error ?? 'Unable to cancel booking.');
      }
    } catch {
      setResultMsg('Network error while requesting cancellation.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {!open ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          Request Cancellation / Refund
        </button>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 space-y-3">
          <label className="block text-xs font-semibold text-red-900">
            Reason for Cancellation
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Change in travel dates"
            className="w-full rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs text-navy-900"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleCancel}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
            >
              {loading ? 'Submitting...' : 'Confirm Cancellation'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              Keep Booking
            </button>
          </div>
        </div>
      )}

      {resultMsg && (
        <p className="flex items-center gap-1 text-xs font-semibold text-verified-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {resultMsg}
        </p>
      )}
    </div>
  );
}
