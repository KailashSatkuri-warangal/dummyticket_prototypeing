import type {
  AppRole,
  AuditLogRecord,
  BookingRecord,
  EmailLogRecord,
  FareSnapshot,
  NotificationItem,
  PaymentRecord,
  PassengerInput,
  TicketDocument,
} from '@/types';
import type { CatalogRow, MockDatabase, ProfileRecord, SessionUser } from './types';
import { buildSeedDatabase, sessionFromProfile } from './seed';

const STORAGE_KEY = 'dummyticket_prototype_db_v1';

// Server-side (static prerender) fallback so pre-rendered HTML renders demo data
const serverDb = buildSeedDatabase();

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function loadDb(): MockDatabase {
  if (!isBrowser()) return serverDb;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockDatabase;
      if (parsed && Array.isArray(parsed.bookings) && parsed.catalog) {
        return parsed;
      }
    }
  } catch {
    // corrupted storage — fall through to reseed
  }
  const fresh = buildSeedDatabase();
  saveDb(fresh);
  return fresh;
}

function saveDb(db: MockDatabase): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // storage full/unavailable — prototype keeps in-memory copy for the tab
  }
}

function mutate(fn: (db: MockDatabase) => void): void {
  const db = loadDb();
  fn(db);
  saveDb(db);
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 180));
}

export function resetPrototypeData(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

/* ------------------------------- session -------------------------------- */

const SESSION_KEY = 'dummyticket_prototype_session';

export function getSessionUserSync(): SessionUser | null {
  if (!isBrowser()) return sessionFromProfile(serverDb.profiles[0]);
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw === 'none') return null;
    if (!raw) return sessionFromProfile(loadDb().profiles[0]);
    return JSON.parse(raw) as SessionUser;
  } catch {
    return sessionFromProfile(loadDb().profiles[0]);
  }
}

export function getSessionUser(): Promise<SessionUser | null> {
  return delay(getSessionUserSync());
}

