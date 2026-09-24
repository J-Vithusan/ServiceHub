import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: 'teal' | 'emerald' | 'amber' | 'blue';
}

export function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = 'teal',
}: StatsCardProps) {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      border: 'border-teal-200/80 dark:border-teal-500/30',
      text: 'text-teal-700 dark:text-teal-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/80 dark:border-emerald-500/30',
      text: 'text-emerald-700 dark:text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200/80 dark:border-amber-500/30',
      text: 'text-amber-700 dark:text-amber-400',
    },
    blue: {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-200/80 dark:border-sky-500/30',
      text: 'text-sky-700 dark:text-sky-400',
    },
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md dark:bg-[#0f171a] dark:border-slate-800 dark:hover:border-slate-700 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center border shadow-2xs',
            scheme.bg,
            scheme.border,
            scheme.text
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border',
              isPositive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30'
                : 'bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-500/30'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
