'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  User,
} from 'lucide-react';

interface BookingItem {
  id: string;
  bookingDate: string;
  timeSlot: string;
  totalPrice: number;
  status: string;
  notes?: string | null;
  service: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    category?: {
      name: string;
    };
  };
}

export default function UserDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    async function loadUserBookings() {
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard bookings:', err);
      } finally {
        setLoadingBookings(false);
      }
    }

    if (user) {
      loadUserBookings();
    }
  }, [user, isLoading, router]);

  if (isLoading || loadingBookings) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  // Upcoming active booking
  const upcomingBooking = bookings.find(
    (b) => b.status === 'CONFIRMED' || b.status === 'PENDING'
  );

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 shadow-xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {user.role} Dashboard
              </span>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition"
                >
                  Admin Console &rarr;
                </Link>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Welcome back, <span className="gradient-text">{user.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage your scheduled service appointments and profile details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Book New Service</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </div>
        </div>

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Awaiting Approval</p>
              <p className="text-3xl font-black text-amber-400 mt-1">{pendingCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Pending admin confirmation</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Confirmed & Scheduled</p>
              <p className="text-3xl font-black text-blue-400 mt-1">{confirmedCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Upcoming technician arrivals</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Completed Services</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{completedCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Fulfilled successfully</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Next Upcoming Appointment Highlight */}
        {upcomingBooking ? (
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Next Upcoming Appointment
                  </span>
                  <StatusBadge status={upcomingBooking.status} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {upcomingBooking.service.name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold">{formatDate(upcomingBooking.bookingDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-sky-400" />
                    <span>Slot: {upcomingBooking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Rate:</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(upcomingBooking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/bookings"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition"
                >
                  Manage Booking
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-white">No Upcoming Appointments</h3>
              <p className="text-xs text-slate-400">
                You have no pending or confirmed bookings right now. Ready to book your next home or commercial service?
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-md"
            >
              Browse Services
            </Link>
          </div>
        )}

        {/* Recent Bookings Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Booking History</h2>
            <Link
              href="/dashboard/bookings"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>View full history</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden divide-y divide-slate-800">
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No bookings recorded yet.
              </div>
            ) : (
              bookings.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{b.service.name}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{formatDate(b.bookingDate)}</span>
                      <span>•</span>
                      <span>{b.timeSlot}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-300">
                        {formatCurrency(b.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/bookings"
                    className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1"
                  >
                    <span>View details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
