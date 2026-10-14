import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { BookingRecord } from '@/types';
import { formatDuration, formatInr, getBrandConfig } from '@/lib/config/brand';

/**
 * Generates the Signature DummyTicket Boarding-Pass-Styled Itinerary PDF:
 * Royal Blue Header (#0062E0 / #004EC2), Crisp White & Ice-Blue Ticket Body,
 * Detachable Perforated Stub, QR verification code, and confirmed-status labels.
 */
export async function generateItineraryPdfBytes(
  booking: BookingRecord
): Promise<Uint8Array> {
  const brand = getBrandConfig();
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const displayRef = booking.bookingReference;
  const verifyUrl = `${brand.appUrl}/ticket/${booking.bookingReference}?verify=${booking.ticket?.verificationToken ?? `vfy-${booking.bookingReference.toLowerCase()}`}`;

  // 1. Verified Reservation Banner
  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.setDrawColor(5, 150, 105); // Emerald 600 border
  doc.rect(12, 10, 186, 13, 'FD');
  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(
    `CONFIRMED ITINERARY${booking.airlinePnr ? ` — PNR ${booking.airlinePnr}` : ''}`,
    105,
    18,
    { align: 'center' }
  );

  // 2. Signature Boarding Pass Card on A4 (y = 28 to 118)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(219, 234, 254); // Blue 100
  doc.roundedRect(12, 28, 186, 90, 4, 4, 'FD');

  // Royal Blue Boarding Pass Top Bar (#0062E0)
  doc.setFillColor(0, 98, 224);
  doc.roundedRect(12, 28, 186, 16, 4, 4, 'F');

  // Ice-Blue Accent Stripes on Header
  doc.setFillColor(96, 165, 250); // Sky / Light Blue accent
  doc.rect(148, 28, 8, 16, 'F');
  doc.rect(162, 28, 8, 16, 'F');
  doc.rect(176, 28, 8, 16, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('DummyTicket', 18, 38);
  doc.setFontSize(9);
  doc.text('CONFIRMED ITINERARY', 62, 38);

  // Perforated Detachable Stub Divider (x = 144)
  doc.setDrawColor(147, 197, 253);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(144, 44, 144, 118);
  doc.setLineDashPattern([], 0);

  // Main Boarding Pass Left Section
  doc.setTextColor(11, 17, 32);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Carrier: ${booking.flightOffer.airline.name} (${booking.flightOffer.airline.iataCode}/${booking.flightOffer.airline.icaoCode})`,
    18,
    53
  );
  doc.setFont('helvetica', 'bold');
  doc.text(`Flight: ${booking.flightOffer.flightNumber}`, 95, 53);

  // Large Origin -> Destination
  doc.setFontSize(22);
  doc.setTextColor(11, 17, 32);
  doc.text(booking.originIata, 18, 70);
  doc.setFontSize(11);
  doc.setTextColor(0, 98, 224); // Royal Blue trajectory
  doc.text(
    `--->  ${formatDuration(booking.flightOffer.durationMinutes)}  --->`,
    48,
    68
  );
  doc.setFontSize(22);
  doc.setTextColor(11, 17, 32);
  doc.text(booking.destinationIata, 102, 70);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(booking.flightOffer.origin.city, 18, 76);
  doc.text(booking.flightOffer.destination.city, 102, 76);

  // Passenger & Date Zone inside Boarding Pass
  const pax0 = booking.passengers[0];
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 17, 32);
  doc.text(
    `PASSENGER: ${pax0 ? `${pax0.lastName.toUpperCase()} / ${pax0.firstName.toUpperCase()}` : 'TRAVELER'}`,
    18,
    90
  );
  doc.text(`DATE: ${booking.departureDate}`, 18, 98);
  doc.text(`CABIN: ${booking.cabin.toUpperCase()}`, 68, 98);
  doc.text(`PNR: ${booking.airlinePnr ?? 'ON REQUEST'}`, 18, 106);
  doc.text(
    `BAGGAGE: ${booking.flightOffer.fareRule.cabinBaggageKg}kg + ${booking.flightOffer.fareRule.checkedBaggageKg}kg`,
    68,
    106
  );

  // Detachable Stub Right Section (x = 148 to 194)
  doc.setFontSize(8);
  doc.setTextColor(0, 98, 224);
  doc.text('DETACHABLE STUB', 148, 52);
  doc.setTextColor(11, 17, 32);
  doc.setFontSize(9);
  doc.text(`Ref: ${displayRef}`, 148, 59);
  doc.text(`${booking.originIata} -> ${booking.destinationIata}`, 148, 66);

  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 110,
    });
    doc.addImage(qrDataUrl, 'PNG', 154, 70, 32, 32);
    doc.setFontSize(7);
    doc.text('SCAN TO VERIFY', 170, 107, { align: 'center' });
  } catch {
    doc.setFontSize(7);
    doc.text(displayRef, 148, 85);
  }

  // 3. Detailed Passenger Manifest & Fare Summary Below Boarding Pass
  let y = 132;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 17, 32);
  doc.text('COMPLETE PASSENGER MANIFEST & FARE SUMMARY', 14, y);
  y += 7;

  booking.passengers.forEach((pax, index) => {
    const docTag = pax.ticketNumber ?? 'E-Ticket Pending Issuance';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(
      `${index + 1}. ${pax.firstName} ${pax.lastName} (${pax.passengerType.toUpperCase()}) — ${docTag}`,
      14,
      y
    );
    y += 6;
  });

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Total Audited Fare: ${formatInr(booking.totalAmount)} (Base: ${formatInr(
      booking.fareSnapshot.baseFareTotal
    )}, Taxes: ${formatInr(
      booking.fareSnapshot.taxesTotal
    )}, Service Fee: ${formatInr(booking.fareSnapshot.serviceFeeTotal)})`,
    14,
    y
  );

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 255, 196, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(4, 120, 87);
  doc.text('CONFIRMED RESERVATION DOCUMENT — VERIFIABLE ONLINE', 14, 262);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Support: ${brand.supportEmail} | ${brand.supportPhone} | Generated by ${brand.name}`,
    14,
    268
  );

  return new Uint8Array(doc.output('arraybuffer'));
}

/**
 * Generates a separate official DummyTicket Payment Receipt PDF.
 * Clearly distinguishes a payment receipt from an airline ticket.
 */
export async function generatePaymentReceiptPdfBytes(
  booking: BookingRecord
): Promise<Uint8Array> {
  const brand = getBrandConfig();
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const receiptNumber = `DT-RCPT-${booking.bookingReference.replace(/^DT-/, '')}`;

  doc.setFillColor(11, 17, 32);
  doc.rect(12, 12, 186, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`${brand.name} — OFFICIAL PAYMENT RECEIPT`, 18, 25);

  doc.setTextColor(11, 17, 32);
  doc.setFontSize(10);
  doc.text(`Receipt Number: ${receiptNumber}`, 14, 44);
  doc.text(`Booking Reference: ${booking.bookingReference}`, 14, 51);
  doc.text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`, 14, 58);
  doc.text(
    `Date Issued: ${new Date(booking.updatedAt).toUTCString()}`,
    14,
    65
  );

  doc.setDrawColor(203, 213, 225);
  doc.line(14, 72, 196, 72);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ITEMIZED CHARGES & TAXES', 14, 82);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `Base Amount (${booking.passengers.length} Passenger[s]): ${formatInr(
      booking.fareSnapshot.baseFareTotal
    )}`,
    14,
    92
  );
  doc.text(
    `Statutory Taxes & Fees: ${formatInr(booking.fareSnapshot.taxesTotal)}`,
    14,
    100
  );
  doc.text(
    `Disclosed Platform Service Fee: ${formatInr(
      booking.fareSnapshot.serviceFeeTotal
    )}`,
    14,
    108
  );
  if (booking.fareSnapshot.discountTotal > 0) {
    doc.text(
      `Promotional Discount: -${formatInr(booking.fareSnapshot.discountTotal)}`,
      14,
      116
    );
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total Paid: ${formatInr(booking.totalAmount)}`, 14, 128);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'IMPORTANT DISTINCTION: This document is a financial payment receipt and is NOT an airline ticket or boarding pass.',
    14,
    146
  );

  return new Uint8Array(doc.output('arraybuffer'));
}
