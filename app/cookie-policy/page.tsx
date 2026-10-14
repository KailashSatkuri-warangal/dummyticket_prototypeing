import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie & Local Storage Policy',
  description:
    'Learn how we use essential session cookies and optional local storage for recent flight searches.',
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card space-y-4 text-xs text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-navy-900">Cookie Policy</h1>
        <p>
          We use strictly necessary HTTP cookies for Supabase authentication sessions and role verification, and local browser storage (`aerovista_recent_searches`) to let you resume recent route searches. You can clear stored searches at any time using the &ldquo;Clear history&rdquo; button on the homepage.
        </p>
      </div>
    </div>
  );
}
