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

  let styles = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700';
  let dotColor = 'bg-slate-400';
  let label = status;

  switch (normalized) {
    case 'PENDING':
      styles =
        'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/30';
      dotColor = 'bg-amber-500 animate-pulse';
      label = 'Pending Approval';
      break;
    case 'CONFIRMED':
      styles =
        'bg-teal-50 text-teal-800 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-500/30';
      dotColor = 'bg-teal-500';
      label = 'Confirmed';
      break;
    case 'COMPLETED':
      styles =
        'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30';
      dotColor = 'bg-emerald-500';
      label = 'Completed';
      break;
    case 'CANCELLED':
      styles =
        'bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-500/30';
      dotColor = 'bg-rose-500';
      label = 'Cancelled';
      break;
    case 'ACTIVE':
      styles =
        'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30';
      dotColor = 'bg-emerald-500';
      label = 'Active';
      break;
    case 'INACTIVE':
      styles =
        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700';
      dotColor = 'bg-slate-400';
      label = 'Inactive';
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border shadow-2xs transition-all',
        styles,
        className
      )}
    >
      {showDot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColor)} />}
      <span>{label}</span>
    </span>
  );
}
