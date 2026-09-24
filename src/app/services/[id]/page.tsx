'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import confetti from 'canvas-confetti';
import {
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar as CalendarIcon,
  ChevronLeft,
  AlertCircle,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';

interface ServiceDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationMinutes: number;
  status: string;
  imageUrl?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const AVAILABLE_TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Form State
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState<string>(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${id}`);
        if (!res.ok) {
          throw new Error('Service not found');
        }
        const data = await res.json();
        setService(data.service);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load service');
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadService();
    }
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!user) {
      router.push(`/login?redirect=/services/${id}`);
      return;
    }

    if (!bookingDate) {
      setBookingError('Please select a date for your appointment.');
      return;
    }

    if (!timeSlot) {
      setBookingError('Please choose a time slot.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service?.id,
          bookingDate,
          timeSlot,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setBookingSuccess(true);
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setBookingError(err.message);
      } else {
        setBookingError('Failed to complete booking.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 max-w-md mx-auto mb-6 shadow-xs">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <h2 className="text-lg font-bold">Service Not Found</h2>
          <p className="text-xs mt-1 text-rose-600 dark:text-rose-300">The service you requested does not exist or has been removed.</p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-semibold transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors font-medium">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors font-medium">Services</Link>
          <span>/</span>
          {service.category && (
            <>
              <Link href={`/services?category=${service.category.slug}`} className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors font-medium">
                {service.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[200px]">{service.name}</span>
        </div>

        {/* Two-Column Grid: Details on Left, Booking Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Service Information */}
          <div className="lg:col-span-7 space-y-8">
            {/* Header & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {service.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/80">
                    {service.category.name}
                  </span>
                )}
                <StatusBadge status={service.status} />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>4.9 (148 verified reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {service.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>Estimated Duration: {service.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  <span>100% Certified Pro</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  service.imageUrl ||
                  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80'
                }
                alt={service.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            </div>

            {/* Service Description */}
            <div className="space-y-4 p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                Service Overview
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* What's Included */}
            <div className="space-y-4 p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Service Standards & Guarantees
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Certified and background-checked technician</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Commercial-grade tools & eco-safe materials</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Complete cleanup and debris disposal</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>30-day workmanship guarantee</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 dark:shadow-black/40 space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Transparent Rate
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(service.price)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ flat fee</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-xs font-bold">
                    Available Now
                  </span>
                </div>
              </div>

              {bookingError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              {bookingSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Booking confirmed! Redirecting to your dashboard...</span>
                </div>
              )}

              {service.status !== 'ACTIVE' ? (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs text-center font-medium">
                  This service is currently unavailable for bookings.
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  {/* Select Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      1. Select Appointment Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={todayStr}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 transition cursor-pointer font-medium"
                        id="booking-date-input"
                      />
                    </div>
                  </div>

                  {/* Select Time Slot */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      2. Choose Preferred Arrival Window
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_TIME_SLOTS.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setTimeSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center ${
                            timeSlot === slot
                              ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-sm shadow-teal-700/20 border border-teal-700 dark:border-teal-600 font-bold'
                              : 'bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/60'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      3. Special Instructions or Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Gate code, apartment number, specific focus area..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 transition"
                      id="booking-notes-input"
                    />
                  </div>

                  {/* Price Calculation Summary */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Service Flat Fee</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(service.price)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Service Guarantee & Insurance</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Included ($0.00)</span>
                    </div>
                    <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                      <span>Total Amount Due</span>
                      <span className="text-teal-700 dark:text-teal-400 font-extrabold">{formatCurrency(service.price)}</span>
                    </div>
                  </div>

                  {/* Submit / Auth CTA */}
                  {user ? (
                    <button
                      type="submit"
                      disabled={submitting || bookingSuccess}
                      className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      id="confirm-booking-btn"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      <span>{submitting ? 'Confirming Appointment...' : 'Schedule & Confirm Booking'}</span>
                    </button>
                  ) : (
                    <div className="space-y-2.5">
                      <Link
                        href={`/login?redirect=/services/${service.id}`}
                        className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 text-center"
                      >
                        <Lock className="h-4 w-4" />
                        <span>Sign In to Complete Booking</span>
                      </Link>
                      <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 font-medium">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-teal-700 dark:text-teal-400 font-semibold hover:underline">
                          Create one in 30 seconds
                        </Link>
                      </p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
