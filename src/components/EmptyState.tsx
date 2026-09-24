import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f171a]/50 my-6 transition-colors duration-200">
      <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 dark:bg-teal-950/40 dark:border-teal-500/30 dark:text-teal-400 flex items-center justify-center mb-4 shadow-2xs">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
