
export type BookingStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'paid_pending_confirmation'
  | 'confirmed'
  | 'ticketed'
  | 'cancel_requested'
  | 'cancelled'
  | 'expired'
  | 'failed';

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refund_pending'
  | 'partially_refunded'
  | 'refunded';

export type TicketDocumentStatus =
  | 'not_generated'
  | 'issued'
  | 'voided';

export type FulfillmentMode = 'live_provider';

export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export type TripType = 'one_way' | 'round_trip' | 'multi_city';

export type AppRole =
  | 'customer'
  | 'support_agent'
  | 'finance_manager'
  | 'content_editor'
  | 'admin';

export type EmailDeliveryStatus =
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'bounced'
  | 'failed';

export interface Airport {
  id: string;
  iataCode: string;
  icaoCode?: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
  isInternational?: boolean;
}

export interface Airline {
  id: string;
  iataCode: string;
  icaoCode: string;
  name: string;
  country: string;
  logoText: string;
  brandColor: string;
  accentColor?: string;
  isActive: boolean;
  supportedRouteTypes: Array<'domestic_india' | 'regional_rcs' | 'international'>;
  dataSource: string;
  isVerified: boolean;
  category?: 'indian' | 'international';
}

export interface FareRule {
  id: string;
  code: string;
  name: string;
  cabin: CabinClass;
  isRefundable: boolean;
  cancellationFeeInr: number;
  changeFeeInr: number;
  cabinBaggageKg: number;
  checkedBaggageKg: number;
  seatSelectionIncluded: boolean;
  mealIncluded: boolean;
  termsSummary: string;
}

export interface FlightSegment {
  id: string;
  segmentOrder: number;
  airlineIata: string;
  airlineName: string;
  flightNumber: string;
  originIata: string;
  originCity: string;
  destinationIata: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  aircraftType: string;
  layoverMinutesBefore: number;
}

export interface FlightOffer {
  id: string;
  flightNumber: string;
  airline: Airline;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stopsCount: number;
  layoverSummary?: string;
  cabin: CabinClass;
  baseFareInr: number;
  taxesInr: number;
  serviceFeeInr: number;
  totalFareInr: number;
  seatsAvailable: number;
  fareRule: FareRule;
  segments: FlightSegment[];
  inventoryMode: FulfillmentMode;
  providerOfferRef?: string;
  historicalAvgInr?: number;
}

export interface PricingRuleAdjustment {
  ruleCode: string;
  description: string;
  amountInr: number;
}

export interface FareSnapshot {
  id: string;
  flightOfferId: string;
  adults: number;
  children: number;
  infants: number;
  cabin: CabinClass;
  currency: string;
  baseFareTotal: number;
  taxesTotal: number;
  serviceFeeTotal: number;
  discountTotal: number;
  grandTotal: number;
  couponCode?: string;
  pricingRulesApplied: PricingRuleAdjustment[];
  inventoryMode: FulfillmentMode;
  expiresAt: string;
  createdAt: string;
}

export interface PassengerInput {
  passengerType: 'adult' | 'child' | 'infant';
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  passportNumber?: string;
  passportExpiry?: string;
  nationality?: string;
}

export interface BookingPassenger extends PassengerInput {
  id: string;
  bookingId: string;
  passportNumberMasked?: string;
  ticketNumber?: string;
}

export interface BookingRecord {
  id: string;
  bookingReference: string;
  userId?: string | null;
  flightOfferId: string;
  flightOffer: FlightOffer;
  fareSnapshotId: string;
  fareSnapshot: FareSnapshot;
  originIata: string;
  destinationIata: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabin: CabinClass;
  currency: string;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  ticketStatus: TicketDocumentStatus;
  fulfillmentMode: FulfillmentMode;
  providerBookingRef?: string;
  airlinePnr?: string;
  contactEmail: string;
  contactPhone: string;
  passengers: BookingPassenger[];
  termsAcceptedAt: string;
  fareChangeAcceptedAt?: string;
  cancellationReason?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  ticket?: TicketDocument;
  receipt?: PaymentReceipt;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  bookingReference: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignatureVerified: boolean;
  amountSubunits: number;
  amountInr: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  failureReason?: string;
  isLiveMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  bookingId: string;
  bookingReference: string;
  paymentId: string;
  paymentReference: string;
  paymentStatus: PaymentStatus;
  paymentDate: string;
  amountPaidInr: number;
  baseFareInr: number;
  taxesInr: number;
  serviceFeeInr: number;
  discountInr: number;
  currency: string;
}

export interface TicketDocument {
  id: string;
  bookingId: string;
  bookingReference: string;
  documentReference: string;
  status: TicketDocumentStatus;
  isSampleDocument: boolean;
  watermarkText: string;
  airlinePnr?: string;
  eTicketNumbers?: string[];
  verificationToken: string;
  generatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  bookingId?: string;
  bookingReference?: string;
  eventType:
  | 'booking_created'
  | 'payment_confirmed'
  | 'payment_failed'
  | 'fare_changed'
  | 'ticket_issued'
  | 'cancellation_requested'
  | 'refund_updated'
  | 'security_event'
  | 'admin_announcement';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface EmailLogRecord {
  id: string;
  bookingId?: string;
  bookingReference?: string;
  recipientEmail: string;
  templateName: string;
  templateVersion: string;
  subject: string;
  providerMessageId?: string;
  status: EmailDeliveryStatus;
  retryCount: number;
  errorMessage?: string;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  actorId?: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  correlationId: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  category: string;
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  faqs: Array<{ question: string; answer: string }>;
}

export interface DestinationGuide {
  id: string;
  slug: string;
  city: string;
  country: string;
  airportIata: string;
  headline: string;
  overview: string;
  bestTimeToVisit: string;
  visaRequirementsSummary: string;
  startingFareInr: number;
  metaTitle: string;
  metaDescription: string;
  highlights: string[];
}

export interface RouteLandingPage {
  id: string;
  slug: string;
  originIata: string;
  destinationIata: string;
  originCity: string;
  destinationCity: string;
  averageDurationMinutes: number;
  airlinesOperating: string[];
  startingFareInr: number;
  routeGuideMarkdown: string;
  metaTitle: string;
  metaDescription: string;
  dailyFlightsCount: number;
}
