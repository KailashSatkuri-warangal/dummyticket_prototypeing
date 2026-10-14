'use client';

import React, { useEffect, useState } from 'react';
import { listAuditLogs } from '@/lib/mock/store';
import type { AuditLogRecord } from '@/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listAuditLogs().then((rows) => {
        if (active) setLogs(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (logs === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Immutable Security & Operational Audit Logs
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Records administrator identity, action, affected resource, timestamp, correlation ID, and sanitized before/after metadata. Never logs passwords, secrets, or raw card numbers.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs">
          <p className="font-bold text-navy-900">No audit events recorded yet</p>
          <p className="mt-1 text-slate-500">
            Booking, payment, and administrative events are recorded here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2.5">Timestamp</th>
                <th className="px-3 py-2.5">Actor</th>
                <th className="px-3 py-2.5">Action</th>
                <th className="px-3 py-2.5">Resource</th>
                <th className="px-3 py-2.5">Correlation ID</th>
                <th className="px-3 py-2.5">After State Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-3 py-3 font-mono text-[11px] text-slate-500">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3 font-semibold text-navy-900">
                    {log.actorEmail}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-brand-700">
                    {log.action}
                  </td>
                  <td className="px-3 py-3 font-mono">
                    {log.resourceType}/{log.resourceId}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-500">
                    {log.correlationId}
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] text-slate-600">
                    {JSON.stringify(log.afterState ?? {})}
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
