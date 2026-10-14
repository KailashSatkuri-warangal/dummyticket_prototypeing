import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/flights/dataset';
import { getBrandConfig } from '@/lib/config/brand';
import { ArrowLeft, Calendar, User, Plane } from 'lucide-react';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? BLOG_POSTS[0];
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogArticlePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const brand = getBrandConfig();
  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? BLOG_POSTS[0];
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: brand.name,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-brand-600">
          Blog
        </Link>
        <span>/</span>
        <span className="text-navy-900 font-semibold truncate">{post.title}</span>
      </nav>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-card space-y-6">
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-brand-600" />
              {post.authorName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-brand-600" />
              Updated {post.updatedAt.slice(0, 10)}
            </span>
            <span>{post.readingTimeMinutes} min read</span>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {post.contentMarkdown}
        </div>

        {/* Article FAQs */}
        {post.faqs.length > 0 && (
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h2 className="text-lg font-bold text-navy-900">
              Frequently Asked Questions
            </h2>
            {post.faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="text-sm font-bold text-navy-900">
                  {f.question}
                </h3>
                <p className="mt-1 text-xs text-slate-600">{f.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="rounded-2xl bg-navy-900 p-6 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold">
              Ready to Compare Transparent Flight Fares?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Search routes or receive a confirmed itinerary in seconds.
            </p>
          </div>
          <Link
            href="/flights?from=HYD&to=DEL&depart=2026-12-15&adults=1&cabin=economy"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-500"
          >
            <Plane className="h-4 w-4" />
            Search Flights Now
          </Link>
        </div>
      </article>

      {/* Related Articles */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-navy-900">Related Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((r) => (
            <Link
              key={r.id}
              href={`/blog/${r.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-500"
            >
              <p className="text-xs font-bold text-brand-600">{r.category}</p>
              <p className="mt-1 text-sm font-bold text-navy-900">{r.title}</p>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to All Guides
      </Link>
    </div>
  );
}
