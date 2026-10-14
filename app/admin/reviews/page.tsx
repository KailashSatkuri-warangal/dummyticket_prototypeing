'use client';

import React from 'react';
import { formatInr } from '@/lib/config/brand';

interface DemoReview {
  id: string;
  bookingReference: string;
  authorName: string;
  route: string;
  rating: number;
  title: string;
  body: string;
  paidAmountInr: number;
  submittedAt: string;
  status: 'published' | 'pending_moderation';
}

const DEMO_REVIEWS: DemoReview[] = [
  {
    id: 'rev-demo-1',
    bookingReference: 'DT-HYD842MSY',
    authorName: 'Arjun Reddy',
    route: 'HYD → MSY',
    rating: 5,
    title: 'E-ticket arrived instantly after payment',
    body: 'Checkout was transparent about taxes and the service fee, and the itinerary PDF downloaded right after the payment confirmation.',
    paidAmountInr: 52840,
    submittedAt: '2026-09-18',
    status: 'published',
  },
  {
    id: 'rev-demo-2',
    bookingReference: 'DT-HYD319DEL',
    authorName: 'Sneha Reddy',
    route: 'HYD → DEL',
    rating: 4,
    title: 'Fair baggage rules, easy fare comparison',
    body: 'I compared three fare tiers side by side. Cabin baggage limits were clearly labelled, no surprises at the gate.',
    paidAmountInr: 11480,
    submittedAt: '2026-09-26',
    status: 'published',
  },
  {
    id: 'rev-demo-3',
    bookingReference: 'DT-HYD505BOM',
    authorName: 'Priya Sharma',
    route: 'HYD → BOM',
    rating: 3,
    title: 'Refund took a few days to credit',
    body: 'Cancellation was straightforward and the refund was processed at the quoted fee, but the bank credit took longer than expected.',
    paidAmountInr: 9260,
    submittedAt: '2026-10-04',
    status: 'pending_moderation',
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="font-mono text-[11px] font-bold text-amber-500" aria-label={`${rating} out of 5`}>
      {'★'.repeat(rating)}
      <span className="text-slate-300">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

export default function AdminReviewsPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Verified Booking Reviews Moderation
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          Strict Policy: Only verified customers with a completed booking record may submit a review. We never fabricate customer testimonials or search engine review ratings.
        </p>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        {DEMO_REVIEWS.map((review) => (
          <div key={review.id} className="py-4 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-navy-900">{review.title}</p>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  review.status === 'published'
                    ? 'bg-verified-50 text-verified-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {review.status === 'published' ? 'Published' : 'Pending moderation'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <Stars rating={review.rating} />
              <span className="font-semibold text-navy-900">{review.authorName}</span>
              <span className="font-mono text-slate-400">{review.route}</span>
              <span className="font-mono font-bold text-brand-700">
                {review.bookingReference}
              </span>
              <span>{formatInr(review.paidAmountInr)} paid</span>
              <span className="text-slate-400">
                {new Date(review.submittedAt).toLocaleDateString('en-IN')}
              </span>
            </div>
            <p className="text-slate-600">{review.body}</p>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500">
        Prototype note: these demo reviews are bundled with the sample data — no
        review service or account login is required to view them.
      </p>
    </div>
  );
}
