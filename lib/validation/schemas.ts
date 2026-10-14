import { z } from 'zod';

export const cabinClassSchema = z.enum([
  'economy',
  'premium_economy',
  'business',
  'first',
]);

export const tripTypeSchema = z.enum(['one_way', 'round_trip', 'multi_city']);

export const flightSearchSchema = z
  .object({
    from: z
      .string()
      .trim()
      .toUpperCase()
      .length(3, 'Origin must be a valid 3-letter IATA airport code'),
    to: z
      .string()
      .trim()
      .toUpperCase()
      .length(3, 'Destination must be a valid 3-letter IATA airport code'),
    depart: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Departure date must be in YYYY-MM-DD format'),
    returnDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Return date must be in YYYY-MM-DD format')
      .optional()
      .or(z.literal('')),
    adults: z.coerce
      .number()
      .int()
      .min(1, 'At least 1 adult passenger is required')
      .max(9, 'Maximum 9 adults allowed per booking'),
    children: z.coerce.number().int().min(0).max(8).default(0),
    infants: z.coerce.number().int().min(0).max(4).default(0),
    cabin: cabinClassSchema.default('economy'),
    tripType: tripTypeSchema.default('one_way'),
    sort: z
      .enum([
        'recommended',
        'price_asc',
        'departure_asc',
        'duration_asc',
        'arrival_asc',
      ])
      .default('recommended'),
  })
  .superRefine((data, ctx) => {
    if (data.from === data.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['to'],
        message: 'Origin and destination airports cannot be identical.',
      });
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (data.depart < todayStr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['depart'],
        message: 'Departure date cannot be in the past.',
      });
    }

    if (
      data.tripType === 'round_trip' &&
      (!data.returnDate || data.returnDate.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['returnDate'],
        message: 'Return date is required for round-trip searches.',
      });
    }

    if (data.returnDate && data.returnDate < data.depart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['returnDate'],
        message: 'Return date must be on or after the departure date.',
      });
    }

    if (data.infants > data.adults) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['infants'],
        message: 'Number of infants cannot exceed the number of adult passengers.',
      });
    }

    if (data.adults + data.children + data.infants > 9) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['adults'],
        message: 'Total passengers cannot exceed 9 per online booking.',
      });
    }
  });

export const passengerSchema = z.object({
  passengerType: z.enum(['adult', 'child', 'infant']),
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[A-Za-z\s'-]+$/, 'Name must contain only letters, spaces, or hyphens'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[A-Za-z\s'-]+$/, 'Name must contain only letters, spaces, or hyphens'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  passportNumber: z.string().trim().optional(),
  passportExpiry: z.string().optional(),
  nationality: z.string().trim().max(2).optional(),
});

export const createBookingRequestSchema = z
  .object({
    flightOfferId: z.string().min(3),
    fareSnapshotId: z.string().min(3),
    departDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    returnDate: z.string().optional(),
    contactEmail: z.string().email('Enter a valid email address for itinerary delivery'),
    contactPhone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{8,15}$/, 'Enter a valid phone number with country code'),
    passengers: z.array(passengerSchema).min(1, 'At least 1 passenger is required'),
    couponCode: z.string().trim().optional(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({
        message: 'You must accept the booking terms, fare rules, and privacy notice.',
      }),
    }),
    fareDisclosureAccepted: z.boolean().optional(),
    acceptedUpdatedFareInr: z.number().int().positive().optional(),
    idempotencyKey: z.string().min(6),
    isInternational: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.isInternational) {
      data.passengers.forEach((p, index) => {
        if (!p.passportNumber || p.passportNumber.trim().length < 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['passengers', index, 'passportNumber'],
            message: 'Passport number is required for international itineraries.',
          });
        }
        if (!p.passportExpiry) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['passengers', index, 'passportExpiry'],
            message: 'Passport expiry date is required for international itineraries.',
          });
        } else if (p.passportExpiry <= data.departDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['passengers', index, 'passportExpiry'],
            message: 'Passport must be valid beyond the travel departure date.',
          });
        }
      });
    }
  });

export const razorpayVerifySchema = z.object({
  bookingId: z.string().min(3),
  razorpay_order_id: z.string().min(5),
  razorpay_payment_id: z.string().min(5),
  razorpay_signature: z.string().min(10),
});
