import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) — Flights, Fares & Tickets',
  description:
    'Read answers about flight search, itinerary documents, Razorpay payment verification, fare changes, and refunds.',
};

export default function FaqPage() {
  const faqs = [
    {
      question: 'Will I receive a document I can use at the airport?',
      answer:
        'Your confirmed itinerary carries the airline confirmation (PNR) for your reservation and is delivered as a downloadable PDF with a QR verification link. Boarding passes themselves are issued by the airline when you check in — present your PNR at check-in to receive one.',
    },
    {
      question: 'What happens if the fare changes while I am filling out passenger details?',
      answer:
        'Our server revalidates your Fare Snapshot before creating a Razorpay order. If the fare increases, we display the exact message: "Your selected fare has changed from ₹X to ₹Y. Review the updated total before continuing." We never silently charge a different amount.',
    },
    {
      question: 'How does Razorpay payment verification work?',
      answer:
        'Orders are created on the server using integer currency subunits (paise). When payment completes, both the Checkout response and incoming Razorpay webhooks are verified using HMAC-SHA256 signatures before updating the booking state.',
    },
    {
      question: 'How are passport numbers protected?',
      answer:
        'Passport details are requested only on international routes, validated for expiration after the travel date, masked in database records (e.g., ****8921), and never sent in plain text in transactional emails.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-extrabold text-navy-900">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
          >
            <h2 className="text-base font-bold text-navy-900">{f.question}</h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {f.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
