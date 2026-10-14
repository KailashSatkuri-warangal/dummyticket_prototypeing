import type {
  AppRole,
  AuditLogRecord,
  BookingPassenger,
  BookingRecord,
  EmailLogRecord,
  NotificationItem,
  PaymentRecord,
  PaymentReceipt,
} from '@/types';
import type { CatalogRow, MockDatabase, ProfileRecord, RefundRecord } from './types';
import {
  AIRLINES,
  AIRPORTS,
  BLOG_POSTS,
  DESTINATIONS,
  FARE_RULES,
  ROUTE_PAGES,
  getFlightOfferById,
} from '@/lib/flights/dataset';
import { CONFIGURED_COUPONS, calculateCompleteFare } from '@/lib/pricing/engine';

export const DEMO_USER_ID = 'user-demo-1';
export const DEMO_USER_2_ID = 'user-demo-2';

export const DEMO_PROFILE: ProfileRecord = {
  id: DEMO_USER_ID,
  fullName: 'Arjun Reddy',
  email: 'arjun.reddy@example.com',
  phone: '+91 98498 12345',
  role: 'admin',
  roles: ['customer', 'admin'],
  isSuspended: false,
  createdAt: '2026-01-12T09:00:00.000Z',
};

const OTHER_PROFILES: ProfileRecord[] = [
  {
    id: DEMO_USER_2_ID,
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 90000 45678',
    role: 'customer',
    roles: ['customer'],
    isSuspended: false,
    createdAt: '2026-03-02T11:30:00.000Z',
  },
  {
    id: 'user-demo-3',
    fullName: 'Vikram Nair',
    email: 'vikram.nair@example.com',
    phone: '+91 88888 33221',
    role: 'support_agent',
    roles: ['support_agent', 'customer'],
    isSuspended: false,
    createdAt: '2026-04-19T07:15:00.000Z',
  },
  {
    id: 'user-demo-4',
    fullName: 'Fatima Khan',
    email: 'fatima.khan@example.com',
    phone: '+91 77777 11987',
    role: 'customer',
    roles: ['customer'],
    isSuspended: true,
    createdAt: '2026-05-30T16:45:00.000Z',
  },
];

function buildBooking(opts: {
  id: string;
  reference: string;
  offerFlightId: string;
  userId: string;
  contactEmail: string;
  contactPhone: string;
  passengers: Array<{
    firstName: string;
    lastName: string;
    passengerType?: 'adult' | 'child' | 'infant';
    ticketNumber?: string;
  }>;
  status: BookingRecord['status'];
  paymentStatus: BookingRecord['paymentStatus'];
  ticketStatus: BookingRecord['ticketStatus'];
  airlinePnr?: string;
  providerBookingRef?: string;
  departureDate: string;
  cancellationReason?: string;
  createdOffsetDays: number;
}): BookingRecord {
  const offer =
    getFlightOfferById(opts.offerFlightId, opts.departureDate) ??
    getFlightOfferById('offer-hyd-del-1', opts.departureDate)!;
  const snapshot = calculateCompleteFare({
    offer,
    adults: opts.passengers.filter((p) => (p.passengerType ?? 'adult') === 'adult')
      .length,
    children: opts.passengers.filter((p) => p.passengerType === 'child').length,
    infants: opts.passengers.filter((p) => p.passengerType === 'infant').length,
    cabin: offer.cabin,
  });
  const createdAt = new Date(
    Date.now() - opts.createdOffsetDays * 86400000
  ).toISOString();
  const pax: BookingPassenger[] = opts.passengers.map((p, i) => ({
    id: `${opts.id}-pax-${i + 1}`,
    bookingId: opts.id,
    passengerType: p.passengerType ?? 'adult',
    firstName: p.firstName,
    lastName: p.lastName,
    dateOfBirth: '1995-05-14',
    gender: 'male',
    nationality: 'IN',
    ticketNumber: p.ticketNumber,
  }));

  return {
    id: opts.id,
    bookingReference: opts.reference,
    userId: opts.userId,
    flightOfferId: offer.id,
    flightOffer: offer,
    fareSnapshotId: snapshot.id,
    fareSnapshot: snapshot,
    originIata: offer.origin.iataCode,
    destinationIata: offer.destination.iataCode,
    departureDate: opts.departureDate,
    adults: pax.filter((p) => p.passengerType === 'adult').length,
    children: pax.filter((p) => p.passengerType === 'child').length,
    infants: pax.filter((p) => p.passengerType === 'infant').length,
    cabin: offer.cabin,
    currency: 'INR',
    totalAmount: snapshot.grandTotal,
    status: opts.status,
    paymentStatus: opts.paymentStatus,
    ticketStatus: opts.ticketStatus,
    fulfillmentMode: 'live_provider',
    airlinePnr: opts.airlinePnr,
    providerBookingRef: opts.providerBookingRef,
    contactEmail: opts.contactEmail,
    contactPhone: opts.contactPhone,
    passengers: pax,
    termsAcceptedAt: createdAt,
    cancellationReason: opts.cancellationReason,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt,
    updatedAt: createdAt,
  };
}

