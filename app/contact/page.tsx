'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { logPublicEvent } from '@/lib/mock/store';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      logPublicEvent('SUPPORT_REQUEST', 'public_form', {
        type: 'contact',
        name,
        email,
        bookingReference,
        subject,
        message,
      });
      setStatus('success');
      setFeedback(
        'Support request recorded in the prototype audit log. This is a demo — no message was sent.'
      );
      setSubject('');
      setMessage('');
    } catch {
      setStatus('error');
      setFeedback('Could not record the request in local demo storage.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-4">
          <span className="eyebrow">
            24/7 Traveler Support Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Contact Customer & Billing Support
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Need help with a booking reference, prototype refund status, or itinerary download? Reach our support desk directly.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-700">
            <p className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-brand-600" />
              <span>support@aerovista.example.com</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-brand-600" />
              <span>+91 (040) 6789-1020</span>
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-brand-600" />
              <span>HITEC City, Madhapur, Hyderabad, Telangana 500081, India</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
          <h2 className="text-base font-bold text-navy-900 mb-4">
            Submit a Support Ticket
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-navy-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-navy-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Booking Reference (Optional)
                </label>
                <input
                  type="text"
                  value={bookingReference}
                  onChange={(e) => setBookingReference(e.target.value)}
                  placeholder="DT-HYD842MSY"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 font-mono uppercase text-navy-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Itinerary or payment inquiry"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-navy-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-navy-900"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-xl bg-brand-600 px-6 py-3 text-xs font-bold text-white hover:bg-brand-700"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Support Request'}
            </button>

            {status === 'success' && (
              <p className="flex items-center gap-1.5 font-semibold text-verified-700">
                <CheckCircle2 className="h-4 w-4" />
                {feedback}
              </p>
            )}
            {status === 'error' && (
              <p className="flex items-center gap-1.5 font-semibold text-red-600">
                <AlertCircle className="h-4 w-4" />
                {feedback}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
