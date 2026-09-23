import React from 'react';
import { cn } from '@/lib/utils';

export type BookingStatusType = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface StatusBadgeProps {
  status: BookingStatusType | string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';
  let label = status;

  switch (normalized) {
    case 'PENDING':
      styles = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      dotColor = 'bg-amber-400 animate-pulse';
      label = 'Pending Approval';
      break;
    case 'CONFIRMED':
      styles = 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      dotColor = 'bg-blue-400';
      label = 'Confirmed';
      break;
    case 'COMPLETED':
      styles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      dotColor = 'bg-emerald-400';
      label = 'Completed';
      break;
    case 'CANCELLED':
      styles = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      dotColor = 'bg-rose-400';
      label = 'Cancelled';
      break;
    case 'ACTIVE':
      styles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      dotColor = 'bg-emerald-400';
      label = 'Active';
      break;
    case 'INACTIVE':
      styles = 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
      dotColor = 'bg-zinc-400';
      label = 'Inactive';
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all',
        styles,
        className
      )}
    >
      {showDot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />}
      {label}
    </span>
  );
}