function payment(
  booking: BookingRecord,
  status: PaymentRecord['status'],
  opts?: { razorpayPaymentId?: string; verified?: boolean }
): PaymentRecord {
  return {
    id: `pay-${booking.id}`,
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    razorpayOrderId: `order_mock${booking.id.replace(/[^a-z0-9]/gi, '').slice(-8)}`,
    razorpayPaymentId: opts?.razorpayPaymentId,
    razorpaySignatureVerified: Boolean(opts?.verified),
    amountSubunits: Math.round(booking.totalAmount * 100),
    amountInr: booking.totalAmount,
    currency: 'INR',
    status,
    paymentMethod: 'UPI',
    isLiveMode: false,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

function receipt(booking: BookingRecord, pay: PaymentRecord): PaymentReceipt {
  const s = booking.fareSnapshot;
  return {
    id: `rcpt-${booking.id}`,
    receiptNumber: `DT-RCPT-${booking.bookingReference.slice(-6)}-${booking.id.slice(-3).toUpperCase()}`,
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    paymentId: pay.id,
    paymentReference: pay.razorpayPaymentId ?? pay.razorpayOrderId,
    paymentStatus: pay.status,
    paymentDate: booking.updatedAt,
    amountPaidInr: booking.totalAmount,
    baseFareInr: s.baseFareTotal,
    taxesInr: s.taxesTotal,
    serviceFeeInr: s.serviceFeeTotal,
    discountInr: s.discountTotal,
    currency: 'INR',
  };
}

function emailLog(
  booking: BookingRecord,
  templateName: string,
  subject: string
): EmailLogRecord {
  return {
    id: `eml-${booking.id}-${templateName}`,
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    recipientEmail: booking.contactEmail,
    templateName,
    templateVersion: 'v1.2',
    subject,
    providerMessageId: `msg_mock_${Math.abs(hashCode(booking.id + templateName))
      .toString(16)
      .padStart(8, '0')}`,
    status: 'delivered',
    retryCount: 0,
    createdAt: booking.updatedAt,
  };
}

function notification(
  id: string,
  userId: string,
  eventType: NotificationItem['eventType'],
  title: string,
  message: string,
  actionUrl?: string,
  isRead = false
): NotificationItem {
  return {
    id,
    userId,
    eventType,
    title,
    message,
    actionUrl,
    isRead,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 86400000).toISOString(),
  };
}

function hashCode(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h;
}

function audit(
  id: string,
  actorEmail: string,
  action: string,
  resourceType: string,
  resourceId: string,
  afterState?: Record<string, unknown>
): AuditLogRecord {
  return {
    id,
    actorId: DEMO_USER_ID,
    actorEmail,
    action,
    resourceType,
    resourceId,
    afterState,
    correlationId: `corr_${id}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 3) * 86400000).toISOString(),
  };
}

function toSnakeRow(record: Record<string, unknown>): CatalogRow {
  const out: CatalogRow = {};
  for (const [key, value] of Object.entries(record)) {
    const snake = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    out[snake] =
      value === undefined
        ? null
        : typeof value === 'object' || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string'
          ? value
          : String(value);
  }
  return out;
}

export function buildSeedDatabase(): MockDatabase {
  const b1 = buildBooking({
    id: 'bk-demo-hyd-msy',
    reference: 'DT-HYD842MSY',
    offerFlightId: 'offer-hyd-msy-1',
    userId: DEMO_USER_ID,
    contactEmail: DEMO_PROFILE.email,
    contactPhone: DEMO_PROFILE.phone ?? '+91 98498 12345',
    passengers: [
      { firstName: 'Arjun', lastName: 'Reddy', ticketNumber: '098-4421987654' },
    ],
    status: 'ticketed',
    paymentStatus: 'captured',
    ticketStatus: 'issued',
    airlinePnr: 'K7QPL2',
    providerBookingRef: 'PROV-IND-5583921',
    departureDate: '2026-12-15',
    createdOffsetDays: 6,
  });
  const b2 = buildBooking({
    id: 'bk-demo-hyd-del',
    reference: 'DT-HYD319DEL',
    offerFlightId: 'offer-hyd-del-1',
    userId: DEMO_USER_ID,
    contactEmail: DEMO_PROFILE.email,
    contactPhone: DEMO_PROFILE.phone ?? '+91 98498 12345',
    passengers: [
      { firstName: 'Arjun', lastName: 'Reddy' },
      { firstName: 'Sneha', lastName: 'Reddy', passengerType: 'adult' },
    ],
    status: 'confirmed',
    paymentStatus: 'captured',
    ticketStatus: 'not_generated',
    airlinePnr: 'M3XRT8',
    providerBookingRef: 'PROV-IGO-7741208',
    departureDate: '2026-12-28',
    createdOffsetDays: 2,
  });
  const b3 = buildBooking({
    id: 'bk-demo-hyd-blr',
    reference: 'DT-HYD602BLR',
    offerFlightId: 'offer-hyd-blr-2',
    userId: DEMO_USER_2_ID,
    contactEmail: 'priya.sharma@example.com',
    contactPhone: '+91 90000 45678',
    passengers: [{ firstName: 'Priya', lastName: 'Sharma' }],
    status: 'awaiting_payment',
    paymentStatus: 'created',
    ticketStatus: 'not_generated',
    departureDate: '2026-11-20',
    createdOffsetDays: 0,
  });
  const b4 = buildBooking({
    id: 'bk-demo-hyd-bom',
    reference: 'DT-HYD505BOM',
    offerFlightId: 'offer-hyd-bom-1',
    userId: DEMO_USER_ID,
    contactEmail: DEMO_PROFILE.email,
    contactPhone: DEMO_PROFILE.phone ?? '+91 98498 12345',
    passengers: [{ firstName: 'Arjun', lastName: 'Reddy' }],
    status: 'cancelled',
    paymentStatus: 'refunded',
    ticketStatus: 'voided',
    departureDate: '2026-10-02',
    cancellationReason: 'Change of travel plan — passenger requested cancellation.',
    createdOffsetDays: 30,
  });

  const bookings = [b1, b2, b3, b4].filter((b): b is BookingRecord => b !== null);

  const p1 = payment(b1, 'captured', {
    razorpayPaymentId: 'pay_mockQK8zT3aBcD',
    verified: true,
  });
  const p2 = payment(b2, 'captured', {
    razorpayPaymentId: 'pay_mockPL7xR2mNvB',
    verified: true,
  });
  const p3 = payment(b3, 'created');
  const p4 = payment(b4, 'refunded', {
    razorpayPaymentId: 'pay_mockWD3sJ9kLmA',
    verified: true,
  });
  const payments = [p1, p2, p3, p4];

  const tickets = [
    {
      id: `tkt-${b1.id}`,
      bookingId: b1.id,
      bookingReference: b1.bookingReference,
      documentReference: `DT-ITN-${b1.bookingReference.slice(-6)}`,
      status: 'issued' as const,
      isSampleDocument: true,
      watermarkText: 'DEMO',
      airlinePnr: b1.airlinePnr,
      eTicketNumbers: ['098-4421987654'],
      verificationToken: `demo-token-${b1.id}`,
      generatedAt: b1.updatedAt,
    },
  ];
  b1.ticket = tickets[0];
  b1.receipt = receipt(b1, p1);
  b2.receipt = receipt(b2, p2);

  const emailLogs: EmailLogRecord[] = bookings.flatMap((b) => {
    const logs = [
      emailLog(b, 'booking_initiated', `Your ${b.originIata}→${b.destinationIata} booking ${b.bookingReference} is on hold`),
      emailLog(b, 'booking_confirmation', `Booking ${b.bookingReference} confirmed`),
    ];
    if (b.paymentStatus === 'captured') {
      logs.push(
        emailLog(b, 'payment_successful', `Payment received for ${b.bookingReference}`),
        emailLog(b, 'itinerary_document', `Confirmed itinerary for ${b.bookingReference}`)
      );
    }
    if (b.status === 'cancelled') {
      logs.push(
        emailLog(b, 'booking_cancelled', `Booking ${b.bookingReference} cancelled`),
        emailLog(b, 'refund_completed', `Refund of ₹${b.totalAmount} processed for ${b.bookingReference}`)
      );
    }
    return logs;
  });

  const notifications: NotificationItem[] = [
    notification('ntf-1', DEMO_USER_ID, 'ticket_issued', 'E-ticket issued', `Your itinerary ${b1.bookingReference} with PNR ${b1.airlinePnr} is confirmed.`, `/booking/${b1.bookingReference}`, true),
    notification('ntf-2', DEMO_USER_ID, 'payment_confirmed', 'Payment captured', `₹${b2.totalAmount} received for booking ${b2.bookingReference}.`, `/booking/${b2.bookingReference}`),
    notification('ntf-3', DEMO_USER_ID, 'refund_updated', 'Refund processed', `Refund for ${b4.bookingReference} has been credited to the source payment method.`, `/account/bookings/${b4.bookingReference}`),
    notification('ntf-4', DEMO_USER_ID, 'admin_announcement', 'Winter fare sale live', 'Use WELCOME10 for 10% off on festive season bookings.', '/flights'),
    notification('ntf-5', DEMO_USER_2_ID, 'booking_created', 'Booking on hold', `Complete payment for ${b3.bookingReference} before it expires.`, `/checkout/${b3.flightOfferId}`),
  ];

  const refunds: RefundRecord[] = [
    {
      id: 'rfnd-demo-0001-processed',
      bookingId: b4.id,
      bookingReference: b4.bookingReference,
      amountInr: b4.totalAmount,
      reason: 'Voluntary cancellation by passenger',
      status: 'processed',
      createdAt: b4.updatedAt,
    },
    {
      id: 'rfnd-demo-0002-requested',
      bookingId: b1.id,
      bookingReference: b1.bookingReference,
      amountInr: b1.totalAmount,
      reason: 'Medical emergency — full refund requested',
      status: 'requested',
      createdAt: new Date().toISOString(),
    },
  ];

  const auditLogs: AuditLogRecord[] = [
    audit('aud-1', DEMO_PROFILE.email, 'CATALOG_UPSERT', 'coupon', 'FLAT500', { code: 'FLAT500', is_active: true }),
    audit('aud-2', 'vikram.nair@example.com', 'ASSIGN_ROLE', 'user', DEMO_USER_2_ID, { role: 'customer' }),
    audit('aud-3', 'vikram.nair@example.com', 'BOOKING_CANCEL', 'booking', b4.bookingReference, { status: 'cancelled' }),
    audit('aud-4', DEMO_PROFILE.email, 'CATALOG_UPSERT', 'fare_rule', 'ECO_SAVER', { cancellation_fee_inr: 2500 }),
    audit('aud-5', 'system@dummyticket.demo', 'PAYMENT_WEBHOOK', 'payment', p2.id, { status: 'captured' }),
  ];

  const catalog: Record<string, CatalogRow[]> = {
    airline: AIRLINES.map((a) => toSnakeRow({ id: a.id, iataCode: a.iataCode, icaoCode: a.icaoCode, name: a.name, country: a.country, category: a.category ?? 'indian', brandColor: a.brandColor, isActive: a.isActive, isVerified: a.isVerified })),
    airport: AIRPORTS.map((a) => toSnakeRow({ id: a.id, iataCode: a.iataCode, icaoCode: a.icaoCode ?? '', name: a.name, city: a.city, country: a.country, countryCode: a.countryCode, timezone: a.timezone, isInternational: Boolean(a.isInternational) })),
    fare_rule: Object.values(FARE_RULES).map((r) => toSnakeRow({ ...r, isActive: true })),
    coupon: Object.values(CONFIGURED_COUPONS).map((c) => toSnakeRow({ id: c.code, ...c })),
    blog_post: BLOG_POSTS.map((p) => toSnakeRow({ id: p.id, slug: p.slug, title: p.title, category: p.category, authorName: p.authorName, excerpt: p.excerpt, metaTitle: p.metaTitle, metaDescription: p.metaDescription, readingTimeMinutes: p.readingTimeMinutes, isPublished: true })),
    route_page: ROUTE_PAGES.map((r) => toSnakeRow({ id: r.id, slug: r.slug, originIata: r.originIata, destinationIata: r.destinationIata, originCity: r.originCity, destinationCity: r.destinationCity, startingFareInr: r.startingFareInr, dailyFlightsCount: r.dailyFlightsCount, airlinesOperating: r.airlinesOperating.join(', ') })),
    destination: DESTINATIONS.map((d) => toSnakeRow({ id: d.id, slug: d.slug, city: d.city, country: d.country, airportIata: d.airportIata, headline: d.headline, startingFareInr: d.startingFareInr, metaTitle: d.metaTitle, metaDescription: d.metaDescription })),
  };

  return {
    bookings,
    payments,
    notifications,
    emailLogs,
    auditLogs,
    profiles: [DEMO_PROFILE, ...OTHER_PROFILES],
    refunds,
    catalog,
    receipts: [b1.receipt, b2.receipt].filter((r): r is PaymentReceipt => Boolean(r)),
    fareSnapshots: {},
  };
}

export function sessionFromProfile(profile: ProfileRecord): {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: AppRole;
  roles: AppRole[];
  emailConfirmed: boolean;
} {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    phone: profile.phone,
    role: profile.role,
    roles: profile.roles,
    emailConfirmed: true,
  };
}
