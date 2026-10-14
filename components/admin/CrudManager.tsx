'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { catalogDelete, catalogUpsert, listCatalog } from '@/lib/mock/store';
import type { CatalogRow } from '@/lib/mock/types';

const PROTOTYPE_REFRESH_EVENT = 'prototype:refresh';

/** Notifies every admin page loader to re-read the localStorage mock store. */
function emitPrototypeRefresh(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROTOTYPE_REFRESH_EVENT));
  }
}

export interface CrudColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean' | 'textarea' | 'select' | 'csv';
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  placeholder?: string;
  /** Shown in the table but never editable (e.g. auto-computed fields). */
  readOnly?: boolean;
  hideInTable?: boolean;
}

export type CrudRow = { id: string } & Record<string, unknown>;

interface CrudManagerProps {
  entity: string;
  title: string;
  description?: string;
  columns: CrudColumn[];
  rows: CatalogRow[];
  emptyHint?: string;
}

function coerce(column: CrudColumn, raw: string): unknown {
  if (column.type === 'number') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  if (column.type === 'boolean') return raw === 'true';
  if (column.type === 'csv') {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return raw === '' ? null : raw;
}

function display(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function CrudManager({
  entity,
  title,
  description,
  columns,
  rows: initialRows,
  emptyHint,
}: CrudManagerProps) {
  const [rows, setRows] = useState<CatalogRow[]>(initialRows);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  // Keep in sync with the page loader (also re-run after a prototype refresh).
  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  useEffect(() => {
    let active = true;
    async function reload() {
      const fresh = await listCatalog(entity);
      if (active) setRows(fresh);
    }
    reload();
    return () => {
      active = false;
    };
  }, [entity]);

  const editableColumns = columns.filter((c) => !c.readOnly);
  const tableColumns = columns.filter((c) => !c.hideInTable);

  function openCreate() {
    setEditingId(null);
    setValues({});
    setFeedback(null);
    setFormOpen(true);
  }

  function openEdit(row: CatalogRow) {
    const next: Record<string, string> = {};
    for (const col of editableColumns) {
      const value = row[col.key];
      next[col.key] =
        value === null || value === undefined ? '' : String(value);
    }
    setEditingId(String(row.id ?? ''));
    setValues(next);
    setFeedback(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setValues({});
  }

  async function reloadRows() {
    const fresh = await listCatalog(entity);
    setRows(fresh);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      const record: CatalogRow = {};
      for (const col of editableColumns) {
        if (values[col.key] !== undefined) {
          record[col.key] = coerce(col, values[col.key] ?? '') as CatalogRow[string];
        }
      }
      if (editingId) record.id = editingId;

      catalogUpsert(entity, record);
      await reloadRows();
      emitPrototypeRefresh();
      setFeedback({
        ok: true,
        text: editingId ? 'Record updated.' : 'Record created.',
      });
      closeForm();
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Save failed.',
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(row: CatalogRow) {
    if (!window.confirm(`Delete this ${title.toLowerCase()} record?`)) return;
    setBusy(true);
    setFeedback(null);
    try {
      catalogDelete(entity, String(row.id ?? ''));
      await reloadRows();
      emitPrototypeRefresh();
      setFeedback({ ok: true, text: 'Record deleted.' });
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Delete failed.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-navy-900">{title}</h2>
          {description && <p className="mt-1 text-xs text-slate-600">{description}</p>}
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          <Plus className="h-3.5 w-3.5" /> Add New
        </button>
      </div>

      {feedback && (
        <p
          role="status"
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
            feedback.ok
              ? 'border-verified-200 bg-verified-50 text-verified-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          )}
          {feedback.text}
        </p>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-brand-200 bg-brand-50/40 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
              {editingId ? 'Edit Record' : 'New Record'}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {editableColumns.map((col) => (
              <div key={col.key} className={col.type === 'textarea' ? 'sm:col-span-2 lg:col-span-3' : ''}>
                <label className="form-label">{col.label}</label>
                {col.type === 'textarea' ? (
                  <textarea
                    required={col.required}
                    value={values[col.key] ?? ''}
                    placeholder={col.placeholder}
                    rows={3}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [col.key]: e.target.value }))
                    }
                    className="input-field w-full"
                  />
                ) : col.type === 'select' ? (
                  <select
                    required={col.required}
                    value={values[col.key] ?? ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [col.key]: e.target.value }))
                    }
                    className="input-field w-full"
                  >
                    <option value="">Select…</option>
                    {(col.options ?? []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={col.type === 'number' ? 'number' : 'text'}
                    required={col.required}
                    value={values[col.key] ?? ''}
                    placeholder={col.placeholder}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [col.key]: e.target.value }))
                    }
                    className="input-field w-full"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No records yet</p>
          <p className="mt-1 text-slate-500">
            {emptyHint ?? 'Use "Add New" to create the first record.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                {tableColumns.map((col) => (
                  <th key={col.key} className="px-4 py-2.5">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={String(row.id ?? '')}>
                  {tableColumns.map((col) => (
                    <td key={col.key} className="max-w-[260px] truncate px-4 py-3">
                      {display(row[col.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        disabled={busy}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-navy-900 hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        disabled={busy}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
