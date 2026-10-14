import type {
  CabinClass,
  FareSnapshot,
  FlightOffer,
  PricingRuleAdjustment,
} from '@/types';
import { formatInr } from '@/lib/config/brand';

export interface CouponConfig {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmountInr: number;
  maxDiscountInr: number;
  isActive: boolean;
}

export const CONFIGURED_COUPONS: Record<string, CouponConfig> = {
  WELCOME10: {
    code: 'WELCOME10',
    description: '10% off up to ₹1,500 on eligible bookings',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmountInr: 3000,
    maxDiscountInr: 1500,
    isActive: true,
  },
  FLAT500: {
    code: 'FLAT500',
    description: 'Flat ₹500 instant discount on orders above ₹4,000',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmountInr: 4000,
    maxDiscountInr: 500,
    isActive: true,
  },
};

// Admin-configurable route/offer fare overrides (deterministic, auditable)
const adminOfferAdjustments = new Map<string, number>();

export function setAdminOfferAdjustment(flightOfferId: string, deltaInr: number): void {
  if (deltaInr === 0) {
    adminOfferAdjustments.delete(flightOfferId);
  } else {
    adminOfferAdjustments.set(flightOfferId, Math.round(deltaInr));
  }
}

export function getAdminOfferAdjustment(flightOfferId: string): number {
  return adminOfferAdjustments.get(flightOfferId) ?? 0;
}

export function calculateCompleteFare(params: {
  offer: FlightOffer;
  adults: number;
  children?: number;
  infants?: number;
  cabin?: CabinClass;
  couponCode?: string;
  snapshotId?: string;
  ttlMinutes?: number;
}): FareSnapshot {
  const adults = Math.max(1, params.adults);
  const children = Math.max(0, params.children ?? 0);
  const infants = Math.max(0, params.infants ?? 0);
  const cabin = params.cabin ?? params.offer.cabin;

  const adminDelta = getAdminOfferAdjustment(params.offer.id);
  const unitBase = Math.max(500, params.offer.baseFareInr + adminDelta);
  const unitTax = Math.round(unitBase * 0.18);
  const unitServiceFee = params.offer.serviceFeeInr;

  const adultBase = unitBase * adults;
  const childBase = Math.round(unitBase * 0.75) * children;
  const infantBase = Math.round(unitBase * 0.15) * infants;

  const baseFareTotal = adultBase + childBase + infantBase;
  const taxesTotal =
    unitTax * adults +
    Math.round(unitTax * 0.75) * children +
    Math.round(unitTax * 0.1) * infants;
  const serviceFeeTotal = unitServiceFee * (adults + children);

  const rulesApplied: PricingRuleAdjustment[] = [
    {
      ruleCode: 'BASE_PASSENGER_CALC',
      description: `${adults} Adult(s)${children ? `, ${children} Child(ren)` : ''}${
        infants ? `, ${infants} Infant(s)` : ''
      } (${cabin.replace('_', ' ')})`,
      amountInr: baseFareTotal,
    },
    {
      ruleCode: 'STATUTORY_TAXES_FEES',
      description: 'Airport PSF, UDF & statutory GST',
      amountInr: taxesTotal,
    },
  ];

  if (serviceFeeTotal > 0) {
    rulesApplied.push({
      ruleCode: 'PLATFORM_SERVICE_FEE',
      description: 'Disclosed platform itinerary & processing fee',
      amountInr: serviceFeeTotal,
    });
  }

  if (adminDelta !== 0) {
    rulesApplied.push({
      ruleCode: 'CONFIGURED_FARE_RULE_ADJ',
      description: 'Admin-configured inventory tier adjustment',
      amountInr: adminDelta * adults,
    });
  }

  const subtotal = baseFareTotal + taxesTotal + serviceFeeTotal;
  let discountTotal = 0;
  let appliedCouponCode: string | undefined;

  if (params.couponCode) {
    const cleanCode = params.couponCode.trim().toUpperCase();
    const coupon = CONFIGURED_COUPONS[cleanCode];
    if (coupon && coupon.isActive && subtotal >= coupon.minOrderAmountInr) {
      if (coupon.discountType === 'percentage') {
        discountTotal = Math.min(
          coupon.maxDiscountInr,
          Math.round((subtotal * coupon.discountValue) / 100)
        );
      } else {
        discountTotal = Math.min(coupon.maxDiscountInr, coupon.discountValue);
      }
      appliedCouponCode = cleanCode;
      rulesApplied.push({
        ruleCode: `COUPON_${cleanCode}`,
        description: coupon.description,
        amountInr: -discountTotal,
      });
    }
  }

  const grandTotal = Math.max(100, subtotal - discountTotal);
  const ttlMs = (params.ttlMinutes ?? 15) * 60 * 1000;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs).toISOString();

  return {
    id:
      params.snapshotId ??
      `snap-${params.offer.id}-${now.getTime().toString(36)}`,
    flightOfferId: params.offer.id,
    adults,
    children,
    infants,
    cabin,
    currency: 'INR',
    baseFareTotal,
    taxesTotal,
    serviceFeeTotal,
    discountTotal,
    grandTotal,
    couponCode: appliedCouponCode,
    pricingRulesApplied: rulesApplied,
    inventoryMode: params.offer.inventoryMode,
    expiresAt,
    createdAt: now.toISOString(),
  };
}

export function isFareSnapshotExpired(
  snapshot: FareSnapshot,
  referenceNow: Date = new Date()
): boolean {
  return new Date(snapshot.expiresAt).getTime() <= referenceNow.getTime();
}

export interface FareRevalidationResult {
  isExpired: boolean;
  hasChanged: boolean;
  requiresUserAcceptance: boolean;
  oldAmountInr: number;
  newAmountInr: number;
  updatedSnapshot: FareSnapshot;
  userMessage?: string;
}

export function revalidateFareSnapshot(params: {
  originalSnapshot: FareSnapshot;
  currentOffer: FlightOffer;
  couponCode?: string;
  acceptedUpdatedFareInr?: number;
  now?: Date;
}): FareRevalidationResult {
  const now = params.now ?? new Date();
  const expired = isFareSnapshotExpired(params.originalSnapshot, now);

  const recomputed = calculateCompleteFare({
    offer: params.currentOffer,
    adults: params.originalSnapshot.adults,
    children: params.originalSnapshot.children,
    infants: params.originalSnapshot.infants,
    cabin: params.originalSnapshot.cabin,
    couponCode: params.couponCode ?? params.originalSnapshot.couponCode,
  });

  const oldAmountInr = params.originalSnapshot.grandTotal;
  const newAmountInr = recomputed.grandTotal;
  const hasChanged = oldAmountInr !== newAmountInr;
  const isMaterialIncrease = newAmountInr > oldAmountInr;

  const alreadyAccepted =
    params.acceptedUpdatedFareInr !== undefined &&
    params.acceptedUpdatedFareInr === newAmountInr;

  const requiresUserAcceptance = isMaterialIncrease && !alreadyAccepted;

  const userMessage = hasChanged
    ? `Your selected fare has changed from ${formatInr(oldAmountInr)} to ${formatInr(
        newAmountInr
      )}. Review the updated total before continuing.`
    : undefined;

  return {
    isExpired: expired,
    hasChanged,
    requiresUserAcceptance,
    oldAmountInr,
    newAmountInr,
    updatedSnapshot: recomputed,
    userMessage,
  };
}
