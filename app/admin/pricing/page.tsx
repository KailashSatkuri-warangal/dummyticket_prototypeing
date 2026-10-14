'use client';

import React, { useEffect, useState } from 'react';
import { listCatalog } from '@/lib/mock/store';
import type { CatalogRow } from '@/lib/mock/types';
import { CrudColumn, CrudManager } from '@/components/admin/CrudManager';
import { AdminActionTrigger } from '@/components/admin/AdminActionTrigger';

const FARE_RULE_COLUMNS: CrudColumn[] = [
  {
    key: 'code',
    label: 'Rule Code',
    type: 'text',
    required: true,
    placeholder: 'e.g. ECO_SAVER, BIZ_FLEX',
  },
  {
    key: 'name',
    label: 'Tier Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. Economy Saver, Business Flex',
  },
  {
    key: 'cabin',
    label: 'Cabin',
    type: 'select',
    options: [
      { value: 'economy', label: 'Economy' },
      { value: 'premium_economy', label: 'Premium Economy' },
      { value: 'business', label: 'Business' },
      { value: 'first', label: 'First Class' },
    ],
  },
  {
    key: 'cabin_baggage_kg',
    label: 'Cabin Bag (kg)',
    type: 'number',
    placeholder: 'e.g. 7',
  },
  {
    key: 'checked_baggage_kg',
    label: 'Checked Bag (kg)',
    type: 'number',
    placeholder: 'e.g. 15 or 25',
  },
  {
    key: 'change_fee_inr',
    label: 'Change Fee (₹)',
    type: 'number',
    placeholder: 'e.g. 1999',
  },
  {
    key: 'cancellation_fee_inr',
    label: 'Cancel Fee (₹)',
    type: 'number',
    placeholder: 'e.g. 2999',
  },
  {
    key: 'is_refundable',
    label: 'Refundable',
    type: 'boolean',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
];

export default function AdminPricingPage() {
  const [fareRules, setFareRules] = useState<CatalogRow[] | null>(null);

  useEffect(() => {
    let active = true;
    function reload() {
      listCatalog('fare_rule').then((rows) => {
        if (active) setFareRules(rows);
      });
    }
    reload();
    window.addEventListener('prototype:refresh', reload);
    return () => {
      active = false;
      window.removeEventListener('prototype:refresh', reload);
    };
  }, []);

  if (fareRules === null) {
    return <p className="py-6 text-xs text-slate-500">Loading demo data…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h1 className="text-xl font-extrabold text-navy-900">
          Dynamic Pricing Engine & Fare Rule Configuration
        </h1>
        <p className="text-xs text-slate-600">
          Configure base fares, cabin multipliers, statutory taxes, and transparent platform service fees. Any fare increase triggers mandatory user acceptance at checkout.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <AdminActionTrigger
            label="Apply +₹1,200 Adjustment on HYD→MSY Offer 1"
            payload={{
              action: 'SET_FARE_ADJUSTMENT',
              flightOfferId: 'offer-hyd-msy-1',
              deltaInr: 1200,
            }}
          />
          <AdminActionTrigger
            label="Reset HYD→MSY Offer 1 Adjustment to ₹0"
            variant="secondary"
            payload={{
              action: 'SET_FARE_ADJUSTMENT',
              flightOfferId: 'offer-hyd-msy-1',
              deltaInr: 0,
            }}
          />
        </div>
      </div>

      <CrudManager
        entity="fare_rule"
        title={`Configured Fare Rules & Baggage Tiers (${fareRules.length})`}
        description="Add, edit, or remove fare class tiers, baggage allowances, cancellation charges, and refundability rules."
        columns={FARE_RULE_COLUMNS}
        rows={fareRules}
        emptyHint="No fare rules found. Click 'Add New' to configure a rule."
      />
    </div>
  );
}