export function signIn(profileId?: string): SessionUser | null {
  const db = loadDb();
  const profile =
    db.profiles.find((p) => p.id === profileId) ??
    db.profiles.find((p) => p.roles.includes('admin')) ??
    db.profiles[0];
  if (!profile) return null;
  const session = sessionFromProfile(profile);
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function switchRole(role: AppRole): SessionUser | null {
  const current = getSessionUserSync();
  if (!current) return null;
  const updated: SessionUser = { ...current, role };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function signOut(): void {
  if (isBrowser()) window.localStorage.setItem(SESSION_KEY, 'none');
}

export function isAdminSession(user: SessionUser | null): boolean {
  return Boolean(
    user &&
      ['admin', 'support_agent', 'finance_manager', 'content_editor'].includes(
        user.role
      )
  );
}

/* ------------------------------- profiles ------------------------------- */

export function getProfileById(userId: string): Promise<ProfileRecord | undefined> {
  return delay(loadDb().profiles.find((p) => p.id === userId));
}

export function listAllProfiles(): Promise<ProfileRecord[]> {
  return delay([...loadDb().profiles]);
}

export function updateProfile(
  userId: string,
  patch: { fullName?: string; phone?: string; email?: string }
): Promise<ProfileRecord | undefined> {
  mutate((db) => {
    const profile = db.profiles.find((p) => p.id === userId);
    if (!profile) return;
    Object.assign(profile, patch);
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw) as SessionUser;
      session.fullName = profile.fullName;
      session.email = profile.email;
      session.phone = profile.phone;
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  });
  return delay(loadDb().profiles.find((p) => p.id === userId));
}

/* -------------------------------- bookings ------------------------------- */

export function saveFareSnapshot(snapshot: FareSnapshot): FareSnapshot {
  mutate((db) => {
    db.fareSnapshots[snapshot.id] = snapshot;
  });
  return snapshot;
}

export function getFareSnapshot(id: string): FareSnapshot | undefined {
  return loadDb().fareSnapshots[id];
}

function genRef(originIata: string, destIata: string): string {
  const digits = String(Math.floor(Math.random() * 900) + 100);
  return `DT-${originIata}${digits}${destIata}`;
}

export function createBooking(input: {
  offer: BookingRecord['flightOffer'];
  fareSnapshot: FareSnapshot;
  contactEmail: string;
  contactPhone: string;
  passengers: PassengerInput[];
  departureDate: string;
  cabin: BookingRecord['cabin'];
}): BookingRecord {
  const db = loadDb();
  const user = getSessionUserSync();
  const id = `bk-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const booking: BookingRecord = {
    id,
    bookingReference: genRef(input.offer.origin.iataCode, input.offer.destination.iataCode),
    userId: user?.id ?? null,
    flightOfferId: input.offer.id,
    flightOffer: input.offer,
    fareSnapshotId: input.fareSnapshot.id,
    fareSnapshot: input.fareSnapshot,
    originIata: input.offer.origin.iataCode,
    destinationIata: input.offer.destination.iataCode,
    departureDate: input.departureDate,
    adults: input.passengers.filter((p) => p.passengerType === 'adult').length,
    children: input.passengers.filter((p) => p.passengerType === 'child').length,
    infants: input.passengers.filter((p) => p.passengerType === 'infant').length,
    cabin: input.cabin,
    currency: 'INR',
    totalAmount: input.fareSnapshot.grandTotal,
    status: 'awaiting_payment',
    paymentStatus: 'created',
    ticketStatus: 'not_generated',
    fulfillmentMode: 'live_provider',
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    passengers: input.passengers.map((p, i) => ({
      ...p,
      id: `${id}-pax-${i + 1}`,
      bookingId: id,
      passportNumberMasked: p.passportNumber
        ? `****${p.passportNumber.slice(-4)}`
        : undefined,
    })),
    termsAcceptedAt: now,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  mutate((d) => {
    d.bookings.unshift(booking);
    d.payments.unshift({
      id: `pay-${id}`,
      bookingId: id,
      bookingReference: booking.bookingReference,
      razorpayOrderId: `order_mock${id}`,
      razorpaySignatureVerified: false,
      amountSubunits: Math.round(booking.totalAmount * 100),
      amountInr: booking.totalAmount,
      currency: 'INR',
      status: 'created',
      isLiveMode: false,
      createdAt: now,
      updatedAt: now,
    });
    d.notifications.unshift({
      id: `ntf-${id}`,
      userId: booking.userId ?? 'user-demo-1',
      bookingId: id,
      bookingReference: booking.bookingReference,
      eventType: 'booking_created',
      title: 'Booking created',
      message: `${booking.bookingReference} is on hold — complete payment to confirm your seat.`,
      actionUrl: `/checkout/${booking.flightOfferId}`,
      isRead: false,
      createdAt: now,
    });
    d.emailLogs.unshift({
      id: `eml-${id}`,
      bookingId: id,
      bookingReference: booking.bookingReference,
      recipientEmail: booking.contactEmail,
      templateName: 'booking_initiated',
      templateVersion: 'v1.2',
      subject: `Your ${booking.originIata}→${booking.destinationIata} booking ${booking.bookingReference} is on hold`,
      status: 'sent',
      retryCount: 0,
      createdAt: now,
    });
  });

  return booking;
}

export function getBookingByIdOrReference(
  idOrReference: string
): Promise<BookingRecord | null> {
  const needle = idOrReference.toLowerCase();
  const db = loadDb();
  const booking =
    db.bookings.find((b) => b.id.toLowerCase() === needle) ??
    db.bookings.find((b) => b.bookingReference.toLowerCase() === needle) ??
    null;
  return delay(booking ? { ...booking } : null);
}

export function listUserBookings(userId: string): Promise<BookingRecord[]> {
  return delay(
    loadDb()
      .bookings.filter((b) => b.userId === userId || !b.userId)
      .map((b) => ({ ...b }))
  );
}

export function listAllBookings(): Promise<BookingRecord[]> {
  return delay(loadDb().bookings.map((b) => ({ ...b })));
}

export function mockCapturePayment(
  bookingId: string,
  opts?: { fail?: boolean }
): { booking: BookingRecord; payment: PaymentRecord } | null {
  const now = new Date().toISOString();
  let result: { booking: BookingRecord; payment: PaymentRecord } | null = null;

  mutate((db) => {
    const booking = db.bookings.find((b) => b.id === bookingId);
    const pay = db.payments.find((p) => p.bookingId === bookingId);
    if (!booking || !pay) return;

    if (opts?.fail) {
      pay.status = 'failed';
      pay.failureReason = 'Simulated failure (prototype toggle)';
      booking.paymentStatus = 'failed';
      booking.status = 'failed';
      booking.updatedAt = now;
      db.notifications.unshift({
        id: `ntf-fail-${bookingId}-${Date.now()}`,
        userId: booking.userId ?? 'user-demo-1',
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        eventType: 'payment_failed',
        title: 'Payment failed',
        message: `Payment for ${booking.bookingReference} was not completed. You can retry.`,
        actionUrl: `/checkout/${booking.flightOfferId}`,
        isRead: false,
        createdAt: now,
      });
      return;
    }

    const pnr = `${randomLetters(1)}${randomDigits(1)}${randomLetters(2)}${randomDigits(1)}${randomLetters(1)}`;
    const providerRef = `PROV-${booking.flightOffer.airline.iataCode}-${randomDigits(7)}`;
    pay.status = 'captured';
    pay.razorpayPaymentId = `pay_mock${randomAlnum(12)}`;
    pay.razorpaySignatureVerified = true;
    pay.updatedAt = now;
    booking.status = 'ticketed';
    booking.paymentStatus = 'captured';
    booking.ticketStatus = 'issued';
    booking.airlinePnr = pnr;
    booking.providerBookingRef = providerRef;
    booking.updatedAt = now;
    booking.passengers = booking.passengers.map((p, i) => ({
      ...p,
      ticketNumber: p.ticketNumber ?? `098-${randomDigits(10)}${i}`,
    }));

    const ticket: TicketDocument = {
      id: `tkt-${bookingId}`,
      bookingId,
      bookingReference: booking.bookingReference,
      documentReference: `DT-ITN-${booking.bookingReference.slice(-6)}`,
      status: 'issued',
      isSampleDocument: true,
      watermarkText: 'DEMO',
      airlinePnr: pnr,
      eTicketNumbers: booking.passengers
        .map((p) => p.ticketNumber)
        .filter((t): t is string => Boolean(t)),
      verificationToken: `demo-token-${bookingId}`,
      generatedAt: now,
    };
    booking.ticket = ticket;

    const s = booking.fareSnapshot;
    const rcpt = {
      id: `rcpt-${bookingId}`,
      receiptNumber: `DT-RCPT-${booking.bookingReference.slice(-6)}-${bookingId.slice(-3).toUpperCase()}`,
      bookingId,
      bookingReference: booking.bookingReference,
      paymentId: pay.id,
      paymentReference: pay.razorpayPaymentId ?? pay.razorpayOrderId,
      paymentStatus: 'captured' as const,
      paymentDate: now,
      amountPaidInr: booking.totalAmount,
      baseFareInr: s.baseFareTotal,
      taxesInr: s.taxesTotal,
      serviceFeeInr: s.serviceFeeTotal,
      discountInr: s.discountTotal,
      currency: 'INR',
    };
    booking.receipt = rcpt;
    db.receipts = db.receipts.filter((r) => r.bookingId !== bookingId);
    db.receipts.unshift(rcpt);

    db.notifications.unshift({
      id: `ntf-${Date.now()}`,
      userId: booking.userId ?? 'user-demo-1',
      bookingId,
      bookingReference: booking.bookingReference,
      eventType: 'ticket_issued',
      title: 'E-ticket issued',
      message: `${booking.bookingReference} confirmed with airline PNR ${pnr}.`,
      actionUrl: `/booking/${booking.bookingReference}`,
      isRead: false,
      createdAt: now,
    });
    db.emailLogs.unshift(
      {
        id: `eml-${bookingId}-ok-${Date.now()}`,
        bookingId,
        bookingReference: booking.bookingReference,
        recipientEmail: booking.contactEmail,
        templateName: 'payment_successful',
        templateVersion: 'v1.2',
        subject: `Payment received for ${booking.bookingReference}`,
        status: 'delivered',
        retryCount: 0,
        createdAt: now,
      },
      {
        id: `eml-${bookingId}-itn-${Date.now()}`,
        bookingId,
        bookingReference: booking.bookingReference,
        recipientEmail: booking.contactEmail,
        templateName: 'itinerary_document',
        templateVersion: 'v1.2',
        subject: `Confirmed itinerary for ${booking.bookingReference}`,
        status: 'sent',
        retryCount: 0,
        createdAt: now,
      }
    );

    result = { booking: { ...booking }, payment: { ...pay } };
  });

  return result;
}

export function cancelBooking(
  bookingReference: string,
  reason?: string
): { ok: boolean; error?: string } {
  const now = new Date().toISOString();
  let out: { ok: boolean; error?: string } = { ok: false, error: 'Booking not found' };

  mutate((db) => {
    const booking = db.bookings.find(
      (b) =>
        b.bookingReference.toLowerCase() === bookingReference.toLowerCase() ||
        b.id === bookingReference
    );
    if (!booking) return;
    if (booking.status === 'cancelled') {
      out = { ok: false, error: 'Booking is already cancelled.' };
      return;
    }
    booking.status = 'cancelled';
    booking.paymentStatus =
      booking.paymentStatus === 'captured' ? 'refund_pending' : booking.paymentStatus;
    booking.cancellationReason = reason || 'Cancelled from prototype dashboard';
    booking.updatedAt = now;
    if (booking.ticket) booking.ticket.status = 'voided';
    db.refunds.unshift({
      id: `rfnd-${Date.now().toString(36)}`,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      amountInr: booking.totalAmount,
      reason: reason || 'Passenger requested cancellation (prototype)',
      status: 'requested',
      createdAt: now,
    });
    db.notifications.unshift({
      id: `ntf-cn-${Date.now()}`,
      userId: booking.userId ?? 'user-demo-1',
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      eventType: 'cancellation_requested',
      title: 'Cancellation received',
      message: `${booking.bookingReference} cancelled. Refund is queued for processing.`,
      actionUrl: `/booking/${booking.bookingReference}`,
      isRead: false,
      createdAt: now,
    });
    out = { ok: true };
  });

  return out;
}

export function processRefund(refundId: string): void {
  mutate((db) => {
    const refund = db.refunds.find((r) => r.id === refundId);
    if (!refund) return;
    refund.status = 'processed';
    const booking = db.bookings.find((b) => b.bookingReference === refund.bookingReference);
    if (booking) {
      booking.paymentStatus = 'refunded';
      booking.updatedAt = new Date().toISOString();
    }
  });
}

export function listAllRefunds(): Promise<MockDatabase['refunds']> {
  return delay([...loadDb().refunds]);
}

/* -------------------------------- payments ------------------------------- */

export function listAllPayments(): Promise<PaymentRecord[]> {
  return delay([...loadDb().payments]);
}

export function getPaymentForBooking(bookingId: string): PaymentRecord | undefined {
  return loadDb().payments.find((p) => p.bookingId === bookingId);
}

export function listUserTickets(userId: string): BookingRecord[] {
  return loadDb().bookings.filter(
    (b) => (b.userId === userId || !b.userId) && b.ticketStatus === 'issued'
  );
}

/* ----------------------------- notifications ----------------------------- */

export function listUserNotifications(userId: string): Promise<NotificationItem[]> {
  return delay(
    loadDb()
      .notifications.filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export function listAllNotifications(): Promise<NotificationItem[]> {
  return delay(
    loadDb()
      .notifications.slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export function markNotificationRead(notificationId: string): void {
  mutate((db) => {
    const n = db.notifications.find((x) => x.id === notificationId);
    if (n) n.isRead = true;
  });
}

export function markAllNotificationsRead(userId: string): void {
  mutate((db) => {
    db.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
  });
}

/* ---------------------------- logs & catalog ----------------------------- */

export function listAllEmailLogs(): Promise<EmailLogRecord[]> {
  return delay(
    loadDb()
      .emailLogs.slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export function listEmailLogsForBooking(bookingId: string): EmailLogRecord[] {
  return loadDb()
    .emailLogs.filter((e) => e.bookingId === bookingId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listAuditLogs(limit?: number): Promise<AuditLogRecord[]> {
  const logs = loadDb()
    .auditLogs.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return delay(typeof limit === 'number' ? logs.slice(0, limit) : logs);
}

function pushAudit(db: MockDatabase, action: string, resourceType: string, resourceId: string, afterState?: Record<string, unknown>): void {
  const user = getSessionUserSync();
  db.auditLogs.unshift({
    id: `aud-${Date.now().toString(36)}`,
    actorId: user?.id,
    actorEmail: user?.email ?? 'admin@dummyticket.demo',
    action,
    resourceType,
    resourceId,
    afterState,
    correlationId: `corr-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  });
}

