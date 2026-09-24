'use client';

import React, { useState, useEffect, useCallback, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ServiceCard, ServiceCardProps } from '@/components/ServiceCard';
import { EmptyState } from '@/components/EmptyState';
import { Search, SlidersHorizontal, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  _count?: { services: number };
}

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState<ServiceCardProps[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Fetch Categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch Services based on active filters
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (sortOption) params.append('sort', sortOption);

      const res = await fetch(`/api/services?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortOption]);

  useEffect(() => {
    startTransition(() => {
      fetchServices();
    });
  }, [fetchServices]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOption('newest');
  };

  return (
    <div className="min-h-screen py-12 md:py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-500/30 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Comprehensive Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore All Services
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-normal leading-relaxed">
            Browse through our verified professional catalog. Select a specialist, check availability,
            and book instantly with transparent rates.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs dark:bg-[#0f171a] dark:border-slate-800 mb-8 space-y-4 transition-all">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search services by keyword, description or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:bg-slate-900/80 dark:border-slate-700/80 dark:text-white dark:placeholder-slate-500 transition"
                id="service-search-input"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full md:w-48 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500 dark:bg-slate-900/80 dark:border-slate-700/80 dark:text-white cursor-pointer transition"
                id="sort-select"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A - Z</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/25 dark:bg-teal-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/80 dark:border-slate-700/60'
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/25 dark:bg-teal-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/80 dark:border-slate-700/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid or Loading / Empty States */}
        {loading || isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-[#0e1619] border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 animate-pulse shadow-2xs"
              >
                <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No Services Found"
            description="We couldn't find any services matching your active filters. Try searching with different terms or reset your filters."
            actionText="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>Showing {services.length} available service{services.length !== 1 ? 's' : ''}</span>
              {(selectedCategory !== 'all' || searchQuery.trim()) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-semibold"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  slug={service.slug}
                  description={service.description}
                  price={service.price}
                  durationMinutes={service.durationMinutes}
                  status={service.status}
                  imageUrl={service.imageUrl}
                  category={service.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading services catalog...</p>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
