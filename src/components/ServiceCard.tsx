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
    <div className="group rounded-2xl bg-card border border-border hover:border-teal-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden interactive-card">
      {/* Service Image with Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || fallbackImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Category Pill Top Left */}
        {category && (
          <div className="absolute top-3.5 left-3.5">
            <span className="mono-index px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/15 shadow-xs">
              {category.name}
            </span>
          </div>
        )}

        {/* Status Pill Top Right */}
        {status !== 'ACTIVE' && (
          <div className="absolute top-3.5 right-3.5">
            <StatusBadge status={status} />
          </div>
        )}

        {/* Price & Rating Overlay Bottom */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{formatCurrency(price)}</span>
            <span className="text-xs text-white/70 font-medium">/ flat rate</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-amber-400 text-xs font-bold shadow-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>4.9</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-1 mb-2">
            {name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div>
          {/* Metadata Bar */}
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
              <span>{durationMinutes} min execution</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified Pro</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/services/${id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-foreground bg-secondary hover:bg-teal-700 hover:text-white border border-border hover:border-teal-700 dark:hover:bg-teal-600 dark:hover:border-teal-500 transition-all group-hover:bg-teal-700 group-hover:text-white dark:group-hover:bg-teal-600"
          >
            <span>View Specification</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
