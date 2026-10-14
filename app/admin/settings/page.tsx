'use client';

import React, { useState } from 'react';
import { getBrandConfig } from '@/lib/config/brand';
import { logPublicEvent } from '@/lib/mock/store';

export default function AdminSettingsPage() {
  const brand = getBrandConfig();
  const [form, setForm] = useState({
    name: brand.name,
    supportEmail: brand.supportEmail,
    supportPhone: brand.supportPhone,
  });
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    logPublicEvent('UPDATE_SITE_SETTINGS', 'site_settings', { ...form });
    window.dispatchEvent(new CustomEvent('prototype:refresh'));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Site Branding & Integration Configuration
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Review active brand settings, inventory operating mode, and prototype
          integration status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
        <div className="rounded-xl border border-slate-200 p-4 space-y-1">
          <p className="text-slate-500">Configured Brand Name</p>
          <p className="text-sm font-bold text-navy-900">{brand.name}</p>
          <p className="text-slate-500">Support: {brand.supportEmail}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 space-y-1">
          <p className="text-slate-500">Inventory Operating Mode</p>
          <p className="text-sm font-bold uppercase text-verified-700">
            {brand.inventoryMode}
          </p>
          <p className="text-slate-500">
            Data Backend: Prototype local store (no server) · Payment Gateway:
            Prototype mock (no real charges)
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-xl border border-slate-200 p-4 space-y-3"
      >
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
          Editable Brand Settings
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="form-label" htmlFor="settings-brand-name">
              Brand Name
            </label>
            <input
              id="settings-brand-name"
              className="input-field w-full"
              value={form.name}
              onChange={(e) => {
                setSaved(false);
                setForm((f) => ({ ...f, name: e.target.value }));
              }}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="settings-support-email">
              Support Email
            </label>
            <input
              id="settings-support-email"
              className="input-field w-full"
              value={form.supportEmail}
              onChange={(e) => {
                setSaved(false);
                setForm((f) => ({ ...f, supportEmail: e.target.value }));
              }}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="settings-support-phone">
              Support Phone
            </label>
            <input
              id="settings-support-phone"
              className="input-field w-full"
              value={form.supportPhone}
              onChange={(e) => {
                setSaved(false);
                setForm((f) => ({ ...f, supportPhone: e.target.value }));
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
          >
            Save Settings
          </button>
          {saved && (
            <span
              role="status"
              className="rounded-lg bg-verified-50 px-3 py-1.5 text-[11px] font-bold text-verified-700"
            >
              Settings saved in the prototype store.
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500">
          Changes are recorded in the audit log and kept in this browser only —
          the prototype has no server.
        </p>
      </form>
    </div>
  );
}
