import type {
  AppRole,
  AuditLogRecord,
  BookingRecord,
  EmailLogRecord,
  FareSnapshot,
  NotificationItem,
  PaymentRecord,
  PaymentReceipt,
} from '@/types';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: AppRole;
  roles: AppRole[];
  emailConfirmed: boolean;
}

export interface ProfileRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: AppRole;
  roles: AppRole[];
  isSuspended: boolean;
  createdAt: string;
}

// snake_case rows consumed by the admin CrudManager
export type CatalogRow = Record<string, string | number | boolean | null | object>;

export interface RefundRecord {
  id: string;
  bookingId: string;
  bookingReference: string;
  amountInr: number;
  reason: string;
  status: 'requested' | 'processing' | 'processed' | 'rejected';
  createdAt: string;
}

export interface MockDatabase {
  bookings: BookingRecord[];
  payments: PaymentRecord[];
  receipts: PaymentReceipt[];
  notifications: NotificationItem[];
  emailLogs: EmailLogRecord[];
  auditLogs: AuditLogRecord[];
  profiles: ProfileRecord[];
  refunds: RefundRecord[];
  catalog: Record<string, CatalogRow[]>;
  fareSnapshots: Record<string, FareSnapshot>;
}
