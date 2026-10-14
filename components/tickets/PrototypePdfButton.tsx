'use client';

import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import {
  generateItineraryPdfBytes,
  generatePaymentReceiptPdfBytes,
} from '@/lib/pdf/generator';
import type { BookingRecord } from '@/types';

interface PrototypePdfButtonProps {
  booking: BookingRecord;
  label?: string;
  receipt?: boolean;
}

/**
 * Prototype replacement for the deleted /api/tickets/[reference]/pdf route:
 * generates the PDF client-side (jsPDF) and triggers a browser download.
 */
export function PrototypePdfButton({
  booking,
  label,
  receipt = false,
}: PrototypePdfButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const text = label ?? (receipt ? 'Receipt PDF' : 'Download Itinerary PDF');

  async function handleDownload() {
    setBusy(true);
    setError(false);
    try {
      const bytes = receipt
        ? await generatePaymentReceiptPdfBytes(booking)
        : await generateItineraryPdfBytes(booking);
      const buffer = new Uint8Array(bytes);
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${receipt ? 'receipt' : 'itinerary'}-${booking.bookingReference}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm disabled:opacity-60 ${
        receipt
          ? 'bg-brand-600 text-white hover:bg-brand-700'
          : 'bg-coral-600 text-white hover:bg-coral-700'
      }`}
      title="Prototype: generated in your browser, no server involved"
    >
      {receipt ? (
        <FileText className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span>{error ? 'Download failed — retry' : busy ? 'Generating…' : text}</span>
    </button>
  );
}

export default PrototypePdfButton;
