'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listCatalog } from '@/lib/mock/store';
import type { CatalogRow } from '@/lib/mock/types';
import { CrudColumn, CrudManager } from '@/components/admin/CrudManager';

const ROUTE_COLUMNS: CrudColumn[] = [
  {
    key: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    placeholder: 'e.g. hyd-to-del, bom-to-dxb',
  },
  {
    key: 'origin_iata',
    label: 'Origin IATA',
    type: 'text',
    required: true,
    placeholder: 'e.g. HYD',
  },
  {
    key: 'destination_iata',
    label: 'Destination IATA',
    type: 'text',
    required: true,
    placeholder: 'e.g. DEL',
  },
  {
    key: 'origin_city',
    label: 'Origin City',
    type: 'text',
    placeholder: 'e.g. Hyderabad',
  },
  {
    key: 'destination_city',
    label: 'Destination City',
    type: 'text',
    placeholder: 'e.g. New Delhi',
  },
  {
    key: 'starting_fare_inr',
    label: 'Starting Fare (₹)',
    type: 'number',
    placeholder: 'e.g. 4299',
  },
  {
    key: 'daily_flights_count',
    label: 'Daily Flights',
    type: 'number',
    placeholder: 'e.g. 24',
  },
  {
    key: 'meta_title',
    label: 'SEO Meta Title',
    type: 'text',
    placeholder: 'Hyderabad to Delhi Flights — Timings & Fares',
  },
];

const DESTINATION_COLUMNS: CrudColumn[] = [
  {
    key: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    placeholder: 'e.g. dubai, goa, london',
  },
  {
    key: 'name',
    label: 'Destination Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. Dubai, United Arab Emirates',
  },
  {
    key: 'country',
    label: 'Country',
    type: 'text',
    required: true,
    placeholder: 'e.g. United Arab Emirates',
  },
  {
    key: 'hero_title',
    label: 'Hero Title',
    type: 'text',
    placeholder: 'e.g. Explore Futuristic Dubai',
  },
];

interface SeoData {
  routes: CatalogRow[];
  destinations: CatalogRow[];
}

export default function AdminSeoPage() {
  const [data, setData] = useState<SeoData | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      Promise.all([listCatalog('route_page'), listCatalog('destination')])
        .then(([routes, destinations]) => {
          if (active) setData({ routes, destinations });
        });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (data === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  const { routes, destinations } = data;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-2">
        <h1 className="text-xl font-extrabold text-navy-900">
          SEO Routes & Destination Guides Management
        </h1>
        <p className="text-xs text-slate-600">
          Manage landing pages indexed in Google and linked from the sitemap. XML sitemap updates automatically at{' '}
          <Link href="/sitemap.xml" className="text-brand-600 font-semibold underline">
            /sitemap.xml
          </Link>
          .
        </p>
      </div>

      <CrudManager
        entity="route_page"
        title={`Popular Flight Routes (${routes.length})`}
        description="Configure route pairs, daily frequencies, starting fares, and structured flight metadata."
        columns={ROUTE_COLUMNS}
        rows={routes}
        emptyHint="No routes configured. Click 'Add New' to create an SEO route."
      />

      <CrudManager
        entity="destination"
        title={`Destination Guides (${destinations.length})`}
        description="Manage city and country destination guides, hero banners, and visa documentation requirements."
        columns={DESTINATION_COLUMNS}
        rows={destinations}
        emptyHint="No destinations found. Click 'Add New' to add a destination."
      />
    </div>
  );
}

