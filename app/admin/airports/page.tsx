'use client';

import React, { useEffect, useState } from 'react';
import { listCatalog } from '@/lib/mock/store';
import type { CatalogRow } from '@/lib/mock/types';
import { CrudColumn, CrudManager } from '@/components/admin/CrudManager';

const COLUMNS: CrudColumn[] = [
  {
    key: 'iata_code',
    label: 'IATA Code',
    type: 'text',
    required: true,
    placeholder: 'e.g. HYD, DEL, BOM',
  },
  {
    key: 'icao_code',
    label: 'ICAO Code',
    type: 'text',
    placeholder: 'e.g. VOHS, VIDP',
  },
  {
    key: 'name',
    label: 'Airport Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. Rajiv Gandhi International Airport',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
    required: true,
    placeholder: 'e.g. Hyderabad',
  },
  {
    key: 'country',
    label: 'Country',
    type: 'text',
    required: true,
    placeholder: 'e.g. India',
  },
  {
    key: 'country_code',
    label: 'Country Code',
    type: 'text',
    required: true,
    placeholder: 'e.g. IN, AE, US',
  },
  {
    key: 'timezone',
    label: 'Timezone',
    type: 'text',
    placeholder: 'e.g. Asia/Kolkata',
  },
  {
    key: 'is_international',
    label: 'International',
    type: 'boolean',
    options: [
      { value: 'false', label: 'Domestic' },
      { value: 'true', label: 'International' },
    ],
  },
];

export default function AdminAirportsPage() {
  const [airports, setAirports] = useState<CatalogRow[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listCatalog('airport').then((rows) => {
        if (active) setAirports(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (airports === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="space-y-6">
      <CrudManager
        entity="airport"
        title={`Airports & Aerodromes (${airports.length})`}
        description="Add, edit, and manage domestic and international airports powering flight search, routes, and itineraries."
        columns={COLUMNS}
        rows={airports}
        emptyHint="No airport records found. Click 'Add New' to create an airport."
      />
    </div>
  );
}

