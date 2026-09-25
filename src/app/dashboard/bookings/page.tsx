'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmModal } from '@/components/ConfirmModal';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar,
  Clock,
  AlertCircle,
  XCircle,
  PlusCircle,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface Booking {
  id: string;
  bookingDate: string;
  timeSlot: string;
  totalPrice: number;
  status: string;
  notes?: string | null;
  cancellationReason?: string | null;
  service: {
    id: string;
    name: string;
    imageUrl?: string | null;
    durationMinutes: number;
    category?: {
      name: string;
    };
  };
}

export default function MyBookingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard/bookings');
      return;
    }
    if (user) {
      fetchBookings();
    }
  }, [user, isLoading, router, fetchBookings]);

  const handleOpenCancelModal = (booking: Booking) => {
    setSelectedBookingToCancel(booking);
    setCancelReason('');
    setActionError(null);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingToCancel) return;
    setCancelling(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/bookings/${selectedBookingToCancel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED',
          cancellationReason: cancelReason || 'Customer requested cancellation via portal',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel booking.');
      }

      setCancelModalOpen(false);
      setActionSuccess('Your booking has been cancelled successfully.');
      setTimeout(() => setActionSuccess(null), 4000);
      fetchBookings();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError('Failed to cancel booking.');
      }
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Bookings</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Review your service appointments, track status updates, and manage schedules.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-sm shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-fit cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Book Another Service</span>
          </Link>
        </div>

        {/* Feedback Alerts */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2.5 animate-in fade-in shadow-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-2.5 animate-in fade-in shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-500 dark:text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200 dark:border-slate-800">
          {[
            { label: 'All Bookings', value: 'ALL' },
            { label: 'Pending Approval', value: 'PENDING' },
            { label: 'Confirmed', value: 'CONFIRMED' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Cancelled', value: 'CANCELLED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`pb-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer ${
                statusFilter === tab.value
                  ? 'border-teal-700 text-teal-800 dark:border-teal-400 dark:text-teal-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label} (
              {tab.value === 'ALL'
                ? bookings.length
                : bookings.filter((b) => b.status === tab.value).length}
              )
            </button>
          ))}
        </div>

        {/* Bookings List / Skeletons / Empty */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800 animate-pulse h-36"
              />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={
              statusFilter === 'ALL'
                ? 'No Bookings Found'
                : `No ${statusFilter.toLowerCase()} bookings`
            }
            description="You don't have any appointments matching this category. Browse through our certified catalog to schedule your first service."
            actionText="Browse Available Services"
            actionHref="/services"
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const canCancel =
                booking.status === 'PENDING' || booking.status === 'CONFIRMED';

              return (
                <div
                  key={booking.id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all shadow-xs hover:shadow-md space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {booking.service.category && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
                            {booking.service.category.name}
                          </span>
                        )}
                        <StatusBadge status={booking.status} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {booking.service.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          <span className="font-semibold text-slate-900 dark:text-slate-200">
                            {formatDate(booking.bookingDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          <span>Arrival Slot: {booking.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 dark:text-slate-400">Fee:</span>
                          <span className="font-bold text-teal-700 dark:text-teal-400">
                            {formatCurrency(booking.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-2 sm:pt-0">
                      <Link
                        href={`/services/${booking.service.id}`}
                        className="btn-secondary flex-1 sm:flex-none text-xs text-center"
                      >
                        Service Details
                      </Link>

                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => handleOpenCancelModal(booking)}
                          className="btn-destructive flex-1 sm:flex-none text-xs"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notes / Special Instructions */}
                  {booking.notes && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2 font-medium">
                      <Info className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 mt-0.5" />
                      <span>
                        <strong className="text-slate-700 dark:text-slate-300 font-semibold">Your notes:</strong> {booking.notes}
                      </span>
                    </div>
                  )}

                  {/* Cancellation Reason if cancelled */}
                  {booking.status === 'CANCELLED' && booking.cancellationReason && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 font-medium">
                      <XCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
                      <span>
                        <strong className="text-rose-800 dark:text-rose-200 font-semibold">Cancellation record:</strong>{' '}
                        {booking.cancellationReason}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <ConfirmModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Confirm Booking Cancellation"
          description={`Are you sure you want to cancel your appointment for "${selectedBookingToCancel?.service.name}" scheduled for ${
            selectedBookingToCancel ? formatDate(selectedBookingToCancel.bookingDate) : ''
          }? This action will release your reserved slot.`}
          confirmText="Yes, Cancel Booking"
          cancelText="Keep Booking"
          isDestructive={true}
          isLoading={cancelling}
        />
      </div>
    </div>
  );
}
