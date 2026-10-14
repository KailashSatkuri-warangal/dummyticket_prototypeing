'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ProfileSettingsFormProps {
  email: string;
  initialFullName: string;
  initialPhone: string;
  initialCurrency: string;
  initialSaveTravelerConsent: boolean;
  initialMarketingConsent: boolean;
}

export function ProfileSettingsForm({
  email,
  initialFullName,
  initialPhone,
  initialCurrency,
  initialSaveTravelerConsent,
  initialMarketingConsent,
}: ProfileSettingsFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [currency, setCurrency] = useState(initialCurrency);
  const [saveTravelerConsent, setSaveTravelerConsent] = useState(
    initialSaveTravelerConsent
  );
  const [marketingConsent, setMarketingConsent] = useState(
    initialMarketingConsent
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          preferredCurrency: currency,
          saveTravelerConsent,
          marketingConsent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Unable to save profile settings.');
      } else {
        setSaved(true);
      }
    } catch {
      setError('Network error while saving profile settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-xl">
      <div>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          value={email}
          disabled
          className="input-field opacity-60 cursor-not-allowed"
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Email is managed through Supabase Auth and cannot be changed here.
        </p>
      </div>
      <div>
        <label className="form-label">Full Name</label>
        <input
          type="text"
          required
          minLength={2}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98XXXXXX21"
          className="input-field"
        />
      </div>
      <div>
        <label className="form-label">Preferred Display Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-field cursor-pointer"
        >
          <option value="INR">INR (₹ Indian Rupee)</option>
          <option value="USD">USD ($ US Dollar)</option>
        </select>
      </div>

      <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={saveTravelerConsent}
          onChange={(e) => setSaveTravelerConsent(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-brand-600"
        />
        <span>
          Explicit Consent: Save my primary traveler name and date of birth to speed up future bookings.
        </span>
      </label>

      <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-brand-600"
        />
        <span>
          Send me fare-drop alerts and route offers (optional marketing consent).
        </span>
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-60 inline-flex items-center gap-1.5"
      >
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save Profile Settings
      </button>

      {saved && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-verified-700">
          <CheckCircle2 className="h-4 w-4" />
          Profile preferences updated.
        </p>
      )}
      {error && (
        <p className="text-xs font-semibold text-red-600">{error}</p>
      )}
    </form>
  );
}