export function listCatalog(entity: string): Promise<CatalogRow[]> {
  return delay([...(loadDb().catalog[entity] ?? [])]);
}

export function catalogUpsert(entity: string, record: CatalogRow): void {
  mutate((db) => {
    const rows = db.catalog[entity] ?? (db.catalog[entity] = []);
    const idx = rows.findIndex((r) => r.id === record.id);
    if (idx >= 0) rows[idx] = { ...rows[idx], ...record };
    else rows.unshift({ ...record, id: record.id ?? `row-${Date.now().toString(36)}` });
    pushAudit(db, 'CATALOG_UPSERT', entity, String(record.id ?? 'new'), record as Record<string, unknown>);
  });
}

export function catalogDelete(entity: string, id: string): void {
  mutate((db) => {
    db.catalog[entity] = (db.catalog[entity] ?? []).filter((r) => r.id !== id);
    pushAudit(db, 'CATALOG_DELETE', entity, id);
  });
}

export function assignRole(userId: string, role: AppRole): void {
  mutate((db) => {
    const profile = db.profiles.find((p) => p.id === userId);
    if (!profile) return;
    if (!profile.roles.includes(role)) profile.roles.push(role);
    profile.role = role === 'admin' ? 'admin' : profile.role;
    pushAudit(db, 'ASSIGN_ROLE', 'user', userId, { role });
  });
}

