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
        <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Loading your dashboard...</p>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="mono-index px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-secondary text-foreground border border-border">
                {user.role} DASHBOARD
              </span>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="mono-index px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                >
                  Admin Console &rarr;
                </Link>
              )}
            </div>
            <h1 className="editorial-title text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Welcome back, <span className="text-teal-700 dark:text-teal-400">{user.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Manage your scheduled service appointments and profile details.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Link
              href="/services"
              className="btn-primary w-full sm:w-auto text-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Book New Service</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="btn-secondary w-full sm:w-auto text-xs"
            >
              <User className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </div>
        </div>

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Awaiting Approval</p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Pending admin confirmation</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Confirmed & Scheduled</p>
              <p className="text-3xl font-extrabold text-teal-700 dark:text-teal-400 mt-1">{confirmedCount}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Upcoming technician arrivals</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Completed Services</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Fulfilled successfully</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Next Upcoming Appointment Highlight */}
        {upcomingBooking ? (
          <div className="p-6 sm:p-7 rounded-3xl bg-teal-50/70 dark:bg-[#0f171a] border border-teal-200 dark:border-teal-800/70 shadow-lg dark:shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-300/60 dark:border-teal-800">
                    Next Upcoming Appointment
                  </span>
                  <StatusBadge status={upcomingBooking.status} />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {upcomingBooking.service.name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">{formatDate(upcomingBooking.bookingDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span>Slot: {upcomingBooking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Rate:</span>
                    <span className="font-bold text-teal-700 dark:text-teal-400">
                      {formatCurrency(upcomingBooking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/bookings"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-sm shadow-teal-700/20 transition-all cursor-pointer"
                >
                  Manage Booking
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800 text-center space-y-4 shadow-xs">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Upcoming Appointments</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                You have no pending or confirmed bookings right now. Ready to book your next home or commercial service?
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-sm shadow-teal-700/20 cursor-pointer"
            >
              Browse Services
            </Link>
          </div>
        )}

        {/* Recent Bookings Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Booking History</h2>
            <Link
              href="/dashboard/bookings"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              <span>View full history</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                No bookings recorded yet.
              </div>
            ) : (
              bookings.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{b.service.name}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>{formatDate(b.bookingDate)}</span>
                      <span>•</span>
                      <span>{b.timeSlot}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(b.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/bookings"
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 font-medium flex items-center gap-1 transition-colors"
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
