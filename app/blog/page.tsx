import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/flights/dataset';
import { BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aviation, Baggage & Flight Planning Guides — Editorial Blog',
  description:
    'Read verified travel guides on baggage allowances, flight refund policies, airport terminals, and confirmed itinerary documentation.',
};

export default function BlogListingPage() {
  const categories = [
    'All Guides',
    'Itinerary explanations',
    'Baggage rules',
    'Refund and cancellation guidance',
    'Airport guides',
    'International travel requirements',
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-3xl">
        <span className="eyebrow">
          Editorial Travel Knowledge Base
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-navy-900">
          Flight Booking, Baggage & Compliance Guides
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Fact-checked resources helping travelers understand fare rules, statutory tax refunds, airport transit procedures, and confirmed itinerary documentation.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat, idx) => (
          <span
            key={cat}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              idx === 0
                ? 'bg-brand-600 text-white'
                : 'border border-slate-200 bg-white text-slate-700'
            }`}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:border-brand-500 hover:shadow-elevated"
          >
            <div>
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                <BookOpen className="h-3 w-3" />
                {post.category}
              </span>
              <h2 className="mt-3 text-lg font-bold text-navy-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-brand-600">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                {post.authorName} · {post.readingTimeMinutes} min read
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 font-bold text-brand-600 hover:underline"
              >
                Read <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
