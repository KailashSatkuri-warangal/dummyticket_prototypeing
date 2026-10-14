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
    placeholder: 'e.g. 6E, AI, IX',
  },
  {
    key: 'icao_code',
    label: 'ICAO Code',
    type: 'text',
    placeholder: 'e.g. IGO, AIC, AXB',
  },
  {
    key: 'name',
    label: 'Airline Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. IndiGo, Air India',
  },
  {
    key: 'country',
    label: 'Country',
    type: 'text',
    required: true,
    placeholder: 'e.g. India',
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'indian', label: 'Indian Carrier' },
      { value: 'international', label: 'International Partner' },
    ],
  },
  {
    key: 'brand_color',
    label: 'Brand Hex Color',
    type: 'text',
    placeholder: 'e.g. #001B94, #B81D13',
  },
  {
    key: 'is_active',
    label: 'Active',
    type: 'boolean',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Disabled' },
    ],
  },
  {
    key: 'is_verified',
    label: 'Verified',
    type: 'boolean',
    options: [
      { value: 'true', label: 'Verified' },
      { value: 'false', label: 'Unverified' },
    ],
  },
];

export default function AdminAirlinesPage() {
  const [airlines, setAirlines] = useState<CatalogRow[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listCatalog('airline').then((rows) => {
        if (active) setAirlines(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (airlines === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="space-y-6">
      <CrudManager
        entity="airline"
        title={`Airlines Directory (${airlines.length})`}
        description="Configure operating airlines, IATA/ICAO identifiers, branding colors, and active carrier status."
        columns={COLUMNS}
        rows={airlines}
        emptyHint="No airline records found. Click 'Add New' to configure an airline."
      />
    </div>
  );
}

