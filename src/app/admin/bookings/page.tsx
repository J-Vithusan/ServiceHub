'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminNav } from '@/components/AdminNav';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmModal } from '@/components/ConfirmModal';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Clock,
  User,
  X,
  FileText,
} from 'lucide-react';

interface Booking {
  id: string;
  bookingDate: string;
  timeSlot: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  service: {
    id: string;
    name: string;
    price: number;
    category?: {
      name: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
  };
}

export default function AdminBookingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selected Booking for Detailed Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Status Change State
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/admin/login');
        return;
      }
      loadBookings();
    }
  }, [user, isLoading, router, loadBookings]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    let cancellationReason: string | undefined = undefined;

    if (newStatus === 'CANCELLED') {
      const reason = window.prompt('Enter cancellation reason (optional):');
      if (reason === null) return; // user cancelled prompt
      cancellationReason = reason || 'Cancelled by administrator.';
    }

    try {
      setUpdatingId(bookingId);
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          cancellationReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update booking status.');
      }

      showToast(`Status updated to ${newStatus}`);
      loadBookings();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, 'error');
      } else {
        showToast('Error updating status', 'error');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.user.name.toLowerCase().includes(search.toLowerCase()) ||
      b.user.email.toLowerCase().includes(search.toLowerCase()) ||
      b.service.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manage Customer Bookings
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Review incoming appointments, transition statuses, and inspect booking details.
            </p>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in shadow-xs ${
              toast.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            )}
            <span className="font-medium">{toast.text}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xs">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by customer name, email, or service title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition font-medium"
              id="admin-booking-search"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Card-Based View (< 768px) */}
        <div className="block md:hidden space-y-4">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-xs">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">No customer bookings found.</div>
          ) : (
            filteredBookings.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-card border border-border space-y-3.5 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-foreground text-sm">{b.user.name}</p>
                    <p className="text-xs text-muted-foreground">{b.user.email}</p>
                    {b.user.phone && <p className="text-xs text-muted-foreground">{b.user.phone}</p>}
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="p-3 rounded-xl bg-secondary/60 border border-border text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-semibold text-foreground">{b.service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival:</span>
                    <span className="font-medium text-foreground">{formatDate(b.bookingDate)} ({b.timeSlot})</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="text-teal-700 dark:text-teal-400">{formatCurrency(b.totalPrice)}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {b.status === 'COMPLETED' || b.status === 'CANCELLED' ? (
                    <span className="flex-1 text-xs text-muted-foreground italic py-2">Terminal State</span>
                  ) : (
                    <select
                      disabled={updatingId === b.id}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-secondary border border-border text-xs text-foreground focus:outline-none focus:border-amber-400 font-medium cursor-pointer"
                    >
                      <option value={b.status} disabled>Change to...</option>
                      {b.status === 'PENDING' && (
                        <>
                          <option value="CONFIRMED">Confirm Booking</option>
                          <option value="CANCELLED">Cancel Booking</option>
                        </>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <>
                          <option value="COMPLETED">Mark as Completed</option>
                          <option value="CANCELLED">Cancel Booking</option>
                        </>
                      )}
                    </select>
                  )}

                  <button
                    onClick={() => {
                      setSelectedBooking(b);
                      setDetailModalOpen(true);
                    }}
                    className="min-h-[44px] px-4 rounded-xl bg-secondary hover:bg-muted border border-border text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Bookings Table (>= 768px) */}
        <div className="hidden md:block rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Service Ordered</th>
                  <th className="px-6 py-4 font-bold">Scheduled Arrival</th>
                  <th className="px-6 py-4 font-bold">Rate</th>
                  <th className="px-6 py-4 font-bold">Current Status</th>
                  <th className="px-6 py-4 font-bold">Status Action</th>
                  <th className="px-6 py-4 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No customer bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{b.user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{b.user.email}</p>
                        {b.user.phone && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">{b.user.phone}</p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{b.service.name}</p>
                        <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold">
                          {b.service.category?.name || 'Standard'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(b.bookingDate)}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{b.timeSlot}</p>
                      </td>

                      <td className="px-6 py-4 font-extrabold text-teal-700 dark:text-teal-400">
                        {formatCurrency(b.totalPrice)}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={b.status} />
                      </td>

                      <td className="px-6 py-4">
                        {/* State Machine Status Dropdown */}
                        {b.status === 'COMPLETED' || b.status === 'CANCELLED' ? (
                          <span className="text-[11px] text-slate-400 italic">Terminal State</span>
                        ) : (
                          <select
                            disabled={updatingId === b.id}
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className="py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer disabled:opacity-50 font-medium"
                          >
                            <option value={b.status} disabled>
                              Change to...
                            </option>
                            {b.status === 'PENDING' && (
                              <>
                                <option value="CONFIRMED">Confirm Booking</option>
                                <option value="CANCELLED">Cancel Booking</option>
                              </>
                            )}
                            {b.status === 'CONFIRMED' && (
                              <>
                                <option value="COMPLETED">Mark as Completed</option>
                                <option value="CANCELLED">Cancel Booking</option>
                              </>
                            )}
                          </select>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="View Full Booking Dossier"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Dossier Modal */}
        {detailModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f171a] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={selectedBooking.status} />
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">ID: {selectedBooking.id}</span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
                Booking Information Dossier
              </h2>

              <div className="space-y-4 text-xs font-medium">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
                    Customer Details
                  </h4>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedBooking.user.name}</p>
                  <p className="text-slate-600 dark:text-slate-300">Email: {selectedBooking.user.email}</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Phone: {selectedBooking.user.phone || 'Not provided'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Address: {selectedBooking.user.address || 'Standard service location'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
                    Service & Schedule
                  </h4>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedBooking.service.name}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Scheduled Date: {formatDate(selectedBooking.bookingDate)}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">Arrival Window: {selectedBooking.timeSlot}</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Total Amount: <strong className="text-teal-700 dark:text-teal-400 font-extrabold">{formatCurrency(selectedBooking.totalPrice)}</strong>
                  </p>
                </div>

                {selectedBooking.notes && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 space-y-1">
                    <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
                      Special Instructions from Customer
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                {selectedBooking.cancellationReason && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 space-y-1">
                    <h4 className="font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 text-[10px]">
                      Cancellation Details
                    </h4>
                    <p>{selectedBooking.cancellationReason}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
