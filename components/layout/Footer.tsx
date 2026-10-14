import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { getBrandConfig } from '@/lib/config/brand';
import { DummyTicketLogo } from '@/components/brand/DummyTicketLogo';

export function Footer() {
  const brand = getBrandConfig();

  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <DummyTicketLogo variant="full" theme="dark" size="md" />
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Next-generation flight discovery, transparent server-verified fare snapshots, and boarding-pass-styled confirmed itineraries across 10 Indian and global carriers.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-400" />
                <span>{brand.supportEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-brand-400" />
                <span>{brand.supportPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-brand-400" />
                <span>{brand.headquarters}</span>
              </p>
            </div>
          </div>

          {/* Column 2: Popular Routes & Destinations */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Routes & Guides
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/routes/hyd-to-del" className="hover:text-white">
                  Hyderabad to Delhi (HYD → DEL)
                </Link>
              </li>
              <li>
                <Link href="/routes/hyd-to-bom" className="hover:text-white">
                  Hyderabad to Mumbai (HYD → BOM)
                </Link>
              </li>
              <li>
                <Link href="/routes/hyd-to-blr" className="hover:text-white">
                  Hyderabad to Bengaluru (HYD → BLR)
                </Link>
              </li>
              <li>
                <Link href="/routes/del-to-hyd" className="hover:text-white">
                  Delhi to Hyderabad (DEL → HYD)
                </Link>
              </li>
              <li>
                <Link href="/routes/bom-to-dxb" className="hover:text-white">
                  Mumbai to Dubai (BOM → DXB)
                </Link>
              </li>
              <li>
                <Link href="/routes/hyd-to-sin" className="hover:text-white">
                  Hyderabad to Singapore (HYD → SIN)
                </Link>
              </li>
              <li>
                <Link href="/destinations/dubai" className="hover:text-white">
                  Dubai Airport Guide (DXB)
                </Link>
              </li>
              <li>
                <Link href="/destinations/singapore" className="hover:text-white">
                  Singapore Changi Guide (SIN)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer & Platform */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform & Account
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/flights" className="hover:text-white">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link href="/track-booking" className="hover:text-white">
                  Track Booking Reference
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/account/bookings" className="hover:text-white">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Aviation & Travel Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal, Compliance & Help */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Legal & Policies
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/help" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-white">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white">
                  Booking Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {brand.legalEntityName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-verified-500" />
            <span>
              Razorpay Server-Verified Payments · Auditable Fare Snapshots · WCAG 2.2 AA Accessible
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