export function removeRole(userId: string, role: AppRole): void {
  mutate((db) => {
    const profile = db.profiles.find((p) => p.id === userId);
    if (!profile) return;
    profile.roles = profile.roles.filter((r) => r !== role);
    if (profile.role === role) profile.role = 'customer';
    pushAudit(db, 'REMOVE_ROLE', 'user', userId, { role });
  });
}

export function setSuspended(userId: string, isSuspended: boolean): void {
  mutate((db) => {
    const profile = db.profiles.find((p) => p.id === userId);
    if (!profile) return;
    profile.isSuspended = isSuspended;
    pushAudit(db, isSuspended ? 'SUSPEND_USER' : 'REINSTATE_USER', 'user', userId, {
      isSuspended,
    });
  });
}

export function logPublicEvent(
  action: string,
  resourceType: string,
  afterState: Record<string, unknown>
): void {
  mutate((db) => {
    pushAudit(db, action, resourceType, String(afterState.email ?? afterState.bookingReference ?? 'demo'), afterState);
  });
}

/* -------------------------------- helpers -------------------------------- */

function randomLetters(n: number): string {
  return Array.from({ length: n }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
}

function randomDigits(n: number): string {
  return Array.from({ length: n }, () => String(Math.floor(Math.random() * 10))).join('');
}

function randomAlnum(n: number): string {
  return Array.from({ length: n }, () =>
    Math.random() > 0.5 ? randomDigits(1) : randomLetters(1).toLowerCase()
  ).join('');
}
