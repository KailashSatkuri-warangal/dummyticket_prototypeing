'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled route error:', error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-50 text-coral-600">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-navy-900">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        An unexpected error interrupted this page. Your data is safe — retry the
        section or head back to the homepage.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-slate-400">
          Error reference: {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="btn btn-primary px-5 py-2.5"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <a href="/" className="btn btn-secondary px-5 py-2.5">
          Back to Home
        </a>
      </div>
    </div>
  );
}
