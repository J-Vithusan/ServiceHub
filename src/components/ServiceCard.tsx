import React from 'react';
import Link from 'next/link';
import { Clock, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';

export interface ServiceCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationMinutes: number;
  status: string;
  imageUrl?: string | null;
  category?: {
    name: string;
    slug: string;
  } | null;
}

export function ServiceCard({
  id,
  name,
  description,
  price,
  durationMinutes,
  status,
  imageUrl,
  category,
}: ServiceCardProps) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500/50 shadow-xs hover:shadow-lg dark:bg-[#0e1619] dark:border-slate-800 dark:hover:border-teal-500/40 dark:shadow-sm dark:hover:shadow-teal-950/20 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Service Image with Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || fallbackImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category Pill Top Left */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-teal-800 backdrop-blur-md border border-slate-200/80 shadow-xs dark:bg-slate-900/90 dark:text-teal-300 dark:border-slate-700/60">
              {category.name}
            </span>
          </div>
        )}

        {/* Status Pill Top Right */}
        {status !== 'ACTIVE' && (
          <div className="absolute top-3 right-3">
            <StatusBadge status={status} />
          </div>
        )}

        {/* Price & Rating Overlay Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{formatCurrency(price)}</span>
            <span className="text-xs text-slate-200 font-medium">/ fixed rate</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold shadow-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>4.9</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-1 mb-2">
          {name}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {description}
        </p>

        {/* Metadata Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>{durationMinutes} min appointment</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verified Pro</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/services/${id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase text-slate-700 bg-slate-100 hover:bg-teal-700 hover:text-white border border-slate-200/80 hover:border-teal-700 dark:text-slate-200 dark:bg-slate-800/80 dark:hover:bg-teal-600 dark:hover:text-white dark:border-slate-700 dark:hover:border-teal-500 shadow-2xs transition-all group-hover:bg-teal-700 group-hover:text-white dark:group-hover:bg-teal-600"
        >
          <span>View Details & Schedule</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
