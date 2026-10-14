'use client';

import React, { useEffect, useState } from 'react';
import { listCatalog } from '@/lib/mock/store';
import type { CatalogRow } from '@/lib/mock/types';
import { CrudColumn, CrudManager } from '@/components/admin/CrudManager';

const BLOG_COLUMNS: CrudColumn[] = [
  {
    key: 'slug',
    label: 'URL Slug',
    type: 'text',
    required: true,
    placeholder: 'e.g. domestic-flight-baggage-rules-india',
  },
  {
    key: 'title',
    label: 'Article Title',
    type: 'text',
    required: true,
    placeholder: 'e.g. Complete Guide to Domestic Flights in India',
  },
  {
    key: 'category',
    label: 'Category',
    type: 'text',
    required: true,
    placeholder: 'e.g. Baggage & Travel Rules',
  },
  {
    key: 'author',
    label: 'Author Name',
    type: 'text',
    placeholder: 'e.g. DummyTicket Aviation Desk',
  },
  {
    key: 'excerpt',
    label: 'Summary Excerpt',
    type: 'textarea',
    placeholder: 'Brief summary of the article for search results and cards.',
  },
  {
    key: 'is_published',
    label: 'Published',
    type: 'boolean',
    options: [
      { value: 'true', label: 'Published' },
      { value: 'false', label: 'Draft' },
    ],
  },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<CatalogRow[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listCatalog('blog_post').then((rows) => {
        if (active) setPosts(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (posts === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="space-y-6">
      <CrudManager
        entity="blog_post"
        title={`Editorial Blog CMS (${posts.length})`}
        description="Write, edit, and publish SEO travel guides, visa ticket requirements, and airport policies."
        columns={BLOG_COLUMNS}
        rows={posts}
        emptyHint="No blog posts found. Click 'Add New' to draft an article."
      />
    </div>
  );
}

