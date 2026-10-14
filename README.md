# DummyTicket — Flight Booking Prototype (Frontend Only)

A responsive **prototype** of a flight search, dynamic pricing, booking management, and boarding-pass-styled itinerary platform built with **Next.js 15 (App Router), TypeScript (strict), Tailwind CSS, Framer Motion, jsPDF, and QRCode**.

> **Prototype mode:** there is **no backend**. Supabase/Auth/RLS, the Razorpay gateway, email service, API routes, and middleware have all been removed. Every flow (search → checkout → payment → ticket → account → admin) runs entirely in the browser against a deterministic **localStorage mock store** (`lib/mock/`). No login or role security is enforced — user and admin areas open directly. Data lives only in your browser and can be reset anytime.

---

## 1. Visual Identity & Fulfillment Model

**DummyTicket** features a custom SVG brand system (`DummyTicketLogo` integrating a geometric airplane and flight path with the letter `D`), an advanced motion design system (`framer-motion`), all **10 major and regional Indian airlines** (`IndiGo`, `Air India`, `Air India Express`, `Akasa Air`, `SpiceJet`, `Alliance Air`, `Fly91`, `Star Air`, `IndiaOne Air`, `Zoom Air`) plus international carriers (`BA`, `EK`, `SQ`, `QR`, `LH`), and a signature boarding-pass ticket design:

- **Signature Boarding Pass (`SignatureBoardingPass.tsx` & `lib/pdf/generator.ts`)**:
  - Royal blue header band (`#0062E0`), ice-blue accent stripes, crisp white boarding-pass body, airplane trajectory arc, dashed perforation line, detachable stub, barcode + QR code, and 4 interactive view modes (`Mobile Pass`, `Gate Stub`, `Desktop Airline Pass`, `PDF & Receipt Preview`).
- **Mock Fulfillment (simulated `live_provider`)**:
  - `mockCapturePayment` in `lib/mock/store.ts` issues an airline confirmation (`airlinePnr`), provider reference (`providerBookingRef`), per-passenger e-ticket numbers, and a receipt — all generated client-side, no real charge.
  - Booking references follow the `DT-[ORIGIN][CODE][DEST]` format; payment receipts use `DT-RCPT-...` and are always separate from the itinerary PDF.

---

## 2. Local Setup Instructions

### Prerequisites
- Node.js `v20+` (verified on `v22.15.0`)
- npm `v10+`
- No database, API keys, or `.env` required.

### Installation
```bash
npm install
```

### Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000`. Demo data (bookings, payments, users, catalog) is seeded automatically into `localStorage` on first load. Use **Reset Demo Data** in the account menu to reseed.

---

## 3. Complete Route Map

### Public Pages (25 Routes)
- `/` — Homepage (Hero with animated SVG flight path, *"Your Next Journey Starts Here."*, interactive `SignatureBoardingPass` showcase with 3 view toggles, featured HYD→MSY flights, all 10 Indian airlines showcase, popular routes, popular destinations, how it works, transparent pricing & dual-PDF preview, travel guides, FAQs, newsletter)
- `/flights` — Flight search results with `BookingStepper`, left-sidebar filters, sorting, and `AirlineLogo` cards
- `/flights/[flightId]` — Flight segment breakdown, baggage rules, fare conditions, and locked Fare Snapshot
- `/checkout/[bookingId]` — Multi-step passenger form with `BookingStepper`, passport validation, coupon codes (`WELCOME10`, `FLAT500`), explicit consent, and simulated payment
- `/booking/[bookingId]` — Booking management, interactive `SignatureBoardingPass`, email delivery history, separate Itinerary & Receipt PDF downloads, and online cancellation
- `/payment/success` — Server-verified payment confirmation screen with 3D boarding-pass reveal and separate Receipt PDF download
- `/payment/failed` — Failed or incomplete payment retry screen
- `/ticket/[reference]` — DummyTicket Itinerary page with QR verification, airline PNR, and PDF downloads (`/sample-ticket/...` permanently redirects here)
- `/track-booking` — Booking reference lookup (`DT-HYD842MSY`, `DT-HYD319DEL`)
- `/destinations/[slug]` — Destination guides (`/destinations/dubai`, `/destinations/singapore`, `/destinations/london`, `/destinations/new-delhi`)
- `/routes/[slug]` — SEO route landing pages (`/routes/hyd-to-del`, `/routes/hyd-to-bom`, `/routes/hyd-to-blr`, `/routes/del-to-hyd`, `/routes/bom-to-dxb`, `/routes/hyd-to-sin`)
- `/blog` & `/blog/[slug]` — Editorial travel & aviation compliance articles
- `/about`, `/contact`, `/help`, `/faq`
- `/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/cancellation-policy`, `/cookie-policy`, `/disclaimer`
- `/sitemap.xml` & `/robots.txt`

### Customer Pages (no real auth — demo session)
- `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email` (all simulated locally against the mock store)
- `/account`, `/account/profile`, `/account/bookings`, `/account/bookings/[bookingId]`, `/account/tickets`, `/account/notifications`, `/account/security`

### Admin Console (18 Routes — opens directly, no role security)
- `/admin`, `/admin/flights`, `/admin/airports`, `/admin/airlines`, `/admin/bookings`, `/admin/users`, `/admin/payments`, `/admin/refunds`, `/admin/pricing`, `/admin/coupons`, `/admin/notifications`, `/admin/email-templates`, `/admin/reviews`, `/admin/blog`, `/admin/seo`, `/admin/reports`, `/admin/settings`, `/admin/audit-logs`

---

## 4. Data Layer (mock store)

There are **no API endpoints**. All reads/writes go through `lib/mock/store.ts`, which persists a seeded database (`lib/mock/seed.ts`) to `localStorage`:

| Function | Replaces old endpoint | Description |
| :--- | :--- | :--- |
| `searchAirports` / `getDeterministicFlightOffers` | `/api/airports`, `/api/bookings` (search) | Airport + flight offer data from `lib/flights/dataset.ts`. |
| `createBooking` | `POST /api/bookings` | Creates a browser-side booking in `awaiting_payment` with a mock payment row. |
| `mockCapturePayment(id, { fail? })` | `/api/payments/create-order` + `/verify` + webhook | Simulates payment capture and issues PNR, e-tickets, receipt; `fail` simulates a decline. |
| `cancelBooking` | `POST /api/bookings/[id]/cancel` | Cancels a booking and queues a refund. |
| `processRefund` / `listAllRefunds` | `/api/admin/actions` | Moves a refund to `processed`. |
| `getBookingByIdOrReference` / `listUserBookings` | `/api/bookings`, PDF route | Booking lookups; PDF download is generated client-side via `lib/pdf/generator.ts`. |
| `listUserNotifications` / `markAllNotificationsRead` | `/api/notifications` | Notification feed. |
| `listCatalog` / `catalogUpsert` / `catalogDelete` / `assignRole` / `setSuspended` | `/api/admin/actions` | Admin CRUD over the mock catalog and demo users. |

Use **Reset Demo Data** (account menu) or `resetPrototypeData()` to reseed.

---

## 5. Build Verification

```bash
# Run strict TypeScript verification
npm run typecheck

# Build the prototype bundle
npm run build
```
