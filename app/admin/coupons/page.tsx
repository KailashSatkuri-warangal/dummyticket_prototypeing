'use client';

import React, { useEffect, useState } from 'react';
import { listCatalog } from '@/lib/mock/store';
import type { CatalogRow } from '@/lib/mock/types';
import { CrudColumn, CrudManager } from '@/components/admin/CrudManager';

const COLUMNS: CrudColumn[] = [
  {
    key: 'code',
    label: 'Coupon Code',
    type: 'text',
    required: true,
    placeholder: 'e.g. WELCOME10, FLAT500',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'text',
    required: true,
    placeholder: 'e.g. 10% off on all Indian domestic routes',
  },
  {
    key: 'discount_type',
    label: 'Discount Type',
    type: 'select',
    options: [
      { value: 'percentage', label: 'Percentage (%)' },
      { value: 'fixed', label: 'Fixed Amount (₹)' },
    ],
  },
  {
    key: 'discount_value',
    label: 'Discount Value',
    type: 'number',
    required: true,
    placeholder: 'e.g. 10 (for 10%) or 500 (for ₹500)',
  },
  {
    key: 'min_fare_inr',
    label: 'Min Order (₹)',
    type: 'number',
    placeholder: 'e.g. 3000',
  },
  {
    key: 'max_discount_inr',
    label: 'Max Discount (₹)',
    type: 'number',
    placeholder: 'e.g. 1500',
  },
  {
    key: 'is_active',
    label: 'Status',
    type: 'boolean',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Disabled' },
    ],
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CatalogRow[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listCatalog('coupon').then((rows) => {
        if (active) setCoupons(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (coupons === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="space-y-6">
      <CrudManager
        entity="coupon"
        title={`Promotional Coupons (${coupons.length})`}
        description="Create, edit, and deactivate discount codes and minimum order rules evaluated by the pricing engine."
        columns={COLUMNS}
        rows={coupons}
        emptyHint="No active coupon codes found. Click 'Add New' to create one."
      />
    </div>
  );
}

