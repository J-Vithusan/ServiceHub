import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'violet';
}

export function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = 'blue',
}: StatsCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/10',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/10',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
      glow: 'shadow-violet-500/10',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl transition-all duration-200 hover:border-slate-700',
        scheme.glow
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div
          className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center border',
            scheme.bg,
            scheme.border,
            scheme.text
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-black tracking-tight text-white">{value}</span>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full',
              isPositive
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-rose-500/15 text-rose-400'
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
